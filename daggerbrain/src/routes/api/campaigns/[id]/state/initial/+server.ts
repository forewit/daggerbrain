import { get_campaign_state, get_campaign_characters } from '$lib/remote/campaigns.remote';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
  const campaignId = params.id;
  if (!campaignId) {
    return new Response('Campaign ID required', { status: 400 });
  }
  
  // TODO: Add authentication (shared secret or validate from DO worker)
  // For now, allow unauthenticated (DO worker is in same account)
  
  try {
    const [state, characters] = await Promise.all([
      get_campaign_state(campaignId),
      get_campaign_characters(campaignId)
    ]);
    
    return Response.json({ state, characters });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to load state' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

