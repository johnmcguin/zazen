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
  sounds = new Map();

  constructor(public nativeAudio: NativeAudio, platform: Platform) {
    this.audioType = platform.is('cordova') ? AudioTypes.NATIVE : AudioTypes.HTML_5;
  }

  preload(key, asset) {
    if (this.audioType === AudioTypes.HTML_5) {
      this.sounds.set(key, new Audio(asset));
    } else {
      this.nativeAudio.preloadSimple(key, asset);
    }
  }

  play(key) {
    if (this.audioType === AudioTypes.HTML_5) {
      const audio = this.sounds.get(key);
      audio.play();
    } else {
      this.nativeAudio.play(key);
    }
  }

  stop(key) {
    if (this.audioType === AudioTypes.HTML_5) {
      const audio = this.sounds.get(key);
      audio.pause();
      audio.currentTime = 0;
    } else {
      this.nativeAudio.stop(key);
    }
  }
}
