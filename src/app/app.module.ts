import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { RestapiProvider } from '../providers/restapi/restapi';
import { AutoCompleteModule } from 'ionic2-auto-complete';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { QuestlistPage } from '../pages/questlist/questlist';
import { QuestDetailPage } from '../pages/quest-detail/quest-detail';
import { AutoCompleteProvider } from '../providers/auto-complete/auto-complete';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    QuestlistPage,
    QuestDetailPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AutoCompleteModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    QuestlistPage,
    QuestDetailPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    RestapiProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AutoCompleteProvider
  ]
})
export class AppModule {}
