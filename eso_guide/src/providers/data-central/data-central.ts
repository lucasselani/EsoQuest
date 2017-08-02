import { Injectable } from '@angular/core';
import { QuestItem } from '../../model/questitem';

/*
  Generated class for the DataCentralProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DataCentralProvider {
  private questList: Array<QuestItem>;

  constructor() {
    this.questList = new Array<QuestItem>();
  }

  public getQuestList(): Promise<any> {
    return new Promise((resolve,reject) => {
      resolve(this.questList);
    });
  }

  public setQuestList(questList: Array<QuestItem>) {
    this.questList = questList;
  }

}
