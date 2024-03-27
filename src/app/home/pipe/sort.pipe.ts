import { Pipe, PipeTransform } from '@angular/core';
import { IOrder } from '../services/IOrder';

@Pipe({
  name: 'sort',
  standalone: true
})
export class SortPipe implements PipeTransform {
  transform(itemList: any[], column: string, sortOrder: string): any[] {
    itemList.sort((a, b) => {
      const aValue = a[column as keyof IOrder];
      const bValue = b[column as keyof IOrder];
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      else {
        return sortOrder === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
      }
    });

    return itemList;
  }

}
