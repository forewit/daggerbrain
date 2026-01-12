# Testing Guide

This document outlines testing steps for all features in the application. Each section includes both positive (happy path) and negative (error/edge case) scenarios.

**Note**: Many scenarios require multiple user accounts or browser sessions to fully test. Scenarios that require multiple users are marked with `[Multi-user]`.

## 1. Characters

### Create Character

**Standalone Character**
- Create a new character without assigning to a campaign
- Verify character appears in your characters list
- Verify character has no campaign_id set

**Character in Campaign (Player)**
- As a player, create a character while in a campaign
- Verify character is automatically assigned to the campaign
- Verify character is not claimable (owned by you)

**Character in Campaign (GM - Claimable)**
- As a GM, create a character in your campaign with claimable option
- Verify character appears in campaign as unassigned/claimable
- Verify character ownership is set to GM initially

**Character in Campaign (GM - Non-claimable)**
- As a GM, create a character in your campaign without claimable option
- Verify character is assigned to you (not claimable)

**Character Limit**
- Create 3 characters (at the limit)
- Attempt to create a 4th character
- Verify error message about character limit (3 max)
- Delete one character
- Verify you can now create a new character

### Modify Character

**Basic Updates**
- Update character name
- Update character level
- Update character image
- Verify all changes persist after page refresh

**Character Stats (Campaign Context)**
- Update marked HP (hit points)
- Update marked stress
- Update marked hope
- Update marked armor
- Add/remove active conditions (hidden, restrained, vulnerable)
- Verify updates appear in campaign view for other members

**Inventory Updates**
- Add/remove weapons, armor, consumables, loot
- Update item quantities
- Modify custom item properties (tier, damage thresholds, etc.)
- Verify inventory changes persist

**Character Settings**
- Update character settings and choices
- Modify level-up choices
- Update card selections
- Verify all settings persist

### Delete Character

**Standalone Character**
- Delete a character that is not in any campaign
- Verify character is removed from your characters list
- Verify character data is deleted from database

**Character in Campaign**
- Delete a character that is assigned to a campaign
- Verify character is removed from campaign view
- Verify character is removed from your characters list
- Verify Durable Object is notified of character removal

**Permission Check**
- Attempt to delete another user's character
- Verify error message about permission denied

### Character Permissions

**Owner Access**
- View your own character
- Edit your own character
- Verify full access to all character features

**GM Access to Player Character**
- As GM, view a player's character in your campaign
- Verify you can edit the character (HP, stress, conditions, etc.)
- Verify you can see all character details

**Player Access to Other Player's Character**
- As a player, view another player's character in the same campaign
- Verify you can view the character
- Verify you cannot edit the character
- Attempt to edit and verify error message

**Non-Member Access**
- Attempt to view a character from a campaign you're not in
- Verify access is denied or character is not visible

### Character Image Uploads

**Valid Image Upload**
- Upload an image for a character (JPG, PNG, WebP)
- Verify image appears in character sheet
- Verify image URL is generated correctly
- Verify image is stored in R2_USERCONTENT bucket

**Image Size Limit**
- Attempt to upload an image larger than 5MB
- Verify error message about file size limit

**Invalid File Type**
- Attempt to upload a non-image file (PDF, text file, etc.)
- Verify error message about invalid file type

## 2. Campaigns

### Create Campaign

**Basic Campaign**
- Create a new campaign with just a name
- Verify campaign appears in your campaigns list
- Verify you are added as GM member
- Verify initial campaign state is created (fear_track: 0, empty countdowns)
- Verify invite code is generated

**Campaign with Description**
- Create a campaign with name and description
- Verify description is saved and displayed

**Campaign with GM Display Name**
- Create a campaign with a custom GM display name
- Verify display name appears in campaign members list
- Verify display name is used in invite link preview

### Modify Campaign

**Update Campaign Name (GM)**
- As GM, update the campaign name
- Verify name change is reflected immediately
- Verify name appears correctly for all members

**Update Campaign Description (GM)**
- As GM, update the campaign description
- Verify description change persists

**Player Cannot Modify**
- As a player, attempt to update campaign name or description
- Verify error message about GM-only permissions

### Delete Campaign

**GM Deletes Campaign**
- As GM, delete a campaign
- Verify campaign is removed from your campaigns list
- Verify all campaign members are removed
- Verify all characters are unassigned from campaign (campaign_id set to null)
- Verify campaign state is deleted
- Verify campaign homebrew vault entries are deleted
- Verify campaign_characters join table entries are deleted

**Player Cannot Delete**
- As a player, attempt to delete a campaign
- Verify error message about GM-only permissions

### Campaign Permissions

**GM Access**
- As GM, verify you can view all campaign features
- Verify you can edit campaign state (fear, countdowns, notes)
- Verify you can manage members
- Verify you can add/remove characters
- Verify you can manage homebrew vault

**Player Access**
- As a player, verify you can view campaign
- Verify you can see campaign state (if fear_visible_to_players is true)
- Verify you cannot edit campaign state
- Verify you cannot manage members
- Verify you can add your own characters
- Verify you can claim unassigned characters

**Non-Member Access**
- Attempt to access a campaign you're not a member of
- Verify access is denied or campaign is not visible

## 3. Homebrew

### Create Homebrew Items

**All Homebrew Types**
Test creating each of the 13 homebrew types:
- Class
- Subclass
- Primary Weapon
- Secondary Weapon
- Armor
- Loot
- Consumable
- Beastform
- Ancestry Card
- Community Card
- Transformation Card
- Domain Card (for each domain: arcana, blade, bone, codex, grace, midnight, sage, splendor, valor)

**Basic Creation**
- Create a homebrew item with required fields
- Verify item appears in your homebrew list
- Verify item is marked with source_id: 'Homebrew'
- Verify item can be used in character creation/editing

**Homebrew with Image**
- Create a homebrew item and upload an image
- Verify image is stored and displayed correctly

**Homebrew in Campaign Context**
- Create a homebrew item while viewing a campaign
- Verify item is available to campaign members when added to vault

### Modify Homebrew Items

**Update Homebrew Properties**
- Update name, description, or other properties of a homebrew item
- Verify changes persist
- Verify changes are reflected in characters using the item

**Update Homebrew Image**
- Replace the image for a homebrew item
- Verify new image is displayed

### Delete Homebrew Items

**Delete Own Homebrew**
- Delete a homebrew item you created
- Verify item is removed from your homebrew list
- Verify item is removed from any campaign vaults it was in
- Verify characters using the item still function (item may show as missing)

**Cannot Delete Others' Homebrew**
- Attempt to delete a homebrew item created by another user
- Verify error message about permission denied

### Homebrew Limits

**Reach Homebrew Limit**
- Create 5 homebrew items (at the limit)
- Attempt to create a 6th homebrew item
- Verify error message about homebrew limit (5 max)
- Delete one homebrew item
- Verify you can now create a new homebrew item

**Limit Across All Types**
- Verify the 5-item limit applies across all homebrew types combined
- Create 3 classes and 2 weapons (total 5)
- Attempt to create a 6th item of any type
- Verify limit is enforced

### Homebrew Permissions

**Owner Access**
- View your own homebrew items
- Edit your own homebrew items
- Verify full access

**Campaign Member Access**
- View homebrew items added to campaign vault
- Verify you can see the items in compendium
- Verify you cannot edit items (even in campaign vault)
- Attempt to edit and verify error message

**Non-Member Access**
- Attempt to view homebrew items from a campaign you're not in
- Verify items are not visible

### Campaign Homebrew Vault

**Add Item to Vault (GM)**
- As GM, add a homebrew item to campaign vault
- Verify item appears in vault list
- Verify item becomes available to all campaign members
- Verify item appears in compendium for campaign members

**Remove Item from Vault (GM)**
- As GM, remove an item from campaign vault
- Verify item is removed from vault
- Verify item is no longer available to campaign members

**Player Cannot Manage Vault**
- As a player, attempt to add item to vault
- Verify error message about GM-only permissions
- As a player, attempt to remove item from vault
- Verify error message about GM-only permissions

**Add Own Homebrew Only**
- As GM, attempt to add another user's homebrew to vault
- Verify error message about only adding your own items

## 4. Campaign Membership

### Join Campaign

**Join via Invite Link**
- Use a valid invite link to join a campaign
- Verify you are added as a player member
- Verify campaign appears in your campaigns list
- Verify you can access the campaign page

