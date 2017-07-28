import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the RestapiProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class RestapiProvider {
  urlQuestList: string = "http://esoitem.uesp.net/viewlog.php?record=quest&start=";
  urlQuestDetails: string = "http://esoitem.uesp.net/viewlog.php?action=view&record=quest&id="
  urlQuestSteps: string = "http://esoitem.uesp.net/viewlog.php?record=questStep&filter=questId&filterid=";
  urlQuestRewards: string = "http://esoitem.uesp.net/viewlog.php?record=questReward&filter=questId&filterid=";

  constructor(public http: Http) {
    console.log('Hello RestapiProvider Provider');
  }

  public getQuests(itemValue:number): Promise<any> {
    return new Promise(resolve => {
      this.http.get(this.urlQuestList+itemValue).subscribe(data => resolve(data));
    });
  }

  public getQuestDetails(id:number): Promise<any> {
    return new Promise(resolve => {
      this.http.get(this.urlQuestDetails+id).subscribe(data => resolve(data));
    })
  }

  public getQuestSteps(id:number): Promise<any> {
    return new Promise(resolve => {
      this.http.get(this.urlQuestSteps+id).subscribe(data => resolve(data));
    })
  }

  public getQuestRewards(id:number): Promise<any> {
    return new Promise(resolve => {
      this.http.get(this.urlQuestRewards+id).subscribe(data => resolve(data));
    })
  }
}
