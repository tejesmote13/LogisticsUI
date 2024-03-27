import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true
})
export class SearchPipe implements PipeTransform {

  transform(itemList: any[], searchText: any,columns: any[]): any[] {
    if (searchText == '' && !itemList && !columns) {
      return itemList;
    } else {
       return itemList.filter(item => {
        return columns.some((col) => {
          const searchField = item[col].toLowerCase(); 
          return searchField.includes(searchText); 
        });
      });
    }
  }

}
