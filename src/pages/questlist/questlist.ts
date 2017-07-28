import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { QuestItem } from '../../model/questitem';
import { QuestDetailPage } from '../quest-detail/quest-detail';

/**
 * Generated class for the QuestlistPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-questlist',
  templateUrl: 'questlist.html',
})
export class QuestlistPage {
  quests: Array<QuestItem>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.quests = navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuestlistPage');
  }

  openQuest(id:number){
    this.navCtrl.push(QuestDetailPage, id);
  }

}
