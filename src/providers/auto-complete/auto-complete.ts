import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { QuestItem } from '../../model/questitem';

/*
  Generated class for the AutoCompleteProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AutoCompleteProvider {
  private questList:Array<QuestItem>;
  labelAttribute = "name";

  constructor(public http: Http) {
    this.questList = new Array<QuestItem>();
    console.log('Hello AutoCompleteProvider Provider');
  }

  setQuestList(quests) {
    this.questList = quests;
  }

  getResults(keyword:string) {
    return this.questList.filter(quest => quest.name.toLowerCase().startsWith(keyword));
  }

}
