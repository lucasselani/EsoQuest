import { Component, ViewChild } from '@angular/core';
import { Platform, Events, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RestapiProvider } from '../providers/restapi/restapi';
import { SqliteProvider } from '../providers/sqlite/sqlite';
import { DataCentralProvider } from '../providers/data-central/data-central';
import { HomePage } from '../pages/home/home';
import { StreamPage } from '../pages/stream/stream';
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
      { title: 'Quests', component: QuestlistPage },
      { title: 'Streams', component: StreamPage }
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
    this.firebaseQuests.subscribe(data => {
      this.quests = new Array<QuestItem>();
      this.quests = data;
      this.dataCentral.setQuestList(this.quests);
      console.log('quests got. size: ' + this.quests.length);
    });
  }
}

