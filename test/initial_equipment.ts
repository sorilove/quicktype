// To parse this data:
//
//   import { Convert } from "./file";
//
//   const initialEquipment = Convert.toInitialEquipment(json);

export interface InitialEquipment {
    equipment: number;
    mail:      boolean;
    num:       number;
    기획자용:      string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toInitialEquipment(json: string): { [key: string]: InitialEquipment } {
        return JSON.parse(json);
    }

    public static initialEquipmentToJson(value: { [key: string]: InitialEquipment }): string {
        return JSON.stringify(value);
    }
}
