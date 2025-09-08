import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    
    searchText = searchText.toLowerCase();
    
    return items.filter(item => {
      // Para produtos
      if (item.nome && item.categoria) {
        return item.nome.toLowerCase().includes(searchText) ||
               item.categoria.toLowerCase().includes(searchText) ||
               (item.descricao && item.descricao.toLowerCase().includes(searchText));
      }
      
      // Para clientes
      if (item.nome && item.email) {
        return item.nome.toLowerCase().includes(searchText) ||
               item.email.toLowerCase().includes(searchText) ||
               (item.cpf && item.cpf.includes(searchText));
      }
      
      // Para outros itens com nome
      if (item.nome) {
        return item.nome.toLowerCase().includes(searchText);
      }
      
      return false;
    });
  }
}
