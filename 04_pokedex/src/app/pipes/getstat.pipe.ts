import { Pipe, PipeTransform } from '@angular/core';
import { Pokemon } from '../models/pokemon';

@Pipe({
  name: 'getStat',
  standalone: true
})
export class GetstatPipe implements PipeTransform {

  transform(value: Pokemon, stat: string): number {
    const statFound = value.stats.find(s => s.stat.name === stat);
    if (statFound) {
      return statFound.base_stat;
    }
    return 0;
  }

}
