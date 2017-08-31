import { Component, ViewChild } from '@angular/core';
import { Platform, Events, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RestapiProvider } from '../providers/restapi/restapi';
import { SqliteProvider } from '../providers/sqlite/sqlite';
import { DataCentralProvider } from '../providers/data-central/data-central';
import { HomePage } from '../pages/home/home';
import { StreamPage } from '../pages/stream/stream';
import { SetlistPage } from '../pages/setlist/setlist';
import { SkillListPage } from '../pages/skill-list/skill-list';
import { QuestItem } from '../model/quest';
import { SetSummary } from '../model/set';
import { QuestlistPage } from '../pages/questlist/questlist';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';


@Component({
  templateUrl: 'app.html'
})
export class EsoGuide {
  @ViewChild(Nav) nav: Nav;
  pages: Array<{title: string, component: any}>;
  rootPage: any = HomePage;
  firebaseQuests: FirebaseListObservable<any[]>;
  firebaseSets: FirebaseListObservable<any[]>;
  firebaseSkills: FirebaseListObservable<any[]>;

  constructor(public platform: Platform, public statusBar: StatusBar, //public sqlite: SqliteProvider,
    public restapi: RestapiProvider, public dataCentral: DataCentralProvider, public db: AngularFireDatabase) {
    this.getFirebaseContents();
    this.initializeApp();
    this.pages = [
      { title: 'News', component: HomePage },
      { title: 'Quests', component: QuestlistPage },
      { title: 'Sets', component: SetlistPage },
      { title: 'Skills', component: SkillListPage },
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

  getFirebaseContents() {
    this.firebaseQuests = this.db.list('/quests');
    this.firebaseSets = this.db.list('/set-summary');
    this.firebaseSkills = this.db.list('/skill-list')

    console.log('getting quests');    
    this.firebaseQuests.subscribe(data => {
      this.dataCentral.setQuestList(data);
      console.log('quests got. size: ' + data.length);      
      console.log('getting sets');
      this.firebaseSets.subscribe(data => {
        this.dataCentral.setSetList(data);
        console.log('sets got. size: ' + data.length);        
        console.log('getting skills');
        this.firebaseSkills.subscribe(data => {
          this.dataCentral.setSkillList(data);
          console.log('skills got. size: ' + data.length);
        })
      })
    });
  }
}

