import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { SoundService } from '../../services/sound.service';
import { SettingsService } from 'src/app/repos/settings.service';
import { from } from 'rxjs';
import { ISound } from 'src/app/types';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage implements OnInit {
  sounds: ISound[];
  settings$;
  settings;
  formState: FormGroup;
  formChanges$;
  constructor(private soundService: SoundService, private settingsRepo: SettingsService, private fb: FormBuilder) { }


  async ngOnInit() {
    this.settings$ = from(this.settingsRepo.getItems())
      .subscribe(settings => {
        this.settings = settings || {};
        const targetSound = this.settings && this.settings.preferredSound ? this.settings.preferredSound : 'sound1';
        const defaultSound = this.sounds.find(sound => sound.id === targetSound);
        this.formState = this.fb.group({
          preferredSound: defaultSound ? defaultSound.id : '',
          // leadInTime: this.settings && this.settings.leadInTime ? this.settings.leadInTime : 0,
          defaultSession: this.settings && this.settings.leadInTime ? this.settings.defaultSession : 0
        });
        this.formChanges$ = this.formState.valueChanges;
        this.formChanges$.subscribe(value => {
          this.update(value);
        });
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
  }

  playSound($event) {
    const { detail } = $event;
    const soundId = detail.value;
    this.soundService.play(soundId);
  }

  async update(payload) {
    const updates = Object.assign({}, this.only(this.settings), payload);
    await this.settingsRepo.updateItem(updates);
  }

  only(settings) {
    const keys = ['preferredSound', 'leadInTime', 'defaultSession'];
    return Object.entries(settings).reduce((accum, [key, val]) => {
      if (keys.includes(key)) {
        accum[key] = val;
        return accum;
      }
      delete accum[key];
      return accum;
    }, settings);
  }
}