**Join with Display Name**
- Join a campaign and provide a display name
- Verify display name appears in campaign members list
- Verify display name is used instead of username

**Join without Display Name**
- Join a campaign without providing a display name
- Verify username is used as display name

**Join with Character**
- Join a campaign and bring an existing character
- Verify character is automatically assigned to the campaign
- Verify character is not claimable (owned by you)

**Join when Already Member**
- Attempt to join a campaign you're already a member of
- Verify error message about already being a member
- Verify no duplicate membership is created

**Join with Invalid Invite Code**
- Attempt to join using an invalid/non-existent invite code
- Verify error message about campaign not found

**Join when at Character Limit**
- Have 3 characters already
- Attempt to join a campaign with a character
- Verify error message about character limit
- Verify you can still join without bringing a character

### Leave Campaign

**Player Leaves Campaign**
- As a player, leave a campaign
- Verify you are removed from campaign members
- Verify your characters are unassigned from campaign (campaign_id set to null)
- Verify campaign_characters entries are removed
- Verify Durable Object is notified of character removals
- Verify campaign no longer appears in your campaigns list

**GM Cannot Leave**
- As GM, attempt to leave your campaign
- Verify error message about GM cannot leave
- Verify you must delete the campaign instead

**Leave with Multiple Characters**
- As a player with multiple characters in campaign, leave
- Verify all your characters are removed from campaign
- Verify all characters are unassigned

### Re-join Campaign

**Re-join After Leaving**
- Leave a campaign
- Use the same invite link to re-join
- Verify you are added as a new member
- Verify you can access the campaign again

**Re-join with New Character**
- Leave a campaign (characters were unassigned)
- Re-join and bring a character
- Verify character is assigned to campaign

## 5. Invite Links

### View Invite Link

**GM Can View**
- As GM, view the campaign invite link
- Verify link is displayed in format: `/campaigns/join/{invite_code}`
- Verify invite code is shown

**Player Cannot View**
- As a player, verify invite link section is not visible or accessible

### Copy Invite Link

**Copy Functionality**
- As GM, copy the invite link
- Verify link is copied to clipboard
- Verify copied link works when used in another browser/account

### Reset Invite Link

**GM Resets Invite Code**
- As GM, reset the invite code
- Verify new invite code is generated
- Verify old invite link no longer works (404 error)
- Verify new invite link works

**Player Cannot Reset**
- As a player, attempt to reset invite code
- Verify error message about GM-only permissions

**Use Reset Invite Link**
- Reset invite code
- Use the new invite link to join as a different user
- Verify join succeeds with new code

## 6. Character Assignment & Claiming

### GM Assigns Character to Campaign

**Assign as Claimable**
- As GM, assign a character to campaign as claimable (unassigned)
- Verify character appears in unassigned characters list
- Verify character is marked as claimable
- Verify character ownership remains with GM initially

**Assign as Non-claimable**
- As GM, assign a character to campaign as non-claimable
- Verify character appears in assigned characters list
- Verify character is owned by GM
- Verify character is not claimable

**Assign Existing Character**
- As GM, assign an existing character you own to the campaign
- Verify character is added to campaign
- Verify character appears in campaign characters list

### Player Claims Unassigned Character

**Successful Claim**
- As a player, claim an unassigned character
- Verify character ownership transfers to you
- Verify character is no longer claimable
- Verify character appears in your characters list
- Verify Durable Object is notified of ownership change

**Claim when at Character Limit**
- Have 3 characters already
- Attempt to claim an unassigned character
- Verify error message about character limit
- Verify character remains claimable (not claimed)

**Claim when Already Has Character**
- As a player with a character in the campaign, attempt to claim another
- Verify error message about already having a character
- Verify claim fails

**GM Cannot Claim**
- As GM, attempt to claim an unassigned character
- Verify error message about GMs cannot claim characters

### Unassign Character

**GM Unassigns Character**
- As GM, unassign a character (make it claimable again)
- Verify character becomes claimable
- Verify character ownership remains with current owner
- Verify character appears in unassigned list

**Player Cannot Unassign**
- As a player, attempt to unassign a character
- Verify error message about GM-only permissions

