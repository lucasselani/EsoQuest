import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SkillItem } from '../../model/skill';

/**
 * Generated class for the SkillListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-skill-list',
  templateUrl: 'skill-list.html',
})
export class SkillListPage {
  public classList: Array<String>;
  public skillList: Array<SkillItem>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SkillListPage');
  }

}
