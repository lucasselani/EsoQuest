import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { DataCentralProvider } from '../../providers/data-central/data-central';
import { AutoCompleteProvider } from '../../providers/auto-complete/auto-complete';
import { AutoCompleteComponent } from 'ionic2-auto-complete';
import { AdMobPro } from '@ionic-native/admob-pro';
import { SetSummary } from '../../model/set';
import { ItemlistPage } from '../itemlist/itemlist';

/**
 * Generated class for the SetlistPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
const SCROLL_SIZE = 20;

@Component({
  selector: 'page-setlist',
  templateUrl: 'setlist.html',
})
export class SetlistPage {
  @ViewChild('searchbar')
  searchbar: AutoCompleteComponent;
  sets: Array<SetSummary>;
  allSets: Array<SetSummary>;
  itemsShown: number = 0;
  loading: any = null;
  alert: any = null;
  pageName: string = "All Quests";
  notSearching: boolean = true;
  admobid = {
    banner: 'ca-app-pub-8213289176081397/8308163618',
    interstitial: 'ca-app-pub-8213289176081397/6078065024'
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataCentral: DataCentralProvider, public admob: AdMobPro,
    public loadingCtrl: LoadingController, public autoComplete: AutoCompleteProvider) {
    this.prepareAdMob();
    this.dataCentral.getSetList().then(data => {
      this.allSets = data;
      this.autoComplete.setDataProvider(this.allSets, "name", "sliceStringAndCompare");
      this.allSets.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
      this.sets = new Array<SetSummary>();
      this.sets.push(...this.allSets.slice(0, SCROLL_SIZE));
      this.itemsShown += SCROLL_SIZE;
      console.log('page ready');
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetlistPage');
  }

  prepareAdMob() {
    this.admob.createBanner({
      adId: this.admobid.banner,
      position: this.admob.AD_POSITION.BOTTOM_CENTER,
      autoShow: true,
      isTesting: true
    });
  }

  configureLoadingDefault() {
    if (this.loading == null)
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
  }

  doInfinite(event) {
    if (!this.notSearching) return;
    this.sets.push(...this.allSets.slice(this.itemsShown, this.itemsShown + SCROLL_SIZE));
    this.itemsShown += SCROLL_SIZE;
    event.complete();
  }

  openSetInList(set) {
    this.navCtrl.push(ItemlistPage, set);
  }

  openSetInSearchbar() {
    let name = this.searchbar.getValue();
    this.searchbar.clearValue();
    this.sets.forEach(item => {
      if (item.name == name) this.navCtrl.push(ItemlistPage, item);
    });
  }

  searchInSetsPage() {
    let keyword = this.searchbar.keyword;
    if (keyword == "") {
      this.pageName = "Sets";
      this.sets.push(...this.allSets.slice(0, SCROLL_SIZE));
      this.itemsShown = SCROLL_SIZE;
      this.notSearching = true;
      return;
    } else if (keyword.trim() == "") return;

    keyword = keyword.trim();
    let results: Array<SetSummary> = this.autoComplete.suggestions;

    if (results.length == 0) {
      alert("No results found.");
      this.searchbar.clearValue();
    } else {
      this.itemsShown = 0;
      this.notSearching = false;
      this.pageName = `Search for "${keyword}"`;
      this.sets = results;
    }
  }

}
