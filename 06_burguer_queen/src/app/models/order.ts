import { QuantityProduct } from "./quantity-product";
import { User } from "./user";

export class Order {
    _id?: string;
    user: User; // usuario
    products: QuantityProduct[]; // productos con su cantidad
    address?: string; // Direccion
}