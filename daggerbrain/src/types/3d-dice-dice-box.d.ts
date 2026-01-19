declare module '@3d-dice/dice-box' {
	export interface DiceBoxConfig {
		/** The ID of the canvas element. Default: 'dice-canvas' */
		id?: string;
		/** The path to static assets needed by this module. Required. Default: '/assets/' */
		assetPath?: string;
		/** A query selector for the DOM element to place the dice box canvas in. Default: document.body */
		container?: string | HTMLElement;
		/** Too much gravity will cause the dice to jitter. Too little and they take much longer to settle. Default: 1 */
		gravity?: number;
		/** The mass of the dice. Affects how forces act on the dice such as spin. Default: 1 */
		mass?: number;
		/** The friction of the dice and the surface they roll on. Default: 0.8 */
		friction?: number;
		/** The bounciness of the dice. Default: 0 */
		restitution?: number;
		/** Determines how quickly the dice lose their spin (angular momentum). Default: 0.4 */
		angularDamping?: number;
		/** Determines how quickly the dice lose their linear momentum. Default: 0.4 */
		linearDamping?: number;
		/** The maximum amount of spin the dice may have. Default: 4 */
		spinForce?: number;
		/** The maximum amount of throwing force used. Default: 5 */
		throwForce?: number;
		/** The height at which the toss begins. Default: 8 */
		startingHeight?: number;
		/** Time in ms before a die is stopped from moving. Default: 5000 */
		settleTimeout?: number;
		/** If offscreenCanvas is available it will be used. Default: true */
		offscreen?: boolean;
		/** The delay between dice being generated. If they're all generated at the same time they instantly collide with each other which doesn't look very natural. Default: 10 */
		delay?: number;
		/** Global illumination levels. Default: 1 */
		lightIntensity?: number;
		/** Do the dice cast a shadow? Turn off for a performance bump. Default: true */
		enableShadows?: boolean;
		/** Set the transparency of the shadows cast by the dice. Default: 0.8 */
		shadowTransparency?: number;
		/** For additional themes see @3d-dice/dice-themes. Default: 'default' */
		theme?: string;
		/** An array of themes to pre-load. Useful for themes that extend other themes. Default: [] */
		preloadThemes?: string[];
		/** An object with theme system names as the key value and an external url path to theme assets. Useful for accessing themes on a CDN. Default: {} */
		externalThemes?: Record<string, string>;
		/** Some themes allow for a configurable base color as a HEX value. Default: '#2e8555' */
		themeColor?: string;
		/** Options are best between 2-9. The higher the number the larger the dice. Accepts decimal numbers. Default: 6 */
		scale?: number;
		/** Turn off the 3D simulation and use the built-in random number generator instead. Default: false */
		suspendSimulation?: boolean;
		/** Sets the site origin used for constructing paths to assets. Default: location.origin */
		origin?: string;
		/** Callback function triggered after notation has been parsed, but before the roll starts */
		onBeforeRoll?: (notation: string | object) => void;
		/** Callback function triggered whenever an individual die has completed rolling */
		onDieComplete?: (die: DieResult) => void;
		/** Callback function triggered whenever all the dice have completed rolling */
		onRollComplete?: (results: RollGroup[]) => void;
		/** Callback function triggered whenever a die has been removed from the scene */
		onRemoveComplete?: (die: DieResult) => void;
		/** Callback function triggered after a theme config file has been successfully fetched and parsed */
		onThemeConfigLoaded?: (config: any) => void;
		/** Callback function triggered after a theme has finished loading all related assets */
		onThemeLoaded?: (config: any) => void;
	}

	export interface DieResult {
		sides: number;
		groupId: number;
		rollId: number;
		value: number;
		theme?: string;
	}

	export interface RollGroup {
		qty: number;
		sides: number;
		modifier?: number;
		rolls: DieResult[];
		value: number;
		theme?: string;
	}

	export interface RollOptions {
		theme?: string;
		callback?: (results: RollGroup[]) => void;
	}

	export default class DiceBox {
		constructor(target: string | HTMLElement, config?: DiceBoxConfig);
		init(): Promise<void>;
		roll(notation: string | object, options?: RollOptions): Promise<RollGroup[]>;
		add(notation: string | object): Promise<DieResult[]>;
		reroll(def: { groupId: number; rollId: number }): Promise<DieResult[]>;
		remove(def: { groupId: number; rollId: number }): Promise<DieResult[]>;
		clear(): void;
		hide(): void;
		show(): void;
		getRollResults(): RollGroup[];
		updateConfig(config: Partial<DiceBoxConfig>): void;
		destroy(): void;
	}
}
