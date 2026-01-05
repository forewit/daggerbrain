import type { CampaignLiveWebSocketMessage, CampaignLiveClientMessage } from '$lib/types/campaign-types';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting';

export function createCampaignLiveConnection(campaignId: string) {
  let ws = $state<WebSocket | null>(null);
  let status = $state<ConnectionStatus>('disconnected');
  let reconnectAttempts = $state(0);
  let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  let isConnecting = $state(false);
  let messageHandler: ((message: CampaignLiveWebSocketMessage) => void) | null = null;
  let lastKnownVersion = $state<number | undefined>(undefined);
  let shouldReconnect = $state(true); // Flag to prevent reconnection after explicit disconnect
  const maxReconnectDelay = 30000; // 30 seconds

  function connect() {
    // Prevent multiple simultaneous connection attempts
    if (ws?.readyState === WebSocket.OPEN) {
      return;
    }
    if (isConnecting) {
      return;
    }
    
    // Don't connect if we've been explicitly disconnected
    if (!shouldReconnect) {
      return;
    }
    
    isConnecting = true;
    status = 'connecting';
    shouldReconnect = true; // Allow reconnection when connecting
    
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const url = `${protocol}//${window.location.host}/api/campaigns/${campaignId}/live`;
    
    try {
      const websocket = new WebSocket(url);
      
      websocket.onopen = () => {
        isConnecting = false;
        status = 'connected';
        reconnectAttempts = 0;
        ws = websocket;
        
        // Send rejoin message if we have a last known version
        if (lastKnownVersion !== undefined) {
          ws.send(JSON.stringify({
            type: 'rejoin',
            lastKnownVersion
          }));
        }
        
        // Attach message handler if it was set before connection
        if (messageHandler) {
          // Store in local variable for type narrowing (messageHandler could be reassigned)
          const handler = messageHandler;
          ws.onmessage = (event) => {
            try {
              const parsed = JSON.parse(event.data);
              // Type assertion is necessary here as JSON.parse returns 'any'
              // Runtime validation happens via the message handler's type checking
              const message = parsed as CampaignLiveWebSocketMessage;
              
              // Update last known version from versioned messages
              if ('version' in message && typeof message.version === 'number') {
                lastKnownVersion = message.version;
              }
              
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
        // Only reconnect if we haven't been explicitly disconnected
        if (shouldReconnect) {
          scheduleReconnect();
        }
      };
      
      websocket.onerror = (event) => {
        isConnecting = false;
        status = 'disconnected';
        // Only reconnect if we haven't been explicitly disconnected
        if (shouldReconnect) {
          scheduleReconnect();
        }
      };
      
      ws = websocket;
    } catch (error) {
      isConnecting = false;
      console.error('Failed to create WebSocket:', error);
      status = 'disconnected';
      // Only reconnect if we haven't been explicitly disconnected
      if (shouldReconnect) {
        scheduleReconnect();
      }
    }
  }

  function scheduleReconnect() {
    if (reconnectTimeout) return;
    if (!shouldReconnect) return; // Don't reconnect if explicitly disconnected
    
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), maxReconnectDelay);
    reconnectAttempts++;
    status = 'reconnecting';
    
    reconnectTimeout = setTimeout(() => {
      reconnectTimeout = null;
      if (shouldReconnect) {
        connect();
      }
    }, delay);
  }

  function disconnect() {
    shouldReconnect = false; // Prevent reconnection
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }
    isConnecting = false;
    ws?.close();
    ws = null;
    status = 'disconnected';
    reconnectAttempts = 0;
    // Keep lastKnownVersion on disconnect for rejoin
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
          const parsed = JSON.parse(event.data);
          // Type assertion is necessary here as JSON.parse returns 'any'
          // Runtime validation happens via the message handler's type checking
          const message = parsed as CampaignLiveWebSocketMessage;
          
          // Update last known version from versioned messages
          if ('version' in message && typeof message.version === 'number') {
            lastKnownVersion = message.version;
          }
          
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

