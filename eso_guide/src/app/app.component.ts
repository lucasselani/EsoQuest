import { Component, ViewChild } from '@angular/core';
import { Platform, Events, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RestapiProvider } from '../providers/restapi/restapi';
import { SqliteProvider } from '../providers/sqlite/sqlite';
import { DataCentralProvider } from '../providers/data-central/data-central';
import { HomePage } from '../pages/home/home';
import { QuestItem } from '../model/questitem';
import { QuestlistPage } from '../pages/questlist/questlist';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  pages: Array<{ title: string, component: any }>;
  rootPage: any = HomePage;
  table: string;
  quests: Array<QuestItem>;
  firebaseQuests: FirebaseListObservable<any[]>;
  questValue: number = 0;
  admobid = {};

  constructor(public platform: Platform, public statusBar: StatusBar, //public sqlite: SqliteProvider,
    public restapi: RestapiProvider, public dataCentral: DataCentralProvider, public db: AngularFireDatabase) {
    this.firebaseQuests = this.db.list('/quests');
    this.getQuests();
    this.initializeApp();
    this.pages = [
      { title: 'News', component: HomePage },
      { title: 'Quests', component: QuestlistPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.     
      this.statusBar.styleDefault();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  getQuests() {
    console.log('getting quests');
    this.quests = new Array<QuestItem>();
    this.getQuestsFirebase();
    /*this.getQuestsHttp();
    /this.sqlite.getQuestsSql().then(data => {
        if (data.length == 0) this.getQuestsHttp();
        else{
          this.quests = data;
          this.events.publish('questListReady', this.quests);
        } 
    });*/
  }

  getQuestsFirebase() {
    this.firebaseQuests.subscribe(data => {
      this.quests = data[0];
      this.dataCentral.setQuestList(this.quests);
    });
  }

  getQuestsHttp() {
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

    if (rows.length == 301) {
      this.questValue += 300;
      this.getQuestsHttp();
    } else {
      //this.sqlite.addAllSql(this.quests);
      //this.firebaseQuests.push(this.quests);
      this.dataCentral.setQuestList(this.quests);
    }
  }
}

