import { Injectable } from '@angular/core';
import { QuestItem } from '../../model/quest';
import { SetSummary } from '../../model/set';

/*
  Generated class for the DataCentralProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DataCentralProvider {
  private questList: Array<QuestItem>;
  private setList: Array<SetSummary>;

  constructor() { }

  public getQuestList(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(this.questList);
    });
  }

  public setQuestList(questList: Array<QuestItem>) {
    this.questList = questList;
  }

  public getSetList(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(this.setList);
    });
  }

  public setSetList(setList: Array<SetSummary>) {
    this.setList = setList;
  }

}
