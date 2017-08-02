import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { RestapiProvider } from '../providers/restapi/restapi';
import { AutoCompleteModule } from 'ionic2-auto-complete';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseProvider } from 'angularfire2/database';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { StreamPage } from '../pages/stream/stream';
import { QuestlistPage } from '../pages/questlist/questlist';
import { QuestDetailPage } from '../pages/quest-detail/quest-detail';
import { AutoCompleteProvider } from '../providers/auto-complete/auto-complete';
import { SQLite } from '@ionic-native/sqlite';
import { SqliteProvider } from '../providers/sqlite/sqlite';
import { AdMobPro } from '@ionic-native/admob-pro';
import { FeedProvider } from '../providers/feed/feed';
import { IonicStorageModule } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { DataCentralProvider } from '../providers/data-central/data-central';

export const firebaseConfig = {
  apiKey: "AIzaSyAlmo_lK-gusHW-PSVnNSP5eUZC-4U7Wbs",
  authDomain: "eso-guide.firebaseapp.com",
  databaseURL: "https://eso-guide.firebaseio.com",
  projectId: "eso-guide",
  storageBucket: "",
  messagingSenderId: "546420797302"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    QuestlistPage,
    QuestDetailPage,
    StreamPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AutoCompleteModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    QuestlistPage,
    QuestDetailPage,
    StreamPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    RestapiProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AutoCompleteProvider,
    SQLite,
    SqliteProvider,
    AdMobPro,
    FeedProvider,
    InAppBrowser,
    DataCentralProvider,
    AngularFireDatabaseProvider
  ]
})
export class AppModule { }
