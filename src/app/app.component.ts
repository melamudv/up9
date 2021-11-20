import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {IEditor} from '../models/editor.model';

export let SheetHeader = Array(300).fill('').map(x => Array(11).fill(''));

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'up9';
  displayedColumns: string[] = [' ', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  tokens = ['+', '-', '/', '*'];
  numbers = [];
  editor: IEditor = {
    actions: [],
    editPointer: {
      col: -1,
      row: -1
    },
  };
  dataSource = new MatTableDataSource(SheetHeader);

  ngOnInit(): void {
  }
  changeValue(row, col, value): void{
    if (value.split('')[0] === '='){
      const res = value.split(/(\d[^*\/+-]*[*\/+-])/g).map((m, i, a) => i%2 ? m[m.length  -1] : m + (a[i+1] || "").slice(0, -1));
      if(res[2]?.length > 1){
        const firstTR = (this.headerIndex(res[0][1])) - 1;
        const firstTD = res[0].slice(2);
        const secondTR = (this.headerIndex(res[2][0])) - 1;
        const secondTD = res[2].slice(1);
        const operator = res[1];
        const firstValue = this.dataSource?.filteredData[firstTD][firstTR] !== '' ? this.dataSource?.filteredData[firstTD][firstTR] : 0;
        const secondValue = this.dataSource.filteredData[secondTD][secondTR] !== '' ? this.dataSource.filteredData[secondTD][secondTR] : 0;
        const result = eval(`${firstValue}${operator}${secondValue}`);
        const formula = `${res[0][1]}${firstTD} ${operator} ${res[2][0]}${secondTD}`;
        this.setAction(row, col, formula);
        this.dataSource.filteredData[row][col] = result;
      }
    }
  }
  headerIndex(header: string): number {
    return this.displayedColumns.findIndex(el => el.toLowerCase() === header.toLowerCase());
  }
  setAction(rindex, cindex, data): void{
    this.editor.actions.push({col: cindex, row: rindex, action: data});
  }
  checkTooltip(rindex, cindex) {
   return this.editor.actions.map(el => {
      if (el.row === rindex && el.col === cindex){
        return el.action;
      }
    });
  }
  switchToInput(rindex, cindex): void {
    this.editor.editPointer.col = cindex;
    this.editor.editPointer.row = rindex;
  }
}
