import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { QuestItem } from '../../model/quest';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { commands } from './commands';

/*
  Generated class for the SqliteProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class SqliteProvider {
  database: SQLiteObject;

  constructor(public sqlite: SQLite, public plt: Platform) {
    console.log('creating sqlite');
    this.sqlite.create({
      name: 'quest.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      this.database = db;
      db.executeSql(commands.createTables, {})
        .then(() => console.log('Executed SQL'))
        .catch(e => console.log(e));
    }).catch(e => console.log(e));
  }

  public addAllQuests(quests: Array<QuestItem>) {
    console.log('inserting quests in db');
    let sqlCommand = commands.insertIntoQuests;
    quests.forEach(quest => {
      sqlCommand += ` (${quest.id}, "${quest.zone}", "${quest.name}", ${quest.level}),`;
    });
    sqlCommand = sqlCommand.slice(0, -1);
    this.database.executeSql(sqlCommand, [])
      .then((data) => {
        console.log("INSERTED: " + JSON.stringify(data));
      }, (error) => {
        console.log("ERROR: " + JSON.stringify(error));
      });
  }

  public getAllQuests(): Promise<any> {
    return new Promise(resolve => {
      this.database.executeSql(commands.selectAllQuests, []).then((data) => {
        if (data.rows.length > 0) {
          let quests: Array<QuestItem> = new Array<QuestItem>();
          for (let i = 0; i < data.rows.length; i++) {
            let quest: QuestItem = new QuestItem();
            quest.id = data.rows.item(i).id;
            quest.zone = data.rows.item(i).zone;
            quest.name = data.rows.item(i).name;
            quest.level = data.rows.item(i).level;
            quests.push(quest);
          }
          quests.sort(function (a, b) {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
          });
          resolve(quests);
        }        
      }).catch(error => {
        console.log(error);
      });
    })
  }
}
