import { Component, OnInit } from '@angular/core';
import { SoundService } from '../../services/sound.service';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage implements OnInit {
  sounds;
  constructor(private soundService: SoundService) { }

  async ngOnInit() {
    this.sounds = [
      {
        name: 'Crystal Wand on Singing Bowl',
        id: 'sound1',
        path: '../../assets/sounds/crystal_wand_on_singing_bowl.mp3'
      }
    ];
  }

  playTest() {
    const testSound = this.sounds[0];
    this.soundService.preload(testSound.id, testSound.path);
    this.soundService.play(testSound.id);
  }

  //   this.nativeAudio.preloadSimple('uniqueId1', 'path/to/file.mp3').then(onSuccess, onError);
  // this.nativeAudio.preloadComplex('uniqueId2', 'path/to/file2.mp3', 1, 1, 0).then(onSuccess, onError);

  // this.nativeAudio.play('uniqueId1').then(onSuccess, onError);

  // // can optionally pass a callback to be called when the file is done playing
  // this.nativeAudio.play('uniqueId1', () => console.log('uniqueId1 is done playing'));

  // this.nativeAudio.loop('uniqueId2').then(onSuccess, onError);

  // this.nativeAudio.setVolumeForComplexAsset('uniqueId2', 0.6).then(onSuccess, onError);

  // this.nativeAudio.stop('uniqueId1').then(onSuccess, onError);

  // this.nativeAudio.unload('uniqueId1').then(onSuccess, onError);
}
