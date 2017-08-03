import { Component } from '@angular/core';
import { NavController, LoadingController, Loading } from 'ionic-angular';
import { RestapiProvider } from '../../providers/restapi/restapi';
import { QuestItem } from '../../model/questitem';
import { QuestDetail, Rewards, Steps } from '../../model/questdetail';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  questDetailArray: Array<QuestDetail>;
  firebaseQuestDetailArray: FirebaseListObservable<any[]>;
  questListArray: Array<QuestItem>;
  firebaseQuestListArray: FirebaseListObservable<any[]>;
  loading: Loading;
  upload: boolean = false;

  constructor(public navCtrl: NavController, public restapi: RestapiProvider,
    public loadingCtrl: LoadingController, public db: AngularFireDatabase) {
    this.questListArray = new Array<QuestItem>();
    this.questDetailArray = new Array<QuestDetail>();
  }

  //--------------------------------------- QUEST DETAIL METHODS ---------------------------------------------//

  fetchQuestsDetail() {
    if (this.questListArray.length == 0) {
      alert('Fetch quests first');
      return;
    }
    this.configureLoadingDefault();
    this.loading.present().then(() => {
      this.getQuestsDetailsRecursive(0);
    });
  }

  fetchAndPushQuestsDetail() {
    this.fetchQuestsDetail();
    this.upload = true;
  }

  questsDetailToFirebase() {
    if (this.questDetailArray.length == 0 || this.questListArray.length == 0) {
      alert('Fetch quests first');
      return;
    }
    this.configureLoadingDefault();
    this.loading.present().then(() => {
      this.firebaseQuestDetailArray = this.db.list('/quests-detail');
      this.uploadQuestsDetail(0);
    });
  }

  uploadQuestsDetail(i) {
    this.firebaseQuestDetailArray.update(this.questDetailArray[i].id + "", this.questDetailArray[i])
      .then(() => {
        if (i == this.questDetailArray.length - 1) {
          this.loading.dismiss();
          this.loading = null;
          return;
        } else {
          console.log(`push quest: ${this.questDetailArray[i].name} to firebase successfull`);
          this.uploadQuestsDetail(i + 1);
        }
      }).catch((err) => {
        if (i == this.questDetailArray.length - 1) {
          this.loading.dismiss();
          this.loading = null;
          return;
        } else {
          console.log(`error to push to firebase: ${err}`);
          this.uploadQuestsDetail(i + 1);
        }
      });
  }

  logQuestDetail() {
    if (this.questDetailArray.length == 0) {
      alert('Fetch quests detail first');
      return;
    }
    console.log(this.questDetailArray);
  }

  private getQuestsDetailsRecursive(i) {
    this.getQuestDetail(this.questListArray[i].id).then((questDetail) => {
      this.questDetailArray.push(questDetail);
      this.getQuestRewards(this.questListArray[i].id).then((questReward) => {
        this.questDetailArray[i].rewards = questReward;
        this.getQuestSteps(this.questListArray[i].id).then((questStep) => {
          this.questDetailArray[i].steps = questStep;
          console.log(this.questDetailArray[i]);
          if (i < this.questListArray.length - 1) this.getQuestsDetailsRecursive(i + 1);
          else {
            this.loading.dismiss();
            this.loading = null;
            if (this.upload) {
              this.questsDetailToFirebase();
              this.upload = false;
              console.log("uploading");
            }
          }
        })
      })
    })
  }

  private getQuestDetail(id) {
    return this.restapi.getQuestDetails(id).then(data => {
      return this.detailTableToJSON(this.getTableContents(data._body));
    });
  }

  private getQuestSteps(id) {
    return this.restapi.getQuestSteps(id).then(data => {
      return this.stepsTableToJSON(this.getTableContents(data._body));
    });
  }
  private getQuestRewards(id) {
    return this.restapi.getQuestRewards(id).then(data => {
      return this.rewardsTableToJSON(this.getTableContents(data._body));
    });
  }

  private detailTableToJSON(table) {
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

  private stepsTableToJSON(table) {
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

  private rewardsTableToJSON(table) {
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
      if (reward.type == "Experience") icon = "/esoui/art/icons/icon_experience.png";
      else if (reward.type == "Money") icon = "/esoui/art/icons/item_generic_coinbag.png";
      else if (reward.type == "Alliance Points") icon = "/esoui/art/icons/icon_alliancepoints.png";
      else if (reward.type == "Inspiration") icon = "/esoui/art/icons/crafting_inspiration_logo.png";
      else if (reward.type == "Writ Vouchers") icon = "/esoui/art/icons/icon_writvoucher.png";
      if (icon != "") icon = icon.replace(".dds", ".png");
      reward.icon = icon;

      rewards.push(reward);
    }
    return rewards;
  }

  // ---------------------------------- QUEST LIST METHODS ---------------------------------------
  fetchQuestList() {
    this.configureLoadingDefault();
    this.loading.present().then(() => {
      this.getQuestList(0);
    });
  }

  questListToFirebase() {
    if (this.questListArray.length == 0) {
      alert('Fetch quest list first');
      return;
    }
    this.configureLoadingDefault();
    this.loading.present().then(() => {
      this.firebaseQuestListArray = this.db.list('/quests');
      this.uploadQuestList(0);
    });
  }

  uploadQuestList(i) {
    this.firebaseQuestListArray.update(this.questListArray[i].id + "", this.questListArray[i])
      .then(() => {
        if (i == this.questListArray.length - 1) {
          this.loading.dismiss();
          this.loading = null;
          return;
        } else {
          console.log(`push quest: ${this.questListArray[i].name} to firebase successfull`);
          this.uploadQuestList(i + 1);
        }
      }).catch((err) => {
        if (i == this.questListArray.length - 1) {
          this.loading.dismiss();
          this.loading = null;
          return;
        } else {
          console.log(`error to push to firebase: ${err}`);
          this.uploadQuestList(i + 1);
        }
      });
  }

  logQuestList() {
    if (this.questListArray.length == 0) {
      alert('Fetch quest list first');
      return;
    }
    console.log(this.questListArray);
  }

  private getQuestList(questValue) {
    return this.restapi.getQuests(questValue).then(data => {
      return this.questListTableToJSON(this.getTableContents(data._body), questValue);
    });
  }

  private questListTableToJSON(table, questValue) {
    let rows = table.rows;
    for (let i = 1; i < rows.length; i++) {
      let quest = new QuestItem();
      quest.id = rows[i].cells[1].textContent;
      quest.zone = rows[i].cells[2].textContent;
      quest.name = rows[i].cells[3].textContent;
      quest.level = rows[i].cells[4].textContent;
      this.questListArray.push(quest);
    }

    if (rows.length == 301) {
      questValue += 300;
      this.getQuestList(questValue);
    } else {
      this.loading.dismiss();
      this.loading = null;
    }
  }

  // --------------------------------------------- UTILS ---------------------------------------------

  private getTableContents(table: string): any {
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

  private configureLoadingDefault() {
    if (this.loading == null)
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
  }

}