### Remove Character from Campaign

**GM Removes Character**
- As GM, remove a character from campaign
- Verify character's campaign_id is set to null
- Verify character is removed from campaign view
- Verify Durable Object is notified

**Character Owner Removes**
- As character owner, remove your character from campaign
- Verify character is unassigned
- Verify character remains in your characters list

### Concurrent Claiming (Race Condition)

**Multiple Players Claim Same Character** `[Multi-user]`
- Have two players attempt to claim the same unassigned character simultaneously
- Verify only one player succeeds
- Verify the other player gets an error about character already claimed
- Verify character ownership is correctly assigned to one player
- Verify no duplicate ownership occurs

## 7. Campaign State Updates

### Update Fear Track

**GM Updates Fear**
- As GM, update the fear track value
- Verify fear value is saved
- Verify fear is visible to GM
- Verify fear visibility to players respects `fear_visible_to_players` setting

**Toggle Fear Visibility**
- As GM, toggle fear visibility to players on/off
- As a player, verify you can/cannot see fear based on setting
- Verify setting persists

**Player Cannot Update Fear**
- As a player, attempt to update fear track
- Verify error message about GM-only permissions

### Countdowns

**Add Countdown (GM)**
- As GM, add a new countdown
- Verify countdown appears in campaign state
- Verify countdown has required fields (id, name, min, current, visibleToPlayers)
- Verify countdown appears in live view

**Update Countdown (GM)**
- As GM, update countdown current value
- Verify countdown updates
- Verify current value cannot go below min value

**Remove Countdown (GM)**
- As GM, remove a countdown
- Verify countdown is removed from campaign state
- Verify countdown disappears from live view

**Player Cannot Manage Countdowns**
- As a player, attempt to add/update/remove countdowns
- Verify error message about GM-only permissions

**Countdown Visibility**
- As GM, set countdown visibility to players on/off
- As a player, verify you can/cannot see countdown based on setting

### Campaign Notes

**GM Updates Notes**
- As GM, update campaign notes
- Verify notes are saved
- Verify notes are visible to GM
- Verify notes are visible to players (if applicable)

**Player Cannot Update Notes**
- As a player, attempt to update campaign notes
- Verify error message about GM-only permissions

### Updates with Durable Object

**DO Connected**
- With Durable Object connected, update campaign state (fear, countdowns, notes)
- Verify updates are broadcast to all connected clients in real-time
- Verify updates persist in D1 database

**DO Disconnected**
- With Durable Object disconnected, update campaign state
- Verify updates are saved to D1 database
- Reconnect Durable Object
- Verify updates are synced to DO and broadcast to clients

**DO Unavailable**
- With Durable Object unavailable, update campaign state
- Verify updates are saved to D1 database
- Verify application continues to function (graceful degradation)
- When DO becomes available, verify state syncs correctly

## 8. Character Sheet Updates

### Update Character Stats

**Update HP (marked_hp)**
- Update character's marked HP value
- Verify value is saved
- Verify value appears in campaign view for other members
- Verify Durable Object is notified (if in campaign)

**Update Stress (marked_stress)**
- Update character's marked stress value
- Verify value is saved and synced

**Update Hope (marked_hope)**
- Update character's marked hope value
- Verify value is saved and synced

**Update Armor (marked_armor)**
- Update character's marked armor value
- Verify value is saved and synced

**Add/Remove Conditions**
- Add conditions: hidden, restrained, vulnerable
- Remove conditions
- Verify conditions list updates correctly
- Verify conditions appear in campaign view

### Updates with Durable Object

**DO Connected**
- With Durable Object connected, update character stats
- Verify updates are broadcast to all connected clients in real-time
- Verify other campaign members see updates immediately
- Verify updates persist in D1 database

**DO Disconnected**
- With Durable Object disconnected, update character stats
- Verify updates are saved to D1 database
- Reconnect Durable Object
- Verify updates are synced to DO and broadcast to clients

**DO Unavailable**
- With Durable Object unavailable, update character stats
- Verify updates are saved to D1 database
- Verify application continues to function
- When DO becomes available, verify state syncs correctly

### Permission-Based Updates

