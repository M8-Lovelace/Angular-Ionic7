import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShoppingItemsService {

  // items de nuestra lista
  public items: string[];
  // Indica si esta vacia o no
  public isEmpty: boolean;

  constructor() {
    this.items = [];
    this.isEmpty = true;
  }

  addItem(item: string) {
    // añadimos el elemento
    this.items.push(item);
    // Indicamos que no esta vacia
    this.isEmpty = false;
  }

  removeItem(item: string) {
    // Buscamos el indice del item
    let index = this.items.findIndex(it => it.toUpperCase().trim() === item.toUpperCase().trim());
    if (index != -1) {
      // eliminamos el elemento
      this.items.splice(index, 1);
      // Si se queda vacia, volvemos a poner isEmpty a true
      if (this.items.length == 0) {
        this.isEmpty = true;
      }
    }
  }

  removeAllItems(){
    // Vaciamos los items
    this.items = [];
    // Indicamos que esta vacia
    this.isEmpty = true;
  }

  existsItem(item: string){
    // Buscamos el elemento
    const itemFound = this.items.find(it => it.toUpperCase().trim() === item.toUpperCase().trim());
    return itemFound;
  }

}
