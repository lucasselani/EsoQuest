import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the RestapiProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class RestapiProvider {
  private urlQuestList: string = "http://esoitem.uesp.net/viewlog.php?record=quest&start=";
  private urlQuestDetails: string = "http://esoitem.uesp.net/viewlog.php?action=view&record=quest&id="
  private urlQuestSteps: string = "http://esoitem.uesp.net/viewlog.php?record=questStep&filter=questId&filterid=";
  private urlQuestRewards: string = "http://esoitem.uesp.net/viewlog.php?record=questReward&filter=questId&filterid=";
  private urlStreams: string = "https://api.twitch.tv/kraken/streams/?game=The%20Elder%20Scrolls%20Online";

  constructor(public http: Http) {
    console.log('Hello RestapiProvider Provider');
  }

  public getQuests(itemValue: number): Promise<any> {
    return new Promise(resolve => {
      this.http.get(this.urlQuestList + itemValue).subscribe(data => resolve(data));
    });
  }

  public getQuestsFromFile() {
    return this.http.get("../assets/quests.json").map(res => { return res.json() });
  }

  public getQuestDetails(id: number): Promise<any> {
    return new Promise(resolve => {
      this.http.get(this.urlQuestDetails + id).subscribe(data => resolve(data));
    })
  }

  public getQuestSteps(id: number): Promise<any> {
    return new Promise(resolve => {
      this.http.get(this.urlQuestSteps + id).subscribe(data => resolve(data));
    })
  }

  public getQuestRewards(id: number): Promise<any> {
    return new Promise(resolve => {
      this.http.get(this.urlQuestRewards + id).subscribe(data => resolve(data));
    })
  }

  public getListOfStreams(): Promise<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Client-ID', '64sh738h8vlofi6hepuvq5522cqarv');
    headers.append('Accept', 'application/vnd.twitchtv.v5+json');
    return new Promise(resolve => {
      this.http.get(this.urlStreams, { headers: headers })
        .map(response => response.json())
        .subscribe(data => resolve(data));  
    })
  }
}
