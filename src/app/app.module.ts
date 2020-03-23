import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SessionsService } from './repos/sessions.service';
import { SoundService } from './services/sound.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    SessionsService,
    StatusBar,
    SplashScreen,
    NativeAudio,
    SoundService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
