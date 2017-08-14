import { Injectable } from '@angular/core';
import { QuestItem } from '../../model/questitem';

/*
  Generated class for the AutoCompleteProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AutoCompleteProvider {
  private data = [];
  private filterMethod: string;
  public suggestions = [];
  labelAttribute = "";


  constructor() { }

  setDataProvider(data, label, filter) {
    this.data = data;
    this.labelAttribute = label;
    this.filterMethod = filter;
  }

  getResults(keyword: string) {
    let filterArray = this.filterMethods[this.filterMethod];
    let data = filterArray(keyword.toLocaleLowerCase());
    return this.suggestions = data;
  }

  filterMethods = {
    "sliceStringAndCompare": (keyword: string) => {
      let results = [];
      let result = (keyword: string, stringToSlice: string) => {
        stringToSlice = stringToSlice.slice(0, keyword.length).toLocaleLowerCase();
        if (stringToSlice < keyword) return -1;
        if (stringToSlice > keyword) return 1;
        return 0;
      }

      for (let i = 0; i < this.data.length; i++) {
        if (result(keyword, this.data[i][this.labelAttribute]) == 0) results.push(this.data[i]);
        else if (result(keyword, this.data[i][this.labelAttribute]) == 1) break;
      }
      return results;
    },
    "includesKeyword": (keyword: string) => {
      let results = [];
      this.data.forEach(item => {
        if(item[this.labelAttribute].toLocaleLowerCase().includes(keyword)) results.push(item);
      });
      return results;
    }
  }

}
