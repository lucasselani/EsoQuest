import { Component } from '@angular/core';
import { NavController, LoadingController, Loading } from 'ionic-angular';
import { RestapiProvider } from '../../providers/restapi/restapi';
import { QuestDetail, QuestItem, Rewards, Steps } from '../../model/quest';
import { DataTable, ItemSummary, SetSummary } from '../../model/set';
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
  dataTableArray: Array<Array<DataTable>>;
  firebaseDataTableArray: FirebaseListObservable<any[]>;
  loading: Loading;
  upload: boolean = false;

  constructor(public navCtrl: NavController, public restapi: RestapiProvider,
    public loadingCtrl: LoadingController, public db: AngularFireDatabase) {
    this.questListArray = new Array<QuestItem>();
    this.questDetailArray = new Array<QuestDetail>();
    this.setSummariesArray = new Array<SetSummary>();
    this.itemSummariesArray = new Array<Array<ItemSummary>>();
    this.dataTableArray = new Array<Array<DataTable>>();
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
        if (i == this.setSummariesArray.length - 1) {
          this.loading.dismiss();
          this.loading = null;
          return;
        } else {
          console.log(`error to push to firebase: ${err}`);
          this.uploadSetSummaries(i + 1);
        }
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
        this.getDataTable(0, 0);
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
      itemSummary.type = rows[i].cells[13].textContent;
      itemSummary.specialType = rows[i].cells[14].textContent;
      itemSummary.equipType = rows[i].cells[15].textContent;
      itemSummary.weaponType = rows[i].cells[16].textContent;
      itemSummary.armorType = rows[i].cells[17].textContent;
      itemSummary.craftType = rows[i].cells[18].textContent;
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
      this.dataTableToFirebase();
    } else {
      this.firebaseItemSummariesArray = this.db.list(`/item-summary/${this.setSummariesArray[i].id}`);
      this.uploadItemSummaries(i, 0);
    }
  }

  uploadItemSummaries(i, j) {
    this.firebaseItemSummariesArray.update(this.itemSummariesArray[i][j].id + "", this.itemSummariesArray[i][j])
      .then(() => {
        if (j == this.itemSummariesArray[i].length - 1) {
          this.uploadItemSummariesPerSet(i + 1);
        } else {
          console.log(`push item summary: ${this.itemSummariesArray[i][j].name} to firebase successfull`);
          this.uploadItemSummaries(i, j + 1);
        }
      }).catch((err) => {
        if (j == this.itemSummariesArray[i].length - 1) {
          this.uploadItemSummariesPerSet(i + 1);
        } else {
          console.log(`error to push to firebase: ${err}`);
          this.uploadItemSummaries(i, j + 1);
        }
      });
  }

  logItemSummaries() {
    if (this.itemSummariesArray.length == 0) {
      alert('Fetch itemSummariesArray first');
      return;
    }
    console.log("ITEM SUMMARY");
    console.log(this.itemSummariesArray);
    this.logDataTable();
  }

  getDataTable(setIndex, itemIndex) {
    return this.restapi.getDataTable(this.itemSummariesArray[setIndex][itemIndex].itemId).then(data => {
      if (setIndex < this.itemSummariesArray.length - 1)
        this.dataTableTableToJSON(this.getTableContents(data._body), setIndex, itemIndex);
      else {
        this.loading.dismiss();
        this.loading = null;
        return;
      };
    });
  }

  dataTableTableToJSON(table, setIndex, itemIndex) {
    let rows = table.rows;
    let dataTableArray = new Array<DataTable>();
    for (let i = 1; i < rows.length; i++) {
      let dataTable = new DataTable();
      let cellValue: number = 6;
      try {
        if (this.itemSummariesArray[setIndex][itemIndex].specialType == "Armor" ||
          this.itemSummariesArray[setIndex][itemIndex].weaponType == "Shield") {
          dataTable.armorRating = rows[i].cells[3].textContent;
          dataTable.enchantName = rows[i].cells[4].textContent;
          dataTable.enchantDesc = rows[i].cells[5].textContent;
        } else if (this.itemSummariesArray[setIndex][itemIndex].specialType == "Weapon") {
          dataTable.weaponPower = rows[i].cells[3].textContent;
          dataTable.enchantDesc = rows[i].cells[4].textContent;
          dataTable.maxCharges = rows[i].cells[5].textContent;
        } else if (this.itemSummariesArray[setIndex][itemIndex].specialType == "Container") {
          dataTable.weaponPower = rows[i].cells[3].textContent;
          dataTable.armorRating = rows[i].cells[4].textContent;
          dataTable.maxCharges = rows[i].cells[5].textContent;
        } else if (this.itemSummariesArray[setIndex][itemIndex].equipType == "Ring" ||
          this.itemSummariesArray[setIndex][itemIndex].equipType == "Neck") {
          dataTable.enchantName = rows[i].cells[3].textContent;
          dataTable.enchantDesc = rows[i].cells[4].textContent;
          cellValue--;
        } else continue;

        dataTable.itemId = this.itemSummariesArray[setIndex][itemIndex].itemId;
        dataTable.level = rows[i].cells[0].textContent;
        dataTable.quality = rows[i].cells[1].textContent;
        dataTable.value = rows[i].cells[2].textContent;

        dataTable.traitDesc = rows[i].cells[cellValue++].textContent;
        dataTable.setBonusDesc1 = rows[i].cells[cellValue++].textContent;
        dataTable.setBonusDesc2 = rows[i].cells[cellValue++].textContent;
        dataTable.setBonusDesc3 = rows[i].cells[cellValue++].textContent;
        dataTable.setBonusDesc4 = rows[i].cells[cellValue++].textContent;
        dataTable.internalLevel = rows[i].cells[cellValue++].textContent;
        dataTable.internalSubtype = rows[i].cells[cellValue++].textContent;
      } catch (err) {
        console.log("error: " + err);
        console.log("row: " + rows[i]);

      } finally {
        dataTableArray.push(dataTable);
      }
    }
    this.dataTableArray.push(dataTableArray);
    if (itemIndex < this.itemSummariesArray[setIndex].length - 1) this.getDataTable(setIndex, itemIndex + 1);
    else this.getDataTable(setIndex + 1, 0);
  }

  dataTableToFirebase() {
    if (this.dataTableArray.length == 0) {
      alert('Fetch dataTableArray first');
      return;
    }
    this.uploadItemSummariesPerItem(0, 0);
  }

  uploadItemSummariesPerItem(itemIndex, itemValue) {
    if (itemIndex < this.dataTableArray.length - 1) {
      this.loading.dismiss();
      this.loading = null;
    } else {
      this.firebaseItemSummariesArray = this.db.list(`/data-table/`);
      this.firebaseItemSummariesArray.update(`${this.dataTableArray[itemIndex][itemValue].itemId}` + "", this.dataTableArray[itemIndex][itemValue])
        .then(() => {
          if (itemValue == this.dataTableArray[itemIndex].length - 1) {
            this.uploadItemSummariesPerItem(itemIndex + 1, 0);
          } else {
            console.log(`push data table: ${this.dataTableArray[itemIndex][itemValue].itemId} to firebase successfull`);
            this.uploadItemSummariesPerItem(itemIndex, itemValue + 1);
          }
        }).catch((err) => {
          if (itemValue == this.dataTableArray[itemIndex].length - 1) {
            this.uploadItemSummariesPerItem(itemIndex + 1, 0);
          } else {
            console.log(`error to push to firebase: ${err}`);
            this.uploadItemSummariesPerItem(itemIndex, itemValue + 1);
          }
        });
    }
  }

  logDataTable() {
    if (this.dataTableArray.length == 0) {
      alert('Fetch dataTableArray first');
      return;
    }
    console.log("DATA TABLE");
    console.log(this.dataTableArray);
  }


  // --------------------------------------------- UTILS ---------------------------------------------

  private getTableContents(table: string): any {
    let firstSplit;
    if (table.includes("<table border='1' cellspacing='0' cellpadding='2'>"))
      firstSplit = table.split("<table border='1' cellspacing='0' cellpadding='2'>");
    else if (table.includes("<table border='1' cellpadding='0' cellspacing='0' class='esodmi_table'>"))
      firstSplit = table.split("<table border='1' cellpadding='0' cellspacing='0' class='esodmi_table'>");
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
