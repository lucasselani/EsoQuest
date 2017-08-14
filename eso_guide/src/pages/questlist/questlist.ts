import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Events } from 'ionic-angular';
import { QuestItem } from '../../model/questitem';
import { QuestDetailPage } from '../quest-detail/quest-detail';
import { DataCentralProvider } from '../../providers/data-central/data-central';
import { AutoCompleteProvider } from '../../providers/auto-complete/auto-complete';
import { AutoCompleteComponent } from 'ionic2-auto-complete';
import { AdMobPro } from '@ionic-native/admob-pro';

/**
 * Generated class for the QuestlistPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
const SCROLL_SIZE = 20;

@Component({
  selector: 'page-questlist',
  templateUrl: 'questlist.html',
})
export class QuestlistPage {
  @ViewChild('searchbar')
  searchbar: AutoCompleteComponent;
  quests: Array<QuestItem>;
  allQuests: Array<QuestItem>;
  itemsShown: number = 0;
  loading: any = null;
  alert: any = null;
  pageName: string = "All Quests";
  notSearching: boolean = true;
  admobid = {
    banner: 'ca-app-pub-8213289176081397/8308163618',
    interstitial: 'ca-app-pub-8213289176081397/6078065024'
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public admob: AdMobPro,
    private alertController: AlertController, private loadingCtrl: LoadingController,
    public dataCentral: DataCentralProvider, public autoComplete: AutoCompleteProvider) {
    this.prepareAdMob();
    this.dataCentral.getQuestList().then((questList) => {
      this.allQuests = questList;
      this.autoComplete.setDataProvider(this.allQuests, "name", "sliceStringAndCompare");
      this.filterList("name");
      this.quests = new Array<QuestItem>();
      this.quests.push(...this.allQuests.slice(0, SCROLL_SIZE));
      this.itemsShown += SCROLL_SIZE;
      console.log('page ready');
    });
  }

  prepareAdMob() {
    this.admob.createBanner({
      adId: this.admobid.banner,
      position: this.admob.AD_POSITION.BOTTOM_CENTER,
      autoShow: true,
      isTesting: true
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuestlistPage');
  }

  openQuestInList(id: number) {
    this.navCtrl.push(QuestDetailPage, id);
  }

  openQuestInSearchbar() {
    let name = this.searchbar.getValue();
    this.searchbar.clearValue();
    this.quests.forEach(item => {
      if (item.name == name) this.navCtrl.push(QuestDetailPage, item.id);
    });
  }

  searchInQuestPage() {
    let keyword = this.searchbar.keyword;
    if (keyword == "") {
      this.pageName = "Quests";
      this.quests.push(...this.allQuests.slice(0, SCROLL_SIZE));
      this.itemsShown = SCROLL_SIZE;
      this.notSearching = true;
      return;
    } else if (keyword.trim() == "") return;

    keyword = keyword.trim();
    let results: Array<QuestItem> = this.autoComplete.suggestions;

    if (results.length == 0) {
      alert("No results found.");
      this.searchbar.clearValue();
    } else {
      this.itemsShown = 0;
      this.notSearching = false;
      this.pageName = `Search for "${keyword}"`;
      this.quests = results;
    }
  }

  showFilters() {
    this.alert = this.alertController.create({
      title: 'Filter list',
      message: 'Choose an option to order the list',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('cancel filter');
          }
        },
        {
          text: 'Sort',
          handler: data => {
            this.filterList(data);
          }
        }
      ],
      inputs: [
        {
          label: 'Level',
          type: 'radio',
          value: 'level'
        },
        {
          label: 'Name',
          type: 'radio',
          value: 'name'
        },
        {
          label: 'Zone',
          type: 'radio',
          value: 'zone'
        }
      ]
    });
    this.alert.present();
  }

  filterList(data: string) {
    this.configureLoadingDefault();
    this.loading.present().then(() => {
      this.allQuests.sort(this.sortListByParameter(data));
      this.quests.sort(this.sortListByParameter(data));
      if (this.loading != null) {
        this.loading.dismiss().then(() => {
          if (this.alert != null) {
            this.alert.dismiss();
            this.alert = null;
          }
        });
        this.loading = null;
      }
    });
  }

  sortListByParameter(data) {
    if (data == 'level') {
      return (a, b) => {
        if (a.level < b.level) return -1;
        if (a.level > b.level) return 1;
        return 0;
      }
    } else if (data == 'name') {
      return (a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      }
    } else if (data == 'zone') {
      return (a, b) => {
        if (a.zone < b.zone) return -1;
        if (a.zone > b.zone) return 1;
        return 0;
      }
    }
  }

  configureLoadingDefault() {
    if (this.loading == null)
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
  }

  doInfinite(event) {
    if (!this.notSearching) return;
    this.quests.push(...this.allQuests.slice(this.itemsShown, this.itemsShown + SCROLL_SIZE));
    this.itemsShown += SCROLL_SIZE;
    event.complete();
  }

}
