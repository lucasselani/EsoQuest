import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
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
  allQuests: Array<QuestItem>;
  itemsShown: number = 0;
  loading: any = null;
  alert: any = null;
  pageName: string = "All Quests";

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertController: AlertController, private loadingCtrl: LoadingController) {
    this.allQuests = navParams.data.quests;
    this.quests = new Array<QuestItem>();
    this.quests.push(...this.allQuests.slice(0,100));
    this.itemsShown += 100;

    if(navParams.data.keyword != null){
      this.pageName = 'Search for "' + navParams.data.keyword + '"';
    } 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuestlistPage');
  }

  openQuest(id: number) {
    this.navCtrl.push(QuestDetailPage, id);
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
      if (data == 'level') {
        this.quests.sort(function (a, b) {
          if (a.level < b.level) return -1;
          if (a.level > b.level) return 1;
          return 0;
        })
      } else if (data == 'name') {
        this.quests.sort(function (a, b) {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        })
      } else {
        this.quests.sort(function (a, b) {
          if (a.zone < b.zone) return -1;
          if (a.zone > b.zone) return 1;
          return 0;
        })
      }     
      
      if(this.loading != null){
        this.loading.dismiss().then(() => {
          this.alert.dismiss();
          this.alert = null;
        });  
        this.loading = null;
      }
    });  
  }

  configureLoadingDefault() {
    if(this.loading == null)
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
  }

  doInfinite(event){
    this.quests.push(...this.allQuests.slice(this.itemsShown,this.itemsShown+100));
    this.itemsShown += 100;
    event.complete();
  }

}
