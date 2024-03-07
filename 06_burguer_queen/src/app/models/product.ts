import { Category } from "./category";
import { ProductExtra } from "./product-extra";

export class Product {
    _id?: string;
    name: string;
    img?: string;
    price: number;
    category: Category; // categoria
    extras?: ProductExtra[]; // Extras del producto
}