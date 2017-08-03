import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { RestapiProvider } from '../providers/restapi/restapi';
import { AngularFireDatabaseProvider } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2'
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

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
    HomePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    RestapiProvider,
    AngularFireDatabaseProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
