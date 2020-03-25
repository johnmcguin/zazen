import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ISound } from './types';
import { SoundService } from './services/sound.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  sounds: ISound[];
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private soundService: SoundService
  ) {
    this.initializeApp();
  }

  initializeApp() {

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    this.sounds = [
      {
        name: 'Tibetan Bowl - Soft Mallet',
        id: 'sound1',
        path: 'tibetan_bowl_soft_mallet.mp3'
      },
      {
        name: 'Singing Bowl - Crystal Wand',
        id: 'sound2',
        path: 'crystal_wand_on_singing_bowl.mp3'
      },
      {
        name: 'Singing Bowl - Wine Cork Mallet',
        id: 'sound3',
        path: 'wine_cork_mallet_dinging_on_singing_bowl_long_hold.mp3'
      },
      {
        name: 'Prayer Bowl',
        id: 'sound4',
        path: 'Prayer_Bowl_4.mp3'
      },
      {
        name: 'Prayer Bowl 2',
        id: 'sound5',
        path: 'Prayer_Bowl_5.mp3'
      },
    ];

    this.sounds.forEach(sound => this.soundService.preload(sound.id, sound.path));
  }
}
