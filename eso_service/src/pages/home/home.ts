import { Component } from '@angular/core';
import { NavController, LoadingController, Loading } from 'ionic-angular';
import { RestapiProvider } from '../../providers/restapi/restapi';
import { QuestDetail, QuestItem, Rewards, Steps } from '../../model/quest';
import { ItemSummary, SetSummary } from '../../model/set';
import { Skill, SkillItem } from '../../model/skill';
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
  setSummariesArray: Array<SetSummary>;
  firebaseSetSummariesArray: FirebaseListObservable<any[]>;
  itemSummariesArray: Array<Array<ItemSummary>>;
  firebaseItemSummariesArray: FirebaseListObservable<any[]>;
  skillsArray: Array<Skill>;
  firebaseSkillsArray: FirebaseListObservable<any[]>;
  skillListArray: Array<SkillItem>;
  firebaseSkillListArray: FirebaseListObservable<any[]>;
  loading: Loading;
  upload: boolean = false;

  constructor(public navCtrl: NavController, public restapi: RestapiProvider,
    public loadingCtrl: LoadingController, public db: AngularFireDatabase) {
    this.questListArray = new Array<QuestItem>();
    this.questDetailArray = new Array<QuestDetail>();
    this.setSummariesArray = new Array<SetSummary>();
    this.itemSummariesArray = new Array<Array<ItemSummary>>();
    this.skillsArray = new Array<Skill>();
    this.skillListArray = new Array<SkillItem>();
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
      this.firebaseQuestDetailArray.remove().then(() => {
        this.firebaseQuestDetailArray = this.db.list('/quests-detail');
        this.uploadQuestsDetail(0);
      })

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
        console.log(`error to push to firebase: ${err}`);
        this.uploadQuestList(i);
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


  // ------------------------------------------ SET SUMMARY -------------------------------------------

  fetchSetSummaries() {
    this.configureLoadingDefault();
    this.loading.present().then(() => {
      this.restapi.getSetSummaries().then(data => {
        this.setSummariesTableToJSON(this.getTableContents(data._body));
      });
    });
  }

  setSummariesToFirebase() {
    if (this.setSummariesArray.length == 0) {
      alert('Fetch setSummariesArray first');
      return;
    }
    this.configureLoadingDefault();
    this.loading.present().then(() => {
      this.firebaseSetSummariesArray = this.db.list('/set-summary');
      this.uploadSetSummaries(0);
    });
  }

  uploadSetSummaries(i) {
    this.firebaseSetSummariesArray.update(this.setSummariesArray[i].id + "", this.setSummariesArray[i])
      .then(() => {
        if (i == this.setSummariesArray.length - 1) {
          this.loading.dismiss();
          this.loading = null;
          return;
        } else {
          console.log(`push set summary: ${this.setSummariesArray[i].name} to firebase successfull`);
          this.uploadSetSummaries(i + 1);
        }
      }).catch((err) => {
        console.log(`error to push to firebase: ${err}`);
        this.uploadSetSummaries(i);
      });
  }

  logSetSummaries() {
    if (this.setSummariesArray.length == 0) {
      alert('Fetch setSummariesArray first');
      return;
    }
    console.log(this.setSummariesArray);
  }

  setSummariesTableToJSON(table) {
    let rows = table.rows;
    for (let i = 1; i < rows.length; i++) {
      let setSummary = new SetSummary();
      setSummary.id = rows[i].cells[1].textContent;
      setSummary.name = rows[i].cells[2].textContent;
      setSummary.maxEquipCount = rows[i].cells[3].textContent;
      setSummary.bonusCount = rows[i].cells[4].textContent;
      setSummary.bonusDesc = rows[i].cells[5].textContent;
      setSummary.itemSlots = rows[i].cells[6].textContent;
      setSummary.itemCount = rows[i].cells[7].textContent;
      setSummary.bonusDesc1 = rows[i].cells[8].textContent;
      setSummary.bonusDesc2 = rows[i].cells[9].textContent;
      setSummary.bonusDesc3 = rows[i].cells[10].textContent;
      setSummary.bonusDesc4 = rows[i].cells[11].textContent;
      setSummary.bonusDesc5 = rows[i].cells[12].textContent;
      this.setSummariesArray.push(setSummary);
    }
    this.loading.dismiss();
    this.loading = null;
  }

  // ----------------------------------------- ITEM SUMMARY & DATA TABLE ---------------------------------
  fetchItemSummaries() {
    if (this.setSummariesArray.length == 0) {
      alert('Fetch setSummariesArray first');
      return;
    }
    this.configureLoadingDefault();
    this.loading.present().then(() => {
      this.getItemSummariesPerSet(0);
    });
  }

  getItemSummariesPerSet(index) {
    let summaryArray = new Array<ItemSummary>();
    this.getItemSummaries(index, 0, summaryArray).then(() => {
      if (index < this.setSummariesArray.length - 1) this.getItemSummariesPerSet(index + 1);
      else {
        console.log(this.setSummariesArray);
        //this.getDataTable(0, 0);
        this.loading.dismiss();
        this.loading = null;
        return;
      }
    });
  }

  getItemSummaries(i, itemCount, summaryArray) {
    return this.restapi.getMinedItemSummaries(this.setSummariesArray[i].name, itemCount).then(data => {
      return this.minedItemSummariesTableToJSON(this.getTableContents(data._body), itemCount, i, summaryArray);
    });
  }

  private minedItemSummariesTableToJSON(table, itemCount, index, summaryArray) {
    let rows = table.rows;
    for (let i = 1; i < rows.length; i++) {
      let itemSummary = new ItemSummary();
      itemSummary.id = rows[i].cells[1].textContent;
      itemSummary.itemId = rows[i].cells[2].textContent;
      itemSummary.name = rows[i].cells[3].textContent;
      itemSummary.icon = rows[i].cells[4].textContent;
      itemSummary.description = rows[i].cells[5].textContent;
      itemSummary.style = rows[i].cells[8].textContent;
      itemSummary.trait = rows[i].cells[9].textContent;
      itemSummary.value = rows[i].cells[10].textContent;
      itemSummary.level = rows[i].cells[11].textContent;
      itemSummary.quality = rows[i].cells[12].textContent;
      itemSummary.type = rows[i].cells[13].textContent;
      itemSummary.specialType = rows[i].cells[14].textContent;
      itemSummary.equipType = rows[i].cells[15].textContent;
      itemSummary.weaponType = rows[i].cells[16].textContent;
      itemSummary.armorType = rows[i].cells[17].textContent;
      itemSummary.craftType = rows[i].cells[18].textContent;
      itemSummary.armorRating = rows[i].cells[19].textContent;
      itemSummary.weaponPower = rows[i].cells[20].textContent;
      itemSummary.enchantName = rows[i].cells[21].textContent;
      itemSummary.enchantDesc = rows[i].cells[22].textContent;
      itemSummary.abilityName = rows[i].cells[23].textContent;
      itemSummary.abilityDesc = rows[i].cells[24].textContent;
      itemSummary.setName = rows[i].cells[25].textContent;
      itemSummary.setBonusDesc1 = rows[i].cells[26].textContent;
      itemSummary.setBonusDesc2 = rows[i].cells[27].textContent;
      itemSummary.setBonusDesc3 = rows[i].cells[28].textContent;
      itemSummary.setBonusDesc4 = rows[i].cells[29].textContent;
      itemSummary.setBonusDesc5 = rows[i].cells[30].textContent;
      itemSummary.bindType = rows[i].cells[31].textContent;
      itemSummary.traitDesc = rows[i].cells[32].textContent;
      itemSummary.traitAbilityDesc = rows[i].cells[33].textContent;

      itemSummary.setId = this.setSummariesArray[index].id;
      summaryArray.push(itemSummary);
    }
    if (rows.length == 301) this.getItemSummaries(index, itemCount + 300, summaryArray);
    else this.itemSummariesArray.push(summaryArray);
  }

  itemSummariesToFirebase() {
    if (this.itemSummariesArray.length == 0) {
      alert('Fetch itemSummariesArray first');
      return;
    }
    this.configureLoadingDefault();
    this.loading.present().then(() => {
      this.uploadItemSummariesPerSet(0);
    });
  }

  uploadItemSummariesPerSet(i) {
    if (i < this.setSummariesArray.length - 1) {
      //this.dataTableToFirebase();
      this.firebaseItemSummariesArray = this.db.list(`/item-summary/${this.setSummariesArray[i].id}`);
      this.uploadItemSummaries(i, 0);
      return;
    } else {
      this.loading.dismiss();
      this.loading = null;
    }
  }

  uploadItemSummaries(i, j) {
    this.firebaseItemSummariesArray.update(this.itemSummariesArray[i][j].itemId + "", this.itemSummariesArray[i][j])
      .then(() => {
        if (j == this.itemSummariesArray[i].length - 1) {
          this.uploadItemSummariesPerSet(i + 1);
        } else {
          console.log(`push item summary: ${this.itemSummariesArray[i][j].name} to firebase successfull`);
          this.uploadItemSummaries(i, j + 1);
        }
      }).catch((err) => {
        console.log(`error to push to firebase: ${err}`);
        this.uploadItemSummaries(i, j);
      });
  }

  logItemSummaries() {
    if (this.itemSummariesArray.length == 0) {
      alert('Fetch itemSummariesArray first');
      return;
    }
    console.log("ITEM SUMMARY");
    console.log(this.itemSummariesArray);
  }

  // ---------------------------------------- SKILL DETAIL ----------------------------------------------------------
  fetchSkills() {
    this.configureLoadingDefault();
    this.loading.present().then(() => {
      this.getSkillsDetail(0);
    });
  }

  skillsDetailToFirebase() {
    if (this.skillsArray.length == 0) {
      alert('Fetch skillsArray first');
      return;
    }
    this.configureLoadingDefault();
    this.loading.present().then(() => {
      this.firebaseSkillsArray = this.db.list('/skills-detail');
      this.uploadSkillsDetail(0);
    });
  }

  uploadSkillsDetail(i) {
    this.firebaseSkillsArray.update(`${this.skillsArray[i].baseName}/${this.skillsArray[i].abilityId}`, this.skillsArray[i])
      .then(() => {
        if (i == this.skillsArray.length - 1) {
          this.loading.dismiss();
          this.loading = null;
          return;
        } else {
          console.log(`push skill: ${this.skillsArray[i].name} to firebase successfull`);
          this.uploadSkillsDetail(i + 1);
        }
      }).catch((err) => {
        console.log(`error to push to firebase: ${err}`);
        this.uploadSkillsDetail(i);
      });
  }

  logSkillsDetail() {
    if (this.skillsArray.length == 0) {
      alert('Fetch skillsArray first');
      return;
    }
    console.log(this.skillsArray);
  }

  private getSkillsDetail(skillValue) {
    return this.restapi.getSkills(skillValue).then(data => {
      return this.skillListTableToJSON(this.getTableContents(data._body), skillValue);
    });
  }

  private skillListTableToJSON(table, skillValue) {
    let rows = table.rows;
    for (let i = 1; i < rows.length; i++) {
      let skill = new Skill();
      skill.id = rows[i].cells[1].textContent;
      skill.abilityId = rows[i].cells[2].textContent;
      try {
        let iconInfo: string = rows[i].cells[3].innerHTML;
        iconInfo = iconInfo.split('title="')[1].split(".dds")[0];
        skill.icon = iconInfo + ".png";
      } catch (err) {
        skill.icon = "";
        console.log(err);
      }

      try {
        let skillInfo: string = rows[i].cells[4].textContent;
        let skillInfoArray = skillInfo.split("::");
        if (skillInfoArray.length == 1) {
          skillInfoArray = skillInfo.split(":");
        }
        skill.className = skillInfoArray[0];
        skill.skillLineName = skillInfoArray[1];
      } catch (err) {
        console.log(err);
      }
      skill.baseName = rows[i].cells[5].textContent;
      skill.name = rows[i].cells[6].textContent;
      skill.learnedLevel = rows[i].cells[7].textContent;
      skill.rank = rows[i].cells[8].textContent;
      skill.maxRank = rows[i].cells[9].textContent;
      skill.type = rows[i].cells[10].textContent;
      skill.cost = rows[i].cells[11].textContent;
      skill.skillIndex = rows[i].cells[12].textContent;
      skill.description = rows[i].cells[13].textContent;
      this.skillsArray.push(skill);
    }

    if (rows.length == 301) {
      skillValue += 300;
      this.getSkillsDetail(skillValue);
    } else {
      this.loading.dismiss();
      this.loading = null;
    }
  }
  // ------------------------------------------ SKILL LIST -------------------------------------------

  fetchSkillList() {
    this.configureLoadingDefault();
    this.loading.present().then(() => {
      this.getSkillList(0);
    });
  }

  getSkillList(skillValue) {
    return this.restapi.getSkills(skillValue).then(data => {
      return this.skillListTableToJSONSimplified(this.getTableContents(data._body), skillValue);
    });
  }

  private skillListTableToJSONSimplified(table, skillValue) {
    let rows = table.rows;
    for (let i = 1; i < rows.length; i++) {
      let skill = new SkillItem();
      let breakLoop = false;

      skill.name = rows[i].cells[5].textContent;
      for (let j = 0; j < this.skillListArray.length; j++) {
        if (this.skillListArray[j].name == skill.name) {
          breakLoop = true;
          break;
        }
      }
      if (breakLoop) continue;

      skill.abilityId = rows[i].cells[2].textContent;
      skill.description = rows[i].cells[13].textContent;
      try {
        let iconInfo: string = rows[i].cells[3].innerHTML;
        iconInfo = iconInfo.split('title="')[1].split(".dds")[0];
        skill.icon = iconInfo + ".png";
      } catch (err) {
        skill.icon = "";
        console.log(err);
      }
      try {

        let skillInfo: string = rows[i].cells[4].textContent;
        let skillInfoArray = skillInfo.split("::");
        if (skillInfoArray.length == 1) {
          skillInfoArray = skillInfo.split(":");
        }
        skill.className = skillInfoArray[0];
        skill.skillLineName = skillInfoArray[1];
      } catch (err) {
        console.log(err);
      }
      this.skillListArray.push(skill);
    }

    if (rows.length == 301) {
      skillValue += 300;
      this.getSkillList(skillValue);
    } else {
      this.loading.dismiss();
      this.loading = null;
    }
  }

  skillListToFirebase() {
    if (this.skillListArray.length == 0) {
      alert('Fetch skillListArray first');
      return;
    }
    this.configureLoadingDefault();
    this.loading.present().then(() => {
      this.firebaseSkillListArray = this.db.list('/skill-list');
      this.uploadSkillList(0);
    });
  }

  uploadSkillList(i) {
    this.firebaseSkillListArray.update(`${this.skillListArray[i].name}`, this.skillListArray[i])
      .then(() => {
        if (i == this.skillListArray.length - 1) {
          this.loading.dismiss();
          this.loading = null;
          return;
        } else {
          console.log(`push skill: ${this.skillListArray[i].name} to firebase successfull`);
          this.uploadSkillList(i + 1);
        }
      }).catch((err) => {
        console.log(`error to push to firebase: ${err}`);
        this.uploadSkillList(i);
      });
  }

  logSkillList() {
    if (this.skillListArray.length == 0) {
      alert('Fetch skillListArray first');
      return;
    }
    console.log(this.skillListArray);
  }

  // --------------------------------------------- UTILS ---------------------------------------------

  private getTableContents(table: string): any {
    let firstSplit;
    if (table.includes("<table border='1' cellspacing='0' cellpadding='2'>"))
      firstSplit = table.split("<table border='1' cellspacing='0' cellpadding='2'>");
    else if (table.includes("<table border='1' cellpadding='0' cellspacing='0' class='esodmi_table'>"))
      firstSplit = table.split("<table border='1' cellpadding='0' cellspacing='0' class='esodmi_table'>");
    else if (table.includes('<table id="esoil_rawdatatable" cellpadding="0" cellspacing="0" border="0">'))
      firstSplit = table.split('<table id="esoil_rawdatatable" cellpadding="0" cellspacing="0" border="0">');
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
