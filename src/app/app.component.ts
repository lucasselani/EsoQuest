import { Component } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RestapiProvider } from '../providers/restapi/restapi';
import { HomePage } from '../pages/home/home';
import { QuestItem } from '../model/questitem';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;
  table: string;
  quests: Array<QuestItem>;
  questValue: number = 0;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public restapi: RestapiProvider, public events: Events) {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.  
      console.log('getting quests');
      this.quests = new Array<QuestItem>();
      this.getQuests();  
      this.statusBar.styleDefault();  
    });
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
      console.log('quests got');
      this.events.publish('questListReady', this.quests);
    }    
  }
}

