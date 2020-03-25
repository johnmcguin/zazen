import { Component, ChangeDetectorRef, OnInit } from '@angular/core';

import { SoundService } from '../../services/sound.service';

interface ISound {
  name: string;
  id: string;
  path: string;
  checked: boolean;
}

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage implements OnInit {
  sounds: ISound[];
  constructor(private soundService: SoundService, private cdr: ChangeDetectorRef) { }


  async ngOnInit() {
    // determine if there is a setting saved for this. checked should be set by default based on saved config
    this.sounds = [
      {
        name: 'Tibetan Bowl - Soft Mallet',
        id: 'sound1',
        path: 'tibetan_bowl_soft_mallet.mp3',
        checked: false
      },
      {
        name: 'Singing Bowl - Crystal Wand',
        id: 'sound2',
        path: 'crystal_wand_on_singing_bowl.mp3',
        checked: false
      },
      {
        name: 'Singing Bowl - Wine Cork Mallet',
        id: 'sound3',
        path: 'wine_cork_mallet_dinging_on_singing_bowl_long_hold.mp3',
        checked: false
      },
      {
        name: 'Prayer Bowl',
        id: 'sound4',
        path: 'Prayer_Bowl_4.mp3',
        checked: false
      },
      {
        name: 'Prayer Bowl 2',
        id: 'sound5',
        path: 'Prayer_Bowl_5.mp3',
        checked: false
      },
    ];

    this.sounds.forEach(sound => this.soundService.preload(sound.id, sound.path));
  }

  soundSelected($event) {
    const { detail } = $event;
    const sound = detail.value;
    this.soundService.play(sound.id);
  }
}
