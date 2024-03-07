import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProductExtra } from 'src/app/models/product-extra';

@Pipe({
  name: 'extrasSelected',
  standalone: true
})
export class ExtrasSelectedPipe implements PipeTransform {

  constructor(private translate: TranslateService){}

  transform(value: ProductExtra[]): string[] {
    let optionsSelected: string[] = [];
    
    // recorremos los extras del producto
    value.forEach(extra => {
      extra.blocks.forEach(block => {
        // Una sola opcion
        if(block.options.length == 1 && block.options[0].activate){
          optionsSelected.push(this.translate.instant(block.name));
        }else{
          // Varias opciones
          const optionSelected = block.options.find(option => option.activate);
          if(optionSelected){
            optionsSelected.push(this.translate.instant(block.name) + ': ' + this.translate.instant(optionSelected.name));
          }
        }
      })
    })

    return optionsSelected;
  }

}
