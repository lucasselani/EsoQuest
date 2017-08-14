import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RestapiProvider } from '../../providers/restapi/restapi';
import { DataCentralProvider } from '../../providers/data-central/data-central';
import { QuestDetail, Rewards, Steps } from '../../model/questdetail';
import { QuestItem } from '../../model/questitem';
import { AdMobPro } from '@ionic-native/admob-pro';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

/**
 * Generated class for the QuestDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-quest-detail',
  templateUrl: 'quest-detail.html',
})
export class QuestDetailPage {
  questDetailArray: Array<QuestDetail>;
  allQuests: Array<QuestItem>;
  firebaseQuests: FirebaseObjectObservable<any[]>;
  private questId: number;
  private quest = null;
  admobid = {
    banner: 'ca-app-pub-8213289176081397/8308163618',
    interstitial: 'ca-app-pub-8213289176081397/6078065024'
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public db: AngularFireDatabase,
    public restapi: RestapiProvider, public admob: AdMobPro, public data: DataCentralProvider) {
    this.prepareAdMob();
    this.questId = navParams.data;

    this.firebaseQuests = this.db.object(`/quests-detail/${this.questId}`);
    this.firebaseQuests.subscribe(data => {
      this.quest = data;
    })
  }
  

  prepareAdMob() {
    this.admob.createBanner({
      adId: this.admobid.banner,
      position: this.admob.AD_POSITION.BOTTOM_CENTER,
      autoShow: true,
      isTesting: true
    });
  } 

}
