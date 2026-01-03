import type { CampaignLiveWebSocketMessage, CampaignLiveClientMessage } from '$lib/types/campaign-types';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting';

export function createCampaignLiveConnection(campaignId: string) {
  let ws = $state<WebSocket | null>(null);
  let status = $state<ConnectionStatus>('disconnected');
  let reconnectAttempts = $state(0);
  let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  let isConnecting = $state(false);
  let messageHandler: ((message: CampaignLiveWebSocketMessage) => void) | null = null;
  const maxReconnectDelay = 30000; // 30 seconds

  function connect() {
    // Prevent multiple simultaneous connection attempts
    if (ws?.readyState === WebSocket.OPEN) return;
    if (isConnecting) {
      return;
    }
    
    isConnecting = true;
    status = 'connecting';
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const url = `${protocol}//${window.location.host}/api/campaigns/${campaignId}/live`;
    
    try {
      const websocket = new WebSocket(url);
      
      websocket.onopen = () => {
        isConnecting = false;
        status = 'connected';
        reconnectAttempts = 0;
        ws = websocket;
        
        // Attach message handler if it was set before connection
        if (messageHandler) {
          const handler = messageHandler; // Store in local variable for type safety
          ws.onmessage = (event) => {
            try {
              const message = JSON.parse(event.data) as CampaignLiveWebSocketMessage;
              handler(message);
            } catch (error) {
              console.error('Failed to parse WebSocket message:', error);
            }
          };
        }
      };
      
      websocket.onclose = (event) => {
        isConnecting = false;
        status = 'disconnected';
        ws = null;
        scheduleReconnect();
      };
      
      websocket.onerror = (event) => {
        isConnecting = false;
        status = 'disconnected';
        scheduleReconnect();
      };
      
      ws = websocket;
    } catch (error) {
      isConnecting = false;
      console.error('Failed to create WebSocket:', error);
      status = 'disconnected';
      scheduleReconnect();
    }
  }

  function scheduleReconnect() {
    if (reconnectTimeout) return;
    
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), maxReconnectDelay);
    reconnectAttempts++;
    status = 'reconnecting';
    
    reconnectTimeout = setTimeout(() => {
      reconnectTimeout = null;
      connect();
    }, delay);
  }

  function disconnect() {
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }
    isConnecting = false;
    ws?.close();
    ws = null;
    status = 'disconnected';
    reconnectAttempts = 0;
  }

  function send(message: CampaignLiveClientMessage) {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, message not sent:', message);
    }
  }

  function onMessage(handler: (message: CampaignLiveWebSocketMessage) => void) {
    // Store the handler so we can attach it when WebSocket connects
    messageHandler = handler;
    
    // If WebSocket is already connected, attach handler immediately
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as CampaignLiveWebSocketMessage;
          handler(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };
    }
  }

  return {
    get status() { return status; },
    get connected() { return status === 'connected'; },
    connect,
    disconnect,
    send,
    onMessage
  };
}

