import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

enum AudioTypes  {
  HTML_5 = 'html5',
  NATIVE = 'native'
}

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  audioType: string;
  sounds: any = [];

  constructor(public nativeAudio: NativeAudio, platform: Platform) {
    this.audioType = platform.is('cordova') ? AudioTypes.NATIVE : AudioTypes.HTML_5;
  }

  preload(key, asset) {
    if (this.audioType === AudioTypes.HTML_5) {
      const audio = {
        key,
        asset
      };
      this.sounds.push(audio);
    } else {

      this.nativeAudio.preloadSimple(key, asset);
      const audio = {
        key,
        asset: key
      };
      this.sounds.push(audio);
    }
  }

  play(key) {

    const audio = this.sounds.find((sound) => {
      return sound.key === key;
    });

    if (this.audioType === AudioTypes.HTML_5) {

      const audioAsset = new Audio(audio.asset);
      audioAsset.play();

    } else {
      this.nativeAudio.play(audio.asset);
    }
  }
}
