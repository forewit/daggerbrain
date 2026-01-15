import { CampaignLiveDO } from './campaign-live';

// Named export required for Durable Object
export { CampaignLiveDO };

// Default export required (cannot be the DO class)
export default {
  async fetch(request: Request): Promise<Response> {
    return new Response('Campaigns DO Worker', { status: 200 });
  },
};

