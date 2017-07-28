import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RestapiProvider } from '../../providers/restapi/restapi';
import { QuestDetail, Rewards, Steps } from '../../model/questdetail';

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
  questId: number;
  quest: QuestDetail;

  constructor(public navCtrl: NavController, public navParams: NavParams, public restapi: RestapiProvider) {
    this.questId = navParams.data;
    this.quest = new QuestDetail();
    this.getQuestDetail();
    this.getQuestSteps();
    this.getQuestRewards();    
  }

  showLog(){
    console.log(this.quest);
  }

  getTableContents(table: string): any {  
      let firstSplit;
      if(table.includes("<table border='1' cellspacing='0' cellpadding='2'>")) firstSplit = table.split("<table border='1' cellspacing='0' cellpadding='2'>");
      else firstSplit = table.split("<table border='1' cellpadding='2' cellspacing='0'>");
      let secondSplit = firstSplit[1].split("</table>");

      let s = secondSplit[0];
      let temp = document.createElement('table');
      temp.innerHTML = s;
      //console.log(s);
      return temp;
  }

  getQuestDetail() {
    this.restapi.getQuestDetails(this.questId).then(data => {
      this.detailTableToJSON(this.getTableContents(data._body));
    });
  }
  
  getQuestSteps() {
    this.restapi.getQuestSteps(this.questId).then(data => {
      this.stepsTableToJSON(this.getTableContents(data._body));
    });
  }
    getQuestRewards() {
    this.restapi.getQuestRewards(this.questId).then(data => {
      this.rewardsTableToJSON(this.getTableContents(data._body));
    });
  }

  detailTableToJSON(table) {
    let rows = table.rows;    
    this.quest.id = rows[0].cells[1].textContent;
    this.quest.zone = rows[1].cells[1].textContent;
    this.quest.name = rows[2].cells[1].textContent;
    this.quest.level = rows[3].cells[1].textContent;
    this.quest.repeatType = rows[5].cells[1].textContent;
    this.quest.backgroundText = rows[7].cells[1].textContent;
    this.quest.goalText = rows[10].cells[1].textContent;
  }

  stepsTableToJSON(table) {
    let rows = table.rows;  
    this.quest.steps = new Array<Steps>();
    for(let i=1; i<rows.length; i++){
      let step: Steps = new Steps();
      step.id = rows[i].cells[1].textContent;
      step.zone = rows[i].cells[2].textContent;
      step.questid = rows[i].cells[5].textContent;
      step.uniqueid = rows[i].cells[6].textContent;
      step.stageIndex = rows[i].cells[7].textContent;
      step.stepIndex = rows[i].cells[8].textContent;
      step.text = rows[i].cells[9].textContent;
      step.overrideText = rows[i].cells[11].textContent;
      this.quest.steps.push(step);
    }

    this.quest.steps.sort((a,b) => {
      return a.stageIndex - b.stageIndex == 0 ? a.stepIndex - b.stepIndex : a.stageIndex - b.stageIndex;
    });
  }

  rewardsTableToJSON(table) {
    let rows = table.rows;  
    this.quest.rewards = new Array<Rewards>();
    for(let i=1; i<rows.length; i++){
      let reward: Rewards = new Rewards();
      reward.id = rows[i].cells[1].textContent;
      reward.type = rows[i].cells[5].textContent;
      reward.name = rows[i].cells[6].textContent;
      reward.quantity = rows[i].cells[7].textContent;
      reward.quality = rows[i].cells[9].textContent;
      this.quest.rewards.push(reward);
    }
  }

}
