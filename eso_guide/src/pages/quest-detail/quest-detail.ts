import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RestapiProvider } from '../../providers/restapi/restapi';
import { DataCentralProvider } from '../../providers/data-central/data-central';
import { QuestDetail, Rewards, Steps } from '../../model/questdetail';
import { QuestItem } from '../../model/questitem';
import { AdMobPro } from '@ionic-native/admob-pro';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

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
  firebaseQuests: FirebaseListObservable<any[]>;
  private questId: number;
  public quest: QuestDetail = null;
  admobid = {
    banner: 'ca-app-pub-8213289176081397/8308163618',
    interstitial: 'ca-app-pub-8213289176081397/6078065024'
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public db: AngularFireDatabase,
    public restapi: RestapiProvider, public admob: AdMobPro, public data: DataCentralProvider) {
    this.prepareAdMob();
    this.questId = navParams.data;
    this.quest = new QuestDetail();
    //this.getQuestDetail();
    //this.getQuestSteps();
    //this.getQuestRewards();
    this.firebaseQuests = this.db.list('/quests-detail');
    this.questDetailArray = new Array<QuestDetail>();
    this.getAllDetails();
  }

  getAllDetails() {
    this.data.getQuestList().then(data => {
      this.allQuests = data;
      this.getQuests(0);
    });
  }

  getQuests(i) {
    this.getQuestDetail(this.allQuests[i].id).then((questDetail) => {
      this.questDetailArray.push(questDetail);
      this.getQuestRewards(this.allQuests[i].id).then((questReward) => {
        this.questDetailArray[i].rewards = questReward;
        this.getQuestSteps(this.allQuests[i].id).then((questStep) => {
          this.questDetailArray[i].steps = questStep;
          console.log(this.questDetailArray[i]);
          if(i<this.allQuests.length-1) this.getQuests(i+1);
          else{
            console.log(JSON.stringify(this.questDetailArray));
            this.firebaseQuests.push(this.questDetailArray);
          } 
        })
      })
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

  getTableContents(table: string): any {
    let firstSplit;
    if (table.includes("<table border='1' cellspacing='0' cellpadding='2'>")) firstSplit = table.split("<table border='1' cellspacing='0' cellpadding='2'>");
    else firstSplit = table.split("<table border='1' cellpadding='2' cellspacing='0'>");
    let secondSplit = firstSplit[1].split("</table>");

    let s = secondSplit[0];
    let temp = document.createElement('table');
    temp.innerHTML = s;
    //console.log(s);
    return temp;
  }

  getQuestDetail(id) {
    return this.restapi.getQuestDetails(id).then(data => {
      return this.detailTableToJSON(this.getTableContents(data._body));
    });
  }

  getQuestSteps(id) {
    return this.restapi.getQuestSteps(id).then(data => {
      return this.stepsTableToJSON(this.getTableContents(data._body));
    });
  }
  getQuestRewards(id) {
    return this.restapi.getQuestRewards(id).then(data => {
      return this.rewardsTableToJSON(this.getTableContents(data._body));
    });
  }

  detailTableToJSON(table) {
    let rows = table.rows;
    let quest: QuestDetail = new QuestDetail();
    quest.id = rows[0].cells[1].textContent;
    quest.zone = rows[1].cells[1].textContent;
    quest.name = rows[2].cells[1].textContent;
    quest.level = rows[3].cells[1].textContent;
    quest.repeatType = rows[5].cells[1].textContent;
    quest.backgroundText = rows[7].cells[1].textContent;
    quest.goalText = rows[10].cells[1].textContent;
    return quest;
  }

  stepsTableToJSON(table) {
    let rows = table.rows;
    let steps = new Array<Steps>();
    for (let i = 1; i < rows.length; i++) {
      let step: Steps = new Steps();
      step.id = rows[i].cells[1].textContent;
      step.zone = rows[i].cells[2].textContent;
      step.questid = rows[i].cells[5].textContent;
      step.uniqueid = rows[i].cells[6].textContent;
      step.stageIndex = rows[i].cells[7].textContent;
      step.stepIndex = rows[i].cells[8].textContent;
      step.text = rows[i].cells[9].textContent;
      step.overrideText = rows[i].cells[11].textContent;
      steps.push(step);
    }

    steps.sort((a, b) => {
      return a.stageIndex - b.stageIndex == 0 ? a.stepIndex - b.stepIndex : a.stageIndex - b.stageIndex;
    });

    return steps;
  }

  rewardsTableToJSON(table) {
    let rows = table.rows;
    let rewards = new Array<Rewards>();
    for (let i = 1; i < rows.length; i++) {
      let reward: Rewards = new Rewards();
      reward.id = rows[i].cells[1].textContent;
      reward.type = rows[i].cells[5].textContent;
      reward.name = rows[i].cells[6].textContent;
      reward.quantity = rows[i].cells[7].textContent;      
      reward.quality = rows[i].cells[9].textContent;

      let icon: string = rows[i].cells[8].textContent;
      if(reward.type == "Experience") icon = "/esoui/art/icons/icon_experience.png";
      else if(reward.type == "Money") icon = "/esoui/art/icons/item_generic_coinbag.png";
      else if(reward.type == "Alliance Points") icon = "/esoui/art/icons/icon_alliancepoints.png";
      else if(reward.type == "Inspiration") icon = "/esoui/art/icons/crafting_inspiration_logo.png";
      else if(reward.type == "Writ Vouchers") icon = "/esoui/art/icons/icon_writvoucher.png";
      if(icon != "") icon = icon.replace(".dds", ".png");
      reward.icon = icon;

      rewards.push(reward);
    }
    return rewards;
  }

}
