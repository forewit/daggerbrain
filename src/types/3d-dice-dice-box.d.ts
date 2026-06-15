declare module '@3d-dice/dice-box' {
	export type DiceSides = number | string;
	export type DiceId = number | string;

	export interface DiceNotation {
		qty: number;
		sides: DiceSides;
		modifier?: number;
		data?: string;
		theme?: string;
		themeColor?: string;
		groupId?: DiceId;
		rollId?: DiceId;
		value?: number;
	}

	export type DiceNotationInput = string | DiceNotation | Array<string | DiceNotation>;

	export interface DiceBoxConfig {
		id?: string;
		assetPath?: string;
		container?: string | null;
		gravity?: number;
		mass?: number;
		friction?: number;
		restitution?: number;
		angularDamping?: number;
		linearDamping?: number;
		spinForce?: number;
		throwForce?: number;
		startingHeight?: number;
		settleTimeout?: number;
		offscreen?: boolean;
		delay?: number;
		lightIntensity?: number;
		enableShadows?: boolean;
		shadowTransparency?: number;
		theme?: string;
		preloadThemes?: string[];
		externalThemes?: Record<string, string>;
		themeColor?: string;
		scale?: number;
		suspendSimulation?: boolean;
		origin?: string;
		onBeforeRoll?: (notation: DiceNotation[]) => void;
		onDieComplete?: (die: DieResult) => void;
		onRollComplete?: (results: RollGroup[]) => void;
		onRemoveComplete?: (die: DieResult) => void;
		onThemeConfigLoaded?: (config: any) => void;
		onThemeLoaded?: (config: any) => void;
	}

	export interface DieResult {
		sides: DiceSides;
		groupId: DiceId;
		rollId: DiceId;
		value: number;
		data?: string;
		dieType?: string;
		theme?: string;
		themeColor?: string;
	}

	export interface RollGroup {
		id: DiceId;
		qty: number;
		sides: DiceSides;
		modifier?: number;
		value: number;
		data?: string;
		theme?: string;
		themeColor?: string;
		rolls: DieResult[];
	}

	export interface RollOptions {
		theme?: string;
		themeColor?: string;
		newStartPoint?: boolean;
	}

	export interface RerollOptions {
		remove?: boolean;
		hide?: boolean;
		newStartPoint?: boolean;
	}

	export interface RemoveOptions {
		hide?: boolean;
	}

	export interface DieReference {
		rollId: DiceId;
		groupId?: DiceId;
		sides?: DiceSides;
		value?: number;
		data?: string;
		dieType?: string;
		theme?: string;
		themeColor?: string;
	}

	export default class DiceBox {
		constructor(config?: DiceBoxConfig);
		constructor(container: string, config: DiceBoxConfig);
		init(): Promise<this>;
		getThemeConfig(theme: string): Promise<any>;
		loadTheme(theme: string): Promise<any>;
		roll(notation: DiceNotationInput, options?: RollOptions): Promise<DieResult[]>;
		add(notation: DiceNotationInput, options?: RollOptions): Promise<DieResult[]>;
		reroll(notation: DieReference | DieReference[], options?: RerollOptions): Promise<DieResult[]>;
		remove(notation: DieReference | DieReference[], options?: RemoveOptions): Promise<DieResult[]>;
		clear(): this;
		hide(className?: string): this;
		show(): this;
		getRollResults(): RollGroup[];
		updateConfig(config: Partial<DiceBoxConfig>): Promise<this>;
		createNotationArray(notation: DiceNotationInput, diceAvailable: string[]): DiceNotation[];
		parse(notation: string, diceAvailable: string[]): DiceNotation;
	}
}
