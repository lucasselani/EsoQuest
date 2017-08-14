import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AutoCompleteProvider } from '../../providers/auto-complete/auto-complete';
import { AutoCompleteComponent } from 'ionic2-auto-complete';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AdMobPro } from '@ionic-native/admob-pro';
import { FeedProvider, FeedItem } from '../../providers/feed/feed';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('searchbar')
  searchbar: AutoCompleteComponent;
  loading: boolean = false;
  pageName: string = "News";
  allArticles: Array<FeedItem>;
  articles: Array<FeedItem>;
  esoRssFeedUrl: string = "http://files.elderscrollsonline.com/rss/en-us/eso-rss.xml";
  admobid = {
    banner: 'ca-app-pub-8213289176081397/8308163618',
    interstitial: 'ca-app-pub-8213289176081397/6078065024'
  };

  constructor(public navCtrl: NavController, public autoComplete: AutoCompleteProvider,
    public splashScreen: SplashScreen, public admob: AdMobPro,
    public feedProvider: FeedProvider, public iab: InAppBrowser) {

    this.loadArticles()
    this.prepareAdMob();
  }

  openItem() {
    let title = this.searchbar.getValue();
    this.searchbar.clearValue();
    this.articles.forEach(item => {
      if (item.title == title) this.openArticle(item.link);
    });
  }

  searchItems() {
    let keyword = this.searchbar.keyword;
    if (keyword == "") {
      this.pageName = "News";
      this.articles = this.allArticles;
      return;
    } else if(keyword.trim() == "") return;

    keyword = keyword.trim();
    let results: Array<FeedItem> = new Array<FeedItem>();
    this.allArticles.forEach(item => {
      if (item.title.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())) results.push(item);
    });

    if (results.length == 0) {
      alert("No results found.");
      this.searchbar.clearValue();
    } else {
      this.pageName = `Search for "${keyword}"`;
      this.articles = results;
    }
  }

  prepareAdMob() {
    this.admob.createBanner({
      adId: this.admobid.banner,
      position: this.admob.AD_POSITION.BOTTOM_CENTER,
      autoShow: true,
      isTesting: true
    });
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.splashScreen.hide();
    }, 1000);
  }

  public openArticle(url: string) {
    this.iab.create(url, '_system');
  }

  loadArticles() {
    this.loading = true;
    this.feedProvider.getArticlesForUrl(this.esoRssFeedUrl).subscribe(res => {
      this.articles = res;
      this.allArticles = res;
      this.loading = false;
      this.autoComplete.setDataProvider(this.allArticles, "title", "includesKeyword");
    });
  }
}
