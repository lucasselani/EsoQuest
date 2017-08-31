import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { AdMobPro } from '@ionic-native/admob-pro';
import { SetSummary, ItemSummary } from '../../model/set';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';


/**
 * Generated class for the ItemlistPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
const SCROLL_SIZE = 20;

@Component({
  selector: 'page-itemlist',
  templateUrl: 'itemlist.html',
})
export class ItemlistPage {
  items: Array<ItemSummary>;
  allItems: Array<ItemSummary>;
  itemsShown: number = 0;
  loading: any = null;
  alert: any = null;
  notSearching: boolean = true;
  admobid = {
    banner: 'ca-app-pub-8213289176081397/8308163618',
    interstitial: 'ca-app-pub-8213289176081397/6078065024'
  };
  set: SetSummary;
  setName: string;
  firebaseItems: FirebaseListObservable<any[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public admob: AdMobPro, public loadingCtrl: LoadingController, public db: AngularFireDatabase) {
    this.set = navParams.data;
    this.setName = this.set.name;
    this.prepareAdMob();
    this.firebaseItems = this.db.list(`/item-summary/${this.set.id}`);
    this.firebaseItems.subscribe(data => {
      this.items = data;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ItemlistPage');
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
    this.items.push(...this.allItems.slice(this.itemsShown, this.itemsShown + SCROLL_SIZE));
    this.itemsShown += SCROLL_SIZE;
    event.complete();
  }

}