**GM Editing Player Character**
- As GM, edit a player's character stats (HP, stress, conditions)
- Verify updates are saved
- Verify player sees updates in real-time
- Verify updates appear in campaign view

**Player Editing Own Character**
- As a player, edit your own character stats
- Verify updates are saved
- Verify GM and other players see updates in real-time

**Player Cannot Edit Other Player's Character**
- As a player, attempt to edit another player's character
- Verify error message about permission denied

## 9. Durable Object Scenarios

### Real-time Sync

**Updates when DO is Connected**
- With Durable Object connected, make updates (character stats, campaign state)
- Verify updates are broadcast to all connected WebSocket clients immediately
- Verify no delay in sync
- Verify all clients receive the same update

**Updates when DO is Disconnected**
- Disconnect Durable Object (close WebSocket)
- Make updates to character or campaign state
- Verify updates are saved to D1 database
- Reconnect WebSocket
- Verify updates are synced to DO
- Verify updates are broadcast to newly connected clients

**Updates when DO is Unavailable**
- Simulate DO unavailability (network issue, DO not running)
- Make updates to character or campaign state
- Verify updates are saved to D1 database
- Verify application continues to function normally
- When DO becomes available, verify state syncs correctly
- Verify no data loss occurred

### WebSocket Reconnection

**Automatic Reconnection**
- Disconnect WebSocket (close browser tab, network issue)
- Verify reconnection is attempted with exponential backoff
- Verify reconnection succeeds
- Verify state is synced after reconnection

**Reconnection with Stale State**
- Disconnect for extended period
- Make updates from another client
- Reconnect original client
- Verify client detects stale state (version mismatch)
- Verify client refreshes from D1 (source of truth)
- Verify client receives `refresh_required` message

**Reconnection State Sync**
- Disconnect client
- Make multiple updates from other clients
- Reconnect original client
- Verify all updates are received
- Verify state is consistent across all clients

### Stale Client Detection

**Version Mismatch**
- Have client A connected with version N
- Make updates from client B (version increments)
- Client A's lastKnownVersion < DO version
- Verify client A receives `refresh_required` message
- Verify client A refreshes from D1 instead of using stale DO cache

**Already Synced**
- Have client with lastKnownVersion = DO version
- Client sends rejoin message
- Verify client receives `already_synced` message
- Verify client does not refresh unnecessarily

### Multiple Clients

**All Clients Receive Updates** `[Multi-user]`
- Have multiple users connected to same campaign
- Make update from one client (character stat, campaign state)
- Verify all other connected clients receive the update
- Verify updates appear simultaneously on all clients
- Verify no client misses updates

**Character Updates Broadcast**
- Update character from one client
- Verify all connected clients see character update
- Verify update includes only changed fields (partial update)

**Campaign State Updates Broadcast**
- Update campaign state from one client
- Verify all connected clients see state update
- Verify fear, countdowns, notes updates are broadcast

**Character Added/Removed Broadcast**
- Add character to campaign
- Verify all connected clients see character added
- Remove character from campaign
- Verify all connected clients see character removed

**Member Updates Broadcast**
- Update member display name
- Verify all connected clients see member update

## 10. Image Uploads

### Character Image Upload

**Valid Image Upload**
- Upload an image for a character (JPG, PNG, WebP)
- Verify image is uploaded to R2_USERCONTENT bucket
- Verify image URL is generated in format: `/api/usercontent/images/{userId}/{uuid}.{ext}`
- Verify image appears in character sheet
- Verify image persists after page refresh

**Image Size Validation**
- Attempt to upload image larger than 5MB
- Verify error message about file size limit (5MB max)
- Verify upload is rejected

**Invalid File Type**
- Attempt to upload non-image file (PDF, text, etc.)
- Verify error message about file must be an image
- Verify upload is rejected

### Homebrew Image Upload

**Valid Image Upload**
- Upload an image for a homebrew item
- Verify image is stored in R2_USERCONTENT
- Verify image URL is generated correctly
- Verify image appears in homebrew item display

**Image in Campaign Vault**
- Add homebrew item with image to campaign vault
- Verify image is visible to campaign members
- Verify image loads correctly for all members

## 11. Permission Edge Cases

### Character Permissions

**View Character Without Permission**
- Attempt to access a character URL for a character you don't own and aren't in campaign with
- Verify access is denied or character is not found
- Verify appropriate error message

**Edit Character Without Permission**
- As a player, attempt to edit another player's character in the same campaign
- Verify error message about permission denied
- Verify edit operation fails

**Edit Character as Non-Member**
- Attempt to edit a character from a campaign you're not a member of
- Verify access is denied

### Campaign Permissions

**View Campaign Without Membership**
- Attempt to access a campaign URL for a campaign you're not a member of
- Verify access is denied or campaign is not found
- Verify appropriate error message

**Edit Campaign as Player**
- As a player, attempt to update campaign name or description
- Verify error message about GM-only permissions
- Attempt to update campaign state (fear, countdowns)
- Verify error message about GM-only permissions

### Homebrew Permissions

**Add to Vault as Player**
- As a player, attempt to add homebrew item to campaign vault
- Verify error message about GM-only permissions

**Edit Campaign Homebrew**
- As a campaign member (not owner), attempt to edit a homebrew item in the vault
- Verify error message about only owner can edit

### Character Claiming Permissions

**Claim Character as GM**
- As GM, attempt to claim an unassigned character
- Verify error message about GMs cannot claim characters

**Delete Someone Else's Character**
- Attempt to delete a character owned by another user
- Verify error message about only being able to delete your own characters

## 12. Real-time Sync

### Multiple Users in Campaign

**All Users See Updates** `[Multi-user]`
- Have multiple users (GM and players) connected to the same campaign
- Make update from one user (character stat, campaign state)
- Verify all other users see the update in real-time
- Verify updates appear simultaneously
- Verify no user misses updates

### Character Updates Broadcast

**Character Stat Updates**
- Update character HP, stress, hope, armor, or conditions
- Verify update is broadcast to all connected clients
- Verify all clients see the update immediately
- Verify update includes only changed fields (efficiency)

**Character Added Broadcast**
- Add a character to campaign
- Verify all connected clients receive `character_added` message
- Verify character appears in campaign view for all clients

**Character Removed Broadcast**
- Remove a character from campaign
- Verify all connected clients receive `character_removed` message
- Verify character disappears from campaign view for all clients

**Character Ownership Change Broadcast**
- Claim an unassigned character (ownership transfer)
- Verify all connected clients see ownership change
- Verify character moves from unassigned to assigned list

### Campaign State Updates Broadcast

**Fear Track Updates**
- Update fear track value
- Verify all connected clients receive state update
- Verify fear visibility respects `fear_visible_to_players` setting

**Countdown Updates**
- Add, update, or remove countdowns
- Verify all connected clients receive state update
- Verify countdown visibility respects settings

**Notes Updates**
- Update campaign notes
- Verify all connected clients receive state update

### Member Updates Broadcast

**Display Name Changes**
- Update member display name
- Verify all connected clients receive `member_updated` message
- Verify display name updates in members list for all clients

## Testing Notes

### Multi-User Testing Setup

For scenarios marked `[Multi-user]`, you'll need:
- Multiple user accounts (or browser sessions with different accounts)
- All users joined to the same campaign
- All users viewing the campaign page simultaneously

### Durable Object Testing

To test Durable Object scenarios:
- **Connected**: Normal operation with WebSocket connected
- **Disconnected**: Close WebSocket connection (close browser tab, disable network)
- **Unavailable**: Stop the Durable Object worker or simulate network failure

### Version Tracking

The Durable Object uses version numbers to detect stale clients:
- Each update increments the version
- Clients track `lastKnownVersion`
- If `lastKnownVersion < DO.version`, client must refresh from D1

### Data Persistence

Remember: **D1 is the source of truth**. Durable Object is for real-time sync only:
- All updates are saved to D1 first
- DO notifications are for broadcasting to connected clients
- If DO fails, data is still in D1
- Clients always refresh from D1 when needed

### Limits

- **Character Limit**: 3 characters per user
- **Homebrew Limit**: 5 homebrew items per user (across all types)
- **Image Size Limit**: 5MB per image

### Error Scenarios

When testing error scenarios, verify:
- Appropriate error messages are displayed
- Operations fail gracefully
- No data corruption occurs
- User is informed of the issue
- System remains in consistent state
