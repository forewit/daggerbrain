/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as constants_constants from "../constants/constants.js";
import type * as constants_entitlements from "../constants/entitlements.js";
import type * as constants_rules from "../constants/rules.js";
import type * as functions_campaigns from "../functions/campaigns.js";
import type * as functions_characters from "../functions/characters.js";
import type * as functions_encounters from "../functions/encounters.js";
import type * as functions_entitlements from "../functions/entitlements.js";
import type * as functions_homebrew from "../functions/homebrew.js";
import type * as functions_sources from "../functions/sources.js";
import type * as functions_streamOverlays from "../functions/streamOverlays.js";
import type * as functions_users from "../functions/users.js";
import type * as http from "../http.js";
import type * as internal_entitlements from "../internal/entitlements.js";
import type * as internal_helpers from "../internal/helpers.js";
import type * as lib_characterCompendium from "../lib/characterCompendium.js";
import type * as permissions from "../permissions.js";
import type * as schemas_campaigns from "../schemas/campaigns.js";
import type * as schemas_characters from "../schemas/characters.js";
import type * as schemas_compendium from "../schemas/compendium.js";
import type * as schemas_dice from "../schemas/dice.js";
import type * as schemas_encounters from "../schemas/encounters.js";
import type * as schemas_rules from "../schemas/rules.js";
import type * as schemas_sources from "../schemas/sources.js";
import type * as schemas_themes from "../schemas/themes.js";
import type * as schemas_users from "../schemas/users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "constants/constants": typeof constants_constants;
  "constants/entitlements": typeof constants_entitlements;
  "constants/rules": typeof constants_rules;
  "functions/campaigns": typeof functions_campaigns;
  "functions/characters": typeof functions_characters;
  "functions/encounters": typeof functions_encounters;
  "functions/entitlements": typeof functions_entitlements;
  "functions/homebrew": typeof functions_homebrew;
  "functions/sources": typeof functions_sources;
  "functions/streamOverlays": typeof functions_streamOverlays;
  "functions/users": typeof functions_users;
  http: typeof http;
  "internal/entitlements": typeof internal_entitlements;
  "internal/helpers": typeof internal_helpers;
  "lib/characterCompendium": typeof lib_characterCompendium;
  permissions: typeof permissions;
  "schemas/campaigns": typeof schemas_campaigns;
  "schemas/characters": typeof schemas_characters;
  "schemas/compendium": typeof schemas_compendium;
  "schemas/dice": typeof schemas_dice;
  "schemas/encounters": typeof schemas_encounters;
  "schemas/rules": typeof schemas_rules;
  "schemas/sources": typeof schemas_sources;
  "schemas/themes": typeof schemas_themes;
  "schemas/users": typeof schemas_users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
