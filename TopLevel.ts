// To parse this data:
//
//   import { Convert, TopLevel } from "./file";
//
//   const topLevel = Convert.toTopLevel(json);

export interface TopLevel {
    "1": The1;
}

export interface The1 {
    equipment: number;
    mail:      boolean;
    num:       number;
    기획자용:      string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toTopLevel(json: string): TopLevel {
        return JSON.parse(json);
    }

    public static topLevelToJson(value: TopLevel): string {
        return JSON.stringify(value);
    }
}
