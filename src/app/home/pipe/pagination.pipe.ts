import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pagination',
  standalone: true
})
export class PaginationPipe implements PipeTransform {

  transform(items: any[], currentPage: number, itemsPerPage: number): any[] {
    if (!items || items.length === 0) {
      return [];
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return items.slice(startIndex, endIndex);
  }

}
