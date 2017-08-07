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
  private urlSetSummary: string = "http://esoitem.uesp.net/viewlog.php?record=setSummary";
  private urlItemSummary: string = "http://esoitem.uesp.net/itemLink.php?summary&itemid=";
  private urlDataTable: string = "http://esoitem.uesp.net/dumpMinedItems.php?output=html&itemid="
  private urlItemDataImage: string = "http://esoitem.uesp.net/itemLinkImage.php?level=1-CP160&quality=0-5&summary&itemid=";
  private urlSkillList: string = "http://esoitem.uesp.net/viewlog.php?record=skillTree&start="

  constructor(public http: Http) {
    console.log('Hello RestapiProvider Provider');
  }

  public getSkills(itemValue: number): Promise<any> {
    return new Promise(resolve => {
      this.http.get(this.urlSkillList + itemValue).subscribe(data => resolve(data));
    });
  }

  public getQuests(itemValue: number): Promise<any> {
    return new Promise(resolve => {
      this.http.get(this.urlQuestList + itemValue).subscribe(data => resolve(data));
    });
  }

  public getQuestDetails(id: number): Promise<any> {
    return new Promise(resolve => {
      this.http.get(this.urlQuestDetails + id).subscribe(data => resolve(data));
    });
  }

  public getQuestSteps(id: number): Promise<any> {
    return new Promise(resolve => {
      this.http.get(this.urlQuestSteps + id).subscribe(data => resolve(data));
    });
  }

  public getQuestRewards(id: number): Promise<any> {
    return new Promise(resolve => {
      this.http.get(this.urlQuestRewards + id).subscribe(data => resolve(data));
    });
  }

  public getSetSummaries(): Promise<any> {
    return new Promise(resolve => {
      this.http.get(this.urlSetSummary).subscribe(data => resolve(data));
    });
  }

  public getItemSummary(itemId: number): Promise<any> {
    return new Promise(resolve => {
      this.http.get(this.urlItemSummary + itemId).subscribe(data => resolve(data));
    });
  }

  public getDataTable(itemId: number): Promise<any> {
    return new Promise(resolve => {
      this.http.get(this.urlDataTable + itemId).subscribe(data => { resolve(data); });
    });
  }

  public getMinedItemSummaries(itemName: string, itemCount: number): Promise<any> {
    let url = "http://esoitem.uesp.net/viewlog.php?record=minedItemSummary&filter=setName&filterid="
      + itemName + "&start=" + itemCount;
    return new Promise(resolve => {
      this.http.get(url).subscribe(data => resolve(data));
    });
  }
}
