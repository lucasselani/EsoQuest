import { Component, ViewChild } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { QuestItem } from '../../model/questitem';
import { AutoCompleteProvider } from '../../providers/auto-complete/auto-complete';
import { QuestlistPage } from '../questlist/questlist';
import { QuestDetailPage } from '../quest-detail/quest-detail';
import { AutoCompleteComponent } from 'ionic2-auto-complete';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RestapiProvider } from '../../providers/restapi/restapi';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('searchbar')
  searchbar: AutoCompleteComponent;
  quests: Array<QuestItem>;

  constructor(public navCtrl: NavController, public autoComplete: AutoCompleteProvider, public events: Events, public splashScreen: SplashScreen, restapi:RestapiProvider) {
    events.subscribe('questListReady', (quests) => {
      this.quests = quests;
      
    });
    let questsJSON = restapi.getQuestsFromFile();
    console.log(JSON.stringify(questsJSON));

  }

  openQuestList(){
    let opts = {
      quests: this.quests,
      keyword: null
    }
    this.navCtrl.push(QuestlistPage, opts);
  }

  openItem(){
    let name = this.searchbar.getValue();
    this.searchbar.clearValue();
    this.quests.forEach(item => {
      if(item.name == name) this.navCtrl.push(QuestDetailPage, item.id);
    });    
  }

  openItems(){
    if(this.searchbar.keyword.trim() == "") return;
    else if(this.searchbar.suggestions.length == 0) alert("No results found.");
    let opts = {
      quests: this.searchbar.suggestions,
      keyword: this.searchbar.keyword
    }
    this.searchbar.clearValue();
    this.navCtrl.push(QuestlistPage, opts);
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.splashScreen.hide();
    },1000);    
  }
}
