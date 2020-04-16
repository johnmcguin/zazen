import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Observable, BehaviorSubject, interval, empty } from 'rxjs';
import { mapTo, takeWhile, switchMap, scan, finalize } from 'rxjs/operators';
import { SessionsService } from '../../repos/sessions.service';
import { SettingsService } from 'src/app/repos/settings.service';
import { SoundService } from 'src/app/services/sound.service';

const { Modals } = Plugins;

@Component({
  selector: 'app-timer',
  templateUrl: 'timer.page.html',
  styleUrls: ['timer.page.scss']
})
export class TimerPage {
  timeRemaining: string;
  playState$: BehaviorSubject<boolean>;
  timer$;
  interval$: Observable<number>;
  isAlive: boolean;
  settings$;
  settings;

  private targetTime;
  private currentSeconds;

  constructor(private sessionRepo: SessionsService, private settingsRepo: SettingsService, private soundService: SoundService) {
    this.interval$ = interval(1000).pipe(mapTo(-1));
    this.playState$ = new BehaviorSubject<boolean>(false);
  }

  async ionViewWillEnter() {
    this.isAlive = true;
    this.settings = await this.settingsRepo.getItems();
    this.currentSeconds = this.settings && this.settings.defaultSession ? this.settings.defaultSession * 60 : 10 * 60;
    this.timeRemaining = this.getTimeRemaining(this.currentSeconds);

    this.timer$ = this.playState$
      .pipe(
        switchMap(val => (val ? this.interval$ : empty())),
        scan((accum, curr: any) => (curr ? curr + accum : accum), this.currentSeconds),
        takeWhile(v => v >= 0 || this.isAlive === true),
        finalize(() => {
          this.sessionRepo.addItem({
            sessionLength: this.targetTime,
            completed: this.currentSeconds === 0 ? true : false,
            date: new Date()
          });
        })
      )
      .subscribe(countdownSeconds => {
        this.timeRemaining = this.getTimeRemaining(countdownSeconds);
      });
  }

  ionViewDidLeave() {
    this.isAlive = false;
  }

  play() {
    this.playState$.next(true);
    const soundId = this.settings && this.settings.preferredSound ? this.settings.preferredSound : 'sound2';
    this.soundService.play(soundId);
  }

  pause() {
    this.playState$.next(false);
  }

  getTimeRemaining(countdownSeconds: number): string {
    this.currentSeconds = countdownSeconds;
    const mins = Math.floor(countdownSeconds / 60);
    const secs = countdownSeconds - mins * 60;
    return `${('0' + mins.toString()).slice(-2)}:${('0' + secs.toString()).slice(-2)}`;
  }
}
