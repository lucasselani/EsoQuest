import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RestapiProvider } from '../../providers/restapi/restapi';
import { QuestItem } from '../../model/questitem';
import { AutoCompleteProvider } from '../../providers/auto-complete/auto-complete';
import { QuestlistPage } from '../questlist/questlist';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  table: any;
  quests: any;
  questValue: number = 0;

  constructor(public navCtrl: NavController, public restapi: RestapiProvider, public autoComplete: AutoCompleteProvider) {
    this.quests = new Array<QuestItem>();
    this.getQuests();
  }

  getQuests() {
    this.restapi.getQuests(this.questValue).then(data => {
      this.table = data._body;
      //console.log(this.table);
      let firstSplit = this.table.split("<table border='1' cellspacing='0' cellpadding='2'>");
      let secondSplit = firstSplit[1].split("</table>");

      let s = secondSplit[0];
      let temp = document.createElement('table');
      temp.innerHTML = s;
      //console.log(s);

      this.tableToJSON(temp);
    });
  }

  tableToJSON(table) {
    let rows = table.rows;
    for (let i = 1; i < rows.length; i++) {
      let quest = new QuestItem();
      quest.id = rows[i].cells[1].textContent;
      quest.zone = rows[i].cells[2].textContent;
      quest.name = rows[i].cells[3].textContent;
      quest.level = rows[i].cells[4].textContent;
      this.quests.push(quest);
    }

    if(rows.length == 301){
      this.questValue+=300;
      this.getQuests();
    } else {
      this.autoComplete.setQuestList(this.quests);
      console.log(JSON.stringify(this.quests));  
    }    
  }

  questList(){
    this.navCtrl.push(QuestlistPage, this.quests);
  }
}
