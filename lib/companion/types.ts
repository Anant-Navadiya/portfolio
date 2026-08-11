import type { UIMessage } from "ai";

export type MabelSkin =
    | "mabel"
    | "red-panda"
    | "robot"
    | "fox"
    | "axolotl"
    | "owl"
    | "dragon"
    | "astronaut"
    | "forest-spirit"
    | "ghost"
    | "capybara"
    | "raccoon"
    | "slime";

export type MabelMood =
    | "idle"
    | "curious"
    | "listening"
    | "thinking"
    | "happy"
    | "excited"
    | "sleeping"
    | "confused";

export type MabelAction = "idle" | "wave" | "nod" | "point" | "read" | "celebrate";

export type MabelResponse = {
    answer: string;
    mood: Exclude<MabelMood, "listening" | "thinking" | "sleeping">;
    action: MabelAction;
    suggestions: string[];
};

export type MabelTools = {
    respond: {
        input: MabelResponse;
        output: MabelResponse;
    };
};

export type MabelUIMessage = UIMessage<never, Record<string, never>, MabelTools>;
