export type Action = "submit" | "home" | "score-up" | "score-down";

export type ShortcutSettings = { action: Action; hotkey: string }[];
