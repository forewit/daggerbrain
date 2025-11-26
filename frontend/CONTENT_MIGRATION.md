# Content Migration to Database

This document outlines the migration of content files from the frontend to the database.

## Status

✅ **Completed:**
- Database repository functions for querying content (`frontend/src/lib/server/db/repositories/content.ts`)
- Seed script to load content into database (`frontend/scripts/seed-content.ts`)
- API route for fetching content (`frontend/src/routes/api/content/+server.ts`)

⏳ **Remaining:**
- Update helper functions in `frontend/src/lib/ts/character/helpers.ts` to fetch from database
- Create server load function to fetch and pass content to client
- Update components to use database-backed content
- Remove or deprecate frontend content files

## Running the Seed Script

Before running the seed script, ensure you have the required dependencies:

```bash
# Install @libsql/client if not already installed
bun add @libsql/client
```

Set the required environment variables:
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_D1_DATABASE_ID`
- `CLOUDFLARE_API_TOKEN`

Then run:
```bash
bun run db:seed
```

## Next Steps

1. **Create a server load function** in `frontend/src/routes/+layout.server.ts` to fetch all content:
   ```typescript
   export const load = async (event) => {
     const db = getDb(event);
     const [domains, classes, ancestryCards, communityCards, transformationCards, weapons, armor, loot, consumables] = await Promise.all([
       contentRepo.getAllDomains(db),
       contentRepo.getAllClasses(db),
       contentRepo.getAllAncestryCards(db),
       contentRepo.getAllCommunityCards(db),
       contentRepo.getAllTransformationCards(db),
       contentRepo.getAllWeapons(db),
       contentRepo.getAllArmor(db),
       contentRepo.getAllLoot(db),
       contentRepo.getAllConsumables(db)
     ]);
     
     return {
       content: {
         domains: Object.fromEntries(domains.map(d => [d.id, d])),
         classes: Object.fromEntries(classes.map(c => [c.id, c])),
         // ... etc
       }
     };
   };
   ```

2. **Create a content store** that holds the content data from the server load

3. **Update helpers** to use the content store instead of importing files

4. **Test thoroughly** to ensure all content is accessible

5. **Remove frontend content files** once migration is complete

## API Endpoints

The content API is available at `/api/content?type=<type>&id=<id>&domainId=<domainId>&category=<category>`

Supported types:
- `domains` - Get all domains or a specific domain by id
- `domain-cards` - Get domain cards (optionally filtered by domainId)
- `classes` - Get all classes or a specific class by id
- `subclasses` - Get subclasses (requires classId parameter)
- `ancestry-cards` - Get all ancestry cards or one by id
- `community-cards` - Get all community cards or one by id
- `transformation-cards` - Get all transformation cards or one by id
- `weapons` - Get all weapons or filtered by category
- `armor` - Get all armor or one by id
- `loot` - Get all loot or one by id
- `consumables` - Get all consumables or one by id

