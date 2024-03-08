import { Class } from "./class";

export class Payment {
    id:number;
    date: string;
    id_class: number;
    paid: number;
    class?: Class; // Clase
}