# Testing Instructions

Thank you for helping test the application! This guide will walk you through testing all the features. Please follow these instructions step by step and let me know if you encounter any issues or unexpected behavior.

## Getting Started

Before you begin testing, you'll need:
- Access to the application (URL will be provided)
- At least 2 user accounts (for testing multi-user features)
- Two different browsers or browser sessions (for testing real-time sync)

**Important Notes:**
- Some tests require multiple users. These are marked with `[Multi-user]` - you'll need to open the app in two different browsers with different accounts.
- When testing real-time features, keep both browser windows open side-by-side so you can see updates happening simultaneously.
- If something doesn't work as expected, note the exact steps you took and what happened instead.

## 1. Testing Characters

### Creating Characters

**Test 1: Create a Standalone Character**
1. Go to the Characters page
2. Click the button to create a new character
3. Fill in a character name and any other required fields
4. Save the character
5. **Check:** The character should appear in your characters list
6. **Check:** The character should NOT be assigned to any campaign

**Test 2: Create a Character as a Player in a Campaign**
1. Join or create a campaign (you'll need to be a member)
2. While viewing the campaign, create a new character
3. **Check:** The character should automatically be assigned to that campaign
4. **Check:** The character should be owned by you (not claimable by others)

**Test 3: Create a Claimable Character as GM**
1. As a Game Master (GM), go to your campaign
2. Create a new character and mark it as "claimable" or "unassigned"
3. **Check:** The character should appear in the campaign's unassigned characters list
4. **Check:** Other players should be able to see this character and claim it

**Test 4: Create a Non-claimable Character as GM**
1. As GM, create a character in your campaign without marking it as claimable
2. **Check:** The character should be assigned directly to you
3. **Check:** The character should NOT appear in the unassigned list

**Test 5: Character Limit Enforcement**
1. Create 3 characters (this is the maximum allowed)
2. Try to create a 4th character
3. **Check:** You should see an error message saying you've reached the character limit (3 max)
4. Delete one of your characters
5. **Check:** You should now be able to create a new character

### Modifying Characters

**Test 6: Basic Character Updates**
1. Open one of your characters for editing
2. Change the character's name
3. Change the character's level
4. Upload a new character image
5. Save your changes
6. Refresh the page
7. **Check:** All your changes should still be there after refreshing

**Test 7: Update Character Stats in Campaign**
1. Open a character that's assigned to a campaign
2. Update the character's HP (hit points)
3. Update the character's stress level
4. Update the character's hope
5. Update the character's armor value
6. Add or remove conditions (hidden, restrained, vulnerable)
7. **Check:** If other players are viewing the campaign, they should see these updates appear in real-time

**Test 8: Update Character Inventory**
1. Add weapons, armor, consumables, or loot to your character
2. Change item quantities
3. Modify custom properties of items (like tier or damage thresholds)
4. Save and refresh
5. **Check:** All inventory changes should persist

### Deleting Characters

**Test 9: Delete a Standalone Character**
1. Delete a character that's not in any campaign
2. **Check:** The character should disappear from your characters list
3. **Check:** The character should be completely removed (try accessing its URL directly - it should be gone)

**Test 10: Delete a Character in a Campaign**
1. Delete a character that's assigned to a campaign
2. **Check:** The character should disappear from the campaign view
3. **Check:** The character should disappear from your characters list
4. **Check:** Other campaign members should see the character removed in real-time

**Test 11: Permission Check - Cannot Delete Others' Characters**
1. Try to delete a character owned by another user
2. **Check:** You should see an error message saying you can only delete your own characters
3. **Check:** The character should NOT be deleted

### Character Permissions

**Test 12: View and Edit Your Own Character**
1. Open one of your own characters
2. **Check:** You should be able to view all character details
3. **Check:** You should be able to edit everything
4. Make some changes and save
5. **Check:** Changes should save successfully

**Test 13: GM Editing Player Character**
1. As a GM, view a player's character in your campaign
2. **Check:** You should be able to see all character details
3. Try editing the character's HP, stress, or conditions
4. **Check:** You should be able to edit these stats
5. **Check:** The player should see your changes in real-time

**Test 14: Player Viewing Another Player's Character**
1. As a player, view another player's character in the same campaign
2. **Check:** You should be able to view the character
3. Try to edit the character
4. **Check:** You should NOT be able to edit it (or see an error message)
5. **Check:** Edit buttons/controls should be disabled or hidden

**Test 15: Accessing Character You're Not Allowed to See**
1. Try to access a character URL for a character you don't own and aren't in a campaign with
2. **Check:** You should see an error message or the character should not be found
3. **Check:** You should NOT be able to view the character

### Character Image Uploads

**Test 16: Upload a Valid Character Image**
1. Open a character for editing
2. Upload an image file (JPG, PNG, or WebP format)
3. **Check:** The image should appear in the character sheet
4. **Check:** The image should still be there after refreshing the page

**Test 17: Image Size Limit**
1. Try to upload an image file larger than 5MB
2. **Check:** You should see an error message about the file size limit (5MB max)
3. **Check:** The upload should be rejected

**Test 18: Invalid File Type**
1. Try to upload a non-image file (like a PDF or text file)
2. **Check:** You should see an error message saying the file must be an image
3. **Check:** The upload should be rejected

## 2. Testing Campaigns

### Creating Campaigns

**Test 19: Create a Basic Campaign**
1. Go to the Campaigns page
2. Click to create a new campaign
3. Enter a campaign name
4. Save
5. **Check:** The campaign should appear in your campaigns list
6. **Check:** You should be listed as the GM (Game Master)
7. **Check:** The campaign should have an initial fear track value of 0
8. **Check:** An invite code should be automatically generated

**Test 20: Create Campaign with Description**
1. Create a new campaign
2. Enter both a name and a description
3. Save
4. **Check:** Both the name and description should be saved and displayed

**Test 21: Create Campaign with GM Display Name**
1. Create a campaign and enter a custom display name for yourself as GM
2. **Check:** Your display name should appear in the campaign members list
3. **Check:** Your display name should appear in the invite link preview

### Modifying Campaigns

**Test 22: Update Campaign Name (GM Only)**
1. As a GM, go to your campaign settings
2. Change the campaign name
3. **Check:** The name change should appear immediately
4. **Check:** All campaign members should see the new name

**Test 23: Update Campaign Description (GM Only)**
1. As GM, update the campaign description
2. **Check:** The description should save and persist

**Test 24: Player Cannot Modify Campaign**
1. As a player (not GM), try to update the campaign name or description
2. **Check:** You should see an error message saying only the GM can do this
3. **Check:** The changes should NOT be saved

### Deleting Campaigns

**Test 25: GM Deletes Campaign**
1. As GM, delete one of your campaigns
2. **Check:** The campaign should disappear from your campaigns list
3. **Check:** All campaign members should be removed
4. **Check:** All characters should be unassigned from the campaign (they should still exist, just not in the campaign)
5. **Check:** Campaign members should no longer see the campaign in their list

**Test 26: Player Cannot Delete Campaign**
1. As a player, try to delete a campaign
2. **Check:** You should see an error message saying only the GM can delete campaigns
3. **Check:** The campaign should NOT be deleted

### Campaign Permissions

**Test 27: GM Access**
1. As a GM, view your campaign
2. **Check:** You should be able to see all campaign features
3. **Check:** You should be able to edit campaign state (fear, countdowns, notes)
4. **Check:** You should be able to manage members
5. **Check:** You should be able to add/remove characters
6. **Check:** You should be able to manage the homebrew vault

**Test 28: Player Access**
1. As a player, view a campaign you're a member of
2. **Check:** You should be able to view the campaign
3. **Check:** You should be able to see campaign state IF the GM has made it visible to players
4. **Check:** You should NOT be able to edit campaign state
5. **Check:** You should NOT be able to manage members
6. **Check:** You should be able to add your own characters
7. **Check:** You should be able to claim unassigned characters

**Test 29: Non-Member Access**
1. Try to access a campaign URL for a campaign you're not a member of
2. **Check:** You should see an error message or the campaign should not be accessible

## 3. Testing Homebrew Content

### Creating Homebrew Items

**Test 30: Create Different Types of Homebrew**
Try creating at least one of each of these homebrew types:
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
- Domain Card (try different domains: arcana, blade, bone, codex, grace, midnight, sage, splendor, valor)

For each type:
1. Create a new homebrew item
2. Fill in the required fields
3. **Check:** The item should appear in your homebrew list
4. **Check:** The item should be marked as "Homebrew" (not from the base game)
5. **Check:** The item should be usable when creating or editing characters

**Test 31: Create Homebrew with Image**
1. Create a homebrew item
2. Upload an image for it
3. **Check:** The image should be stored and displayed correctly
4. **Check:** The image should appear when viewing the homebrew item

### Modifying Homebrew Items

**Test 32: Update Homebrew Properties**
1. Edit one of your homebrew items
2. Change the name, description, or other properties
3. Save
4. **Check:** Changes should persist
5. **Check:** If any characters are using this homebrew item, the changes should be reflected there too

**Test 33: Update Homebrew Image**
1. Edit a homebrew item that has an image
2. Replace the image with a new one
3. **Check:** The new image should be displayed

### Deleting Homebrew Items

**Test 34: Delete Your Own Homebrew**
1. Delete a homebrew item you created
2. **Check:** The item should be removed from your homebrew list
3. **Check:** If the item was in a campaign vault, it should be removed from there too
4. **Check:** Characters using the item should still function (though the item might show as missing)

**Test 35: Cannot Delete Others' Homebrew**
1. Try to delete a homebrew item created by another user
2. **Check:** You should see an error message about permission denied
3. **Check:** The item should NOT be deleted

### Homebrew Limits

**Test 36: Reach Homebrew Limit**
1. Create 5 homebrew items (this is the maximum)
2. Try to create a 6th homebrew item
3. **Check:** You should see an error message about the homebrew limit (5 max)
4. Delete one homebrew item
5. **Check:** You should now be able to create a new homebrew item

**Test 37: Limit Applies Across All Types**
1. Create 3 homebrew classes and 2 homebrew weapons (total 5 items)
2. Try to create any 6th homebrew item (of any type)
3. **Check:** The limit should be enforced - you should see an error

### Campaign Homebrew Vault

**Test 38: Add Item to Vault (GM Only)**
1. As GM, go to your campaign's homebrew vault
2. Add one of your homebrew items to the vault
3. **Check:** The item should appear in the vault list
4. **Check:** The item should become available to all campaign members
5. **Check:** Campaign members should see the item in their compendium

**Test 39: Remove Item from Vault (GM Only)**
1. As GM, remove an item from the campaign vault
2. **Check:** The item should be removed from the vault
3. **Check:** Campaign members should no longer see the item in their compendium

**Test 40: Player Cannot Manage Vault**
1. As a player, try to add an item to the campaign vault
2. **Check:** You should see an error message saying only the GM can do this
3. Try to remove an item from the vault
4. **Check:** You should see an error message

**Test 41: Can Only Add Your Own Homebrew**
1. As GM, try to add another user's homebrew item to your campaign vault
2. **Check:** You should see an error message saying you can only add your own items
3. **Check:** The item should NOT be added to the vault

## 4. Testing Campaign Membership

### Joining Campaigns

**Test 42: Join via Invite Link**
1. Get an invite link from a GM (or use one you generated)
2. Open the invite link in your browser (or share it with another account)
3. Click to join the campaign
4. **Check:** You should be added as a player member
5. **Check:** The campaign should appear in your campaigns list
6. **Check:** You should be able to access the campaign page

**Test 43: Join with Display Name**
1. When joining a campaign, enter a display name
2. **Check:** Your display name should appear in the campaign members list
3. **Check:** Your display name should be used instead of your username

**Test 44: Join without Display Name**
1. Join a campaign without providing a display name
2. **Check:** Your username should be used as your display name

**Test 45: Join with Character**
1. When joining a campaign, bring an existing character with you
2. **Check:** The character should automatically be assigned to the campaign
3. **Check:** The character should be owned by you (not claimable)

**Test 46: Join When Already a Member**
1. Try to join a campaign you're already a member of (use the invite link again)
2. **Check:** You should see a message saying you're already a member
3. **Check:** No duplicate membership should be created

**Test 47: Join with Invalid Invite Code**
1. Try to join using a fake or invalid invite code
2. **Check:** You should see an error message saying the campaign was not found

**Test 48: Join When at Character Limit**
1. Make sure you have 3 characters (the maximum)
2. Try to join a campaign and bring a character with you
3. **Check:** You should see an error message about the character limit
4. **Check:** You should still be able to join the campaign without bringing a character

### Leaving Campaigns

**Test 49: Player Leaves Campaign**
1. As a player, leave a campaign
2. **Check:** You should be removed from the campaign members list
3. **Check:** Your characters should be unassigned from the campaign (they should still exist, just not in the campaign)
4. **Check:** The campaign should no longer appear in your campaigns list
5. **Check:** Other campaign members should see you removed in real-time

**Test 50: GM Cannot Leave**
1. As a GM, try to leave your campaign
2. **Check:** You should see an error message saying the GM cannot leave
3. **Check:** You should be told you must delete the campaign instead

**Test 51: Leave with Multiple Characters**
1. As a player with multiple characters in a campaign, leave the campaign
2. **Check:** All your characters should be removed from the campaign
3. **Check:** All characters should be unassigned

### Re-joining Campaigns

**Test 52: Re-join After Leaving**
1. Leave a campaign
2. Use the same invite link to re-join
3. **Check:** You should be added as a new member
4. **Check:** You should be able to access the campaign again

**Test 53: Re-join with New Character**
1. Leave a campaign (your characters will be unassigned)
2. Re-join the campaign and bring a character
3. **Check:** The character should be assigned to the campaign

## 5. Testing Invite Links

### Viewing and Copying Invite Links

**Test 54: GM Can View Invite Link**
1. As GM, go to your campaign
2. **Check:** You should see the invite link displayed
3. **Check:** The link should be in the format: `/campaigns/join/{invite_code}`
4. **Check:** The invite code should be visible

**Test 55: Player Cannot View Invite Link**
1. As a player, view a campaign
2. **Check:** You should NOT see the invite link section (or it should be hidden)

**Test 56: Copy Invite Link**
1. As GM, copy the invite link
2. **Check:** The link should be copied to your clipboard
3. Paste it in another browser or share it with another account
4. **Check:** The link should work to join the campaign

### Resetting Invite Links

**Test 57: GM Resets Invite Code**
1. As GM, reset the invite code
2. **Check:** A new invite code should be generated
3. **Check:** The old invite link should no longer work (should show an error)
4. **Check:** The new invite link should work

**Test 58: Player Cannot Reset Invite Code**
1. As a player, try to reset the invite code
2. **Check:** You should see an error message saying only the GM can do this

**Test 59: Use Reset Invite Link**
1. As GM, reset the invite code
2. Use the new invite link to join as a different user (or in a different browser)
3. **Check:** The join should succeed with the new code

## 6. Testing Character Assignment & Claiming

### GM Assigns Characters

**Test 60: Assign Character as Claimable**
1. As GM, assign a character to your campaign and mark it as "claimable" or "unassigned"
2. **Check:** The character should appear in the unassigned characters list
3. **Check:** The character should be marked as claimable
4. **Check:** Players should be able to see and claim this character

**Test 61: Assign Character as Non-claimable**
1. As GM, assign a character to your campaign without marking it as claimable
2. **Check:** The character should appear in the assigned characters list
3. **Check:** The character should be owned by you
4. **Check:** The character should NOT be claimable

**Test 62: Assign Existing Character**
1. As GM, assign a character you already own to the campaign
2. **Check:** The character should be added to the campaign
3. **Check:** The character should appear in the campaign characters list

### Players Claim Characters

**Test 63: Player Claims Unassigned Character**
1. As a player, view a campaign with an unassigned character
2. Click to claim the character
3. **Check:** The character ownership should transfer to you
4. **Check:** The character should no longer be claimable
5. **Check:** The character should appear in your characters list
6. **Check:** Other campaign members should see the ownership change in real-time

**Test 64: Claim When at Character Limit**
1. Make sure you have 3 characters (the maximum)
2. Try to claim an unassigned character
3. **Check:** You should see an error message about the character limit
4. **Check:** The character should remain claimable (not claimed by you)

**Test 65: Claim When Already Has Character**
1. As a player who already has a character in the campaign, try to claim another unassigned character
2. **Check:** You should see an error message saying you already have a character in this campaign
3. **Check:** The claim should fail

**Test 66: GM Cannot Claim**
1. As GM, try to claim an unassigned character
2. **Check:** You should see an error message saying GMs cannot claim characters

### Unassigning Characters

**Test 67: GM Unassigns Character**
1. As GM, unassign a character (make it claimable again)
2. **Check:** The character should become claimable
3. **Check:** The character should appear in the unassigned list
4. **Check:** Players should be able to claim it again

**Test 68: Player Cannot Unassign**
1. As a player, try to unassign a character
2. **Check:** You should see an error message saying only the GM can do this

### Removing Characters from Campaign

**Test 69: GM Removes Character**
1. As GM, remove a character from the campaign
2. **Check:** The character should be removed from the campaign view
3. **Check:** Other campaign members should see the character removed in real-time

**Test 70: Character Owner Removes Their Character**
1. As the owner of a character in a campaign, remove your character from the campaign
2. **Check:** The character should be unassigned from the campaign
3. **Check:** The character should still exist in your characters list

### Race Condition Testing (Advanced)

**Test 71: Multiple Players Try to Claim Same Character** `[Multi-user]`
1. Have two different players (in different browsers) view the same campaign
2. Both players should try to claim the same unassigned character at the exact same time
3. **Check:** Only one player should succeed in claiming the character
4. **Check:** The other player should get an error message saying the character was already claimed
5. **Check:** The character should be owned by exactly one player (no duplicates)

## 7. Testing Campaign State Updates

### Fear Track

**Test 72: GM Updates Fear Track**
1. As GM, update the fear track value
2. **Check:** The fear value should be saved
3. **Check:** You should see the updated value
4. **Check:** Whether players can see it depends on the "fear visible to players" setting

**Test 73: Toggle Fear Visibility**
1. As GM, toggle the "fear visible to players" setting on and off
2. As a player, check if you can see the fear track
3. **Check:** You should only see it when the setting is ON
4. **Check:** The setting should persist

**Test 74: Player Cannot Update Fear**
1. As a player, try to update the fear track
2. **Check:** You should see an error message saying only the GM can do this

### Countdowns

**Test 75: Add Countdown (GM Only)**
1. As GM, add a new countdown
2. Fill in the required fields (name, minimum value, current value, visibility)
3. **Check:** The countdown should appear in the campaign state
4. **Check:** The countdown should appear in the live campaign view

**Test 76: Update Countdown (GM Only)**
1. As GM, update a countdown's current value
2. **Check:** The countdown should update
3. Try to set the current value below the minimum value
4. **Check:** You should not be able to do this (or see a validation error)

**Test 77: Remove Countdown (GM Only)**
1. As GM, remove a countdown
2. **Check:** The countdown should be removed from the campaign state
3. **Check:** The countdown should disappear from the live view

**Test 78: Player Cannot Manage Countdowns**
1. As a player, try to add, update, or remove countdowns
2. **Check:** You should see an error message saying only the GM can do this

**Test 79: Countdown Visibility**
1. As GM, set a countdown's visibility to players on or off
2. As a player, check if you can see the countdown
3. **Check:** You should only see it when visibility is set to ON

### Campaign Notes

**Test 80: GM Updates Notes**
1. As GM, update the campaign notes
2. **Check:** The notes should be saved
3. **Check:** You should be able to see the notes
4. **Check:** Players should also be able to see the notes (if applicable)

**Test 81: Player Cannot Update Notes**
1. As a player, try to update the campaign notes
2. **Check:** You should see an error message saying only the GM can do this

### Updates with Real-time Sync

**Test 82: Updates Broadcast in Real-time** `[Multi-user]`
1. Have multiple users viewing the same campaign (GM and at least one player)
2. As GM, update the fear track, add a countdown, or update notes
3. **Check:** All connected users should see these updates appear immediately (within seconds)
4. **Check:** No one should need to refresh the page to see the changes

**Test 83: Updates Persist After Disconnect**
1. Make some campaign state updates (fear, countdowns, notes)
2. Close the browser tab or disconnect your internet
3. Reconnect and reload the page
4. **Check:** All your updates should still be there

## 8. Testing Character Sheet Updates

### Updating Character Stats

**Test 84: Update HP**
1. Open a character that's in a campaign
2. Update the character's marked HP (hit points) value
3. **Check:** The value should be saved
4. **Check:** If other players are viewing the campaign, they should see this update in real-time

**Test 85: Update Stress**
1. Update a character's marked stress value
2. **Check:** The value should be saved and synced

**Test 86: Update Hope**
1. Update a character's marked hope value
2. **Check:** The value should be saved and synced

**Test 87: Update Armor**
1. Update a character's marked armor value
2. **Check:** The value should be saved and synced

**Test 88: Add/Remove Conditions**
1. Add conditions to a character: hidden, restrained, or vulnerable
2. **Check:** The conditions should appear in the character's condition list
3. Remove some conditions
4. **Check:** The conditions should be removed
5. **Check:** Conditions should appear in the campaign view for other members

### Real-time Updates

**Test 89: Updates Broadcast to All Users** `[Multi-user]`
1. Have multiple users viewing the same campaign
2. Update a character's HP, stress, hope, armor, or conditions from one browser
3. **Check:** All other users viewing the campaign should see these updates appear immediately
4. **Check:** No one should need to refresh to see the changes

**Test 90: Updates Persist After Disconnect**
1. Update character stats
2. Close the browser or disconnect internet
3. Reconnect and reload
4. **Check:** All updates should still be there

### Permission-Based Updates

**Test 91: GM Editing Player Character**
1. As GM, edit a player's character stats (HP, stress, conditions)
2. **Check:** The updates should be saved
3. **Check:** The player should see your changes in real-time
4. **Check:** The updates should appear in the campaign view

**Test 92: Player Editing Own Character**
1. As a player, edit your own character's stats
2. **Check:** The updates should be saved
3. **Check:** The GM and other players should see your updates in real-time

**Test 93: Player Cannot Edit Other Player's Character**
1. As a player, try to edit another player's character
2. **Check:** You should see an error message about permission denied
3. **Check:** The edit should fail

## 9. Testing Real-time Sync Features

### Multi-User Real-time Updates

**Test 94: All Users See Updates Simultaneously** `[Multi-user]`
1. Have multiple users (GM and players) viewing the same campaign in different browsers
2. From one browser, make an update (character stat, campaign state, etc.)
3. **Check:** All other users should see the update appear in their browser within seconds
4. **Check:** Updates should appear simultaneously for everyone
5. **Check:** No one should miss any updates

**Test 95: Character Updates Broadcast**
1. With multiple users viewing a campaign, update a character from one browser
2. **Check:** All other users should see the character update immediately
3. **Check:** Only the changed fields should be updated (for efficiency)

**Test 96: Campaign State Updates Broadcast**
1. With multiple users viewing a campaign, update the campaign state (fear, countdowns, notes) from one browser
2. **Check:** All other users should see the state update immediately

**Test 97: Character Added/Removed Broadcast**
1. With multiple users viewing a campaign, add a character to the campaign
2. **Check:** All users should see the character appear immediately
3. Remove a character from the campaign
4. **Check:** All users should see the character disappear immediately

**Test 98: Member Updates Broadcast**
1. Update a member's display name
2. **Check:** All users viewing the campaign should see the display name update immediately in the members list

### Connection and Reconnection

**Test 99: Automatic Reconnection**
1. View a campaign page
2. Close the browser tab or disconnect your internet
3. Reopen the page or reconnect
4. **Check:** The connection should automatically reconnect
5. **Check:** Your state should sync correctly after reconnecting

**Test 100: Updates Work When Disconnected**
1. Disconnect your internet or close the WebSocket connection
2. Make some updates (character stats, campaign state)
3. **Check:** Updates should still be saved (they'll sync when you reconnect)
4. Reconnect
5. **Check:** Your updates should sync and be visible to others

## 10. Testing Image Uploads

### Character Images

**Test 101: Upload Valid Character Image**
1. Open a character for editing
2. Upload an image file (JPG, PNG, or WebP)
3. **Check:** The image should appear in the character sheet
4. **Check:** The image should still be there after refreshing the page

**Test 102: Image Size Validation**
1. Try to upload an image file larger than 5MB
2. **Check:** You should see an error message about the file size limit (5MB max)
3. **Check:** The upload should be rejected

**Test 103: Invalid File Type**
1. Try to upload a non-image file (like a PDF or text file)
2. **Check:** You should see an error message saying the file must be an image
3. **Check:** The upload should be rejected

### Homebrew Images

**Test 104: Upload Homebrew Image**
1. Create or edit a homebrew item
2. Upload an image for it
3. **Check:** The image should be stored and displayed correctly
4. **Check:** The image should appear when viewing the homebrew item

**Test 105: Homebrew Image in Campaign Vault**
1. Add a homebrew item with an image to a campaign vault
2. **Check:** Campaign members should be able to see the image
3. **Check:** The image should load correctly for all members

## 11. Testing Error Scenarios and Edge Cases

### Permission Errors

**Test 106: Cannot View Character Without Permission**
1. Try to access a character URL for a character you don't own and aren't in a campaign with
2. **Check:** You should see an error message or the character should not be found
3. **Check:** You should NOT be able to view the character

**Test 107: Cannot Edit Character Without Permission**
1. As a player, try to edit another player's character in the same campaign
2. **Check:** You should see an error message about permission denied
3. **Check:** The edit should fail

**Test 108: Cannot View Campaign Without Membership**
1. Try to access a campaign URL for a campaign you're not a member of
2. **Check:** You should see an error message or the campaign should not be accessible

**Test 109: Cannot Edit Campaign as Player**
1. As a player, try to update the campaign name, description, or state
2. **Check:** You should see error messages saying only the GM can do this

**Test 110: Cannot Add to Vault as Player**
1. As a player, try to add a homebrew item to the campaign vault
2. **Check:** You should see an error message about GM-only permissions

**Test 111: Cannot Edit Campaign Homebrew**
1. As a campaign member (not the owner), try to edit a homebrew item in the vault
2. **Check:** You should see an error message saying only the owner can edit

**Test 112: Cannot Claim Character as GM**
1. As GM, try to claim an unassigned character
2. **Check:** You should see an error message saying GMs cannot claim characters

**Test 113: Cannot Delete Others' Characters**
1. Try to delete a character owned by another user
2. **Check:** You should see an error message saying you can only delete your own characters

### General Error Handling

**Test 114: Error Messages Are Clear**
When you encounter errors during testing:
- **Check:** Error messages should be clear and explain what went wrong
- **Check:** Error messages should tell you what you can do (if anything)

**Test 115: System Remains Stable After Errors**
1. Trigger various error scenarios (try invalid operations)
2. **Check:** The application should continue to work normally after showing errors
3. **Check:** No data should be corrupted
4. **Check:** You should be able to continue using the app

## Testing Checklist Summary

Use this checklist to make sure you've tested everything:

### Characters
- [ ] Create standalone character
- [ ] Create character as player in campaign
- [ ] Create claimable character as GM
- [ ] Create non-claimable character as GM
- [ ] Character limit enforcement (3 max)
- [ ] Modify character (name, level, image, stats, inventory)
- [ ] Delete character (standalone and in campaign)
- [ ] Character permissions (owner, GM, player, non-member)
- [ ] Character image uploads (valid, size limit, invalid type)

### Campaigns
- [ ] Create campaign (basic, with description, with display name)
- [ ] Modify campaign (GM only)
- [ ] Delete campaign (GM only)
- [ ] Campaign permissions (GM vs Player vs Non-member)

### Homebrew
- [ ] Create different types of homebrew items
- [ ] Modify homebrew items
- [ ] Delete homebrew items
- [ ] Homebrew limits (5 max across all types)
- [ ] Homebrew permissions
- [ ] Campaign homebrew vault (add/remove, GM only)

### Campaign Membership
- [ ] Join campaign (various scenarios)
- [ ] Leave campaign
- [ ] Re-join campaign
- [ ] GM cannot leave

### Invite Links
- [ ] View invite link (GM only)
- [ ] Copy invite link
- [ ] Reset invite link (GM only)
- [ ] Use reset invite link

### Character Assignment & Claiming
- [ ] GM assigns character (claimable vs non-claimable)
- [ ] Player claims unassigned character
- [ ] Claim restrictions (limit, already has character, GM cannot claim)
- [ ] Unassign character
- [ ] Remove character from campaign
- [ ] Race condition (multiple players claim same character)

### Campaign State
- [ ] Update fear track (GM only)
- [ ] Toggle fear visibility
- [ ] Add/update/remove countdowns (GM only)
- [ ] Update campaign notes (GM only)
- [ ] Real-time sync of state updates

### Character Sheet Updates
- [ ] Update HP, stress, hope, armor
- [ ] Add/remove conditions
- [ ] Real-time sync of character updates
- [ ] GM editing player character
- [ ] Player editing own character
- [ ] Player cannot edit other player's character

### Real-time Sync
- [ ] Multiple users see updates simultaneously
- [ ] Character updates broadcast
- [ ] Campaign state updates broadcast
- [ ] Character added/removed broadcast
- [ ] Member updates broadcast
- [ ] Automatic reconnection
- [ ] Updates work when disconnected

### Image Uploads
- [ ] Character image uploads
- [ ] Homebrew image uploads
- [ ] Image size validation
- [ ] Invalid file type validation

### Error Scenarios
- [ ] Permission errors (various scenarios)
- [ ] Error messages are clear
- [ ] System remains stable after errors

## What to Report

When you find issues, please report:
1. **What you were trying to do** - The test number and description
2. **What you expected to happen** - Based on the test instructions
3. **What actually happened** - Describe the actual behavior
4. **Steps to reproduce** - Exact steps you took
5. **Screenshots** - If applicable, include screenshots of errors or unexpected behavior
6. **Browser/Device** - What browser and device you were using

## Important Notes

- **Character Limit**: You can have a maximum of 3 characters
- **Homebrew Limit**: You can have a maximum of 5 homebrew items (across all types combined)
- **Image Size Limit**: Images must be 5MB or smaller
- **Multi-user Tests**: Some tests require multiple user accounts. Use different browsers or browser sessions with different accounts.
- **Real-time Features**: For real-time sync tests, keep multiple browser windows open side-by-side to see updates happening simultaneously.

Thank you for your help testing! Your feedback is invaluable for improving the application.
