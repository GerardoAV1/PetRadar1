import { PerdidaType } from "../enums/perdida-type.enum";

export interface Perdida{
    lat: number;
    lon: number;
    title: string;
    description: string;
    type: PerdidaType;
}