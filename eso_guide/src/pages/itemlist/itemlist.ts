import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ItemlistPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-itemlist',
  templateUrl: 'itemlist.html',
})
export class ItemlistPage {
  setId: number;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.setId = navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ItemlistPage');
  }

}

// https://www.djamware.com/post/5892739480aca7411808fa9c/how-to-create-ionic-2-accordion-list 
// USAR ESTE LINK PARA CRIAR A LIST EXPANDÍVEL
