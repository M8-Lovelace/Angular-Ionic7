import { Student } from "./student";

export class Class {
    id: number;
    date_start: string;
    date_end: string;
    id_student: number;
    price: number;
    active: number;
    student?: Student; // Estudiante de la clase
    needPay?: boolean; // Indica si falta de pagar
}