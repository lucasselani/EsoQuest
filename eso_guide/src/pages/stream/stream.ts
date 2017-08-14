import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AdMobPro } from '@ionic-native/admob-pro';
import { AutoCompleteProvider } from '../../providers/auto-complete/auto-complete';
import { AutoCompleteComponent } from 'ionic2-auto-complete';
import { RestapiProvider } from '../../providers/restapi/restapi';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-stream',
  templateUrl: 'stream.html',
})
export class StreamPage {
  @ViewChild('searchbar')
  searchbar: AutoCompleteComponent;
  loading: boolean = false;
  streams;
  allStreams;
  pageName: string = "Streams";
  admobid = {
    banner: 'ca-app-pub-8213289176081397/8308163618',
    interstitial: 'ca-app-pub-8213289176081397/6078065024'
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public restapi: RestapiProvider,
    public admob: AdMobPro, public autoComplete: AutoCompleteProvider, public iab: InAppBrowser) {
    this.getListOfStreams();
  }

  getListOfStreams() {
    this.loading = true;
    this.restapi.getListOfStreams().then(data => {
      this.allStreams = data.streams;
      this.streams = data.streams;
      let channels = [];
      for (let i = 0; i < this.streams.length; i++) {
        channels.push(this.streams[i].channel);
        if (i == this.streams.length - 1) {
          this.autoComplete.setDataProvider(channels, "display_name", "includesKeyword");
        }
      }
      this.loading = false;
      console.log(this.streams);
    });
  }

  openItem() {
    let title = this.searchbar.getValue();
    this.searchbar.clearValue();
    this.streams.forEach(item => {
      if (item.channel.display_name == title) this.openStream(item.channel.url);
    });
  }

  searchItems() {
    let keyword = this.searchbar.keyword;
    if (keyword == "") {
      this.pageName = "Streams";
      this.streams = this.allStreams;
      return;
    } else if (keyword.trim() == "") return;

    keyword = keyword.trim();
    let results = [];
    this.allStreams.forEach(item => {
      if (item.channel.display_name
        .toLocaleLowerCase()
        .includes(keyword.toLocaleLowerCase())) results.push(item);
    });

    if (results.length == 0) {
      alert("No results found.");
      this.searchbar.clearValue();
    } else {
      this.pageName = `Search for "${keyword}"`;
      this.streams = results;
    }
  }

  public openStream(url: string) {
    this.iab.create(url, '_system');
  }

  prepareAdMob() {
    this.admob.createBanner({
      adId: this.admobid.banner,
      position: this.admob.AD_POSITION.BOTTOM_CENTER,
      autoShow: true,
      isTesting: true
    });
  }

}
