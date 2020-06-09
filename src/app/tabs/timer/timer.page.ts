import { Component } from '@angular/core';
import { Observable, BehaviorSubject, interval, empty, Subject } from 'rxjs';
import { mapTo, takeWhile, switchMap, scan, finalize, map } from 'rxjs/operators';
import { SessionsService } from '../../repos/sessions.service';
import { SettingsService } from 'src/app/repos/settings.service';
import { SoundService } from 'src/app/services/sound.service';
import { TimerViewState, TimerService } from 'src/app/services/timer.service';
import { PlayState } from 'src/app/types';


@Component({
  selector: 'app-timer',
  templateUrl: 'timer.page.html',
  styleUrls: ['timer.page.scss']
})
export class TimerPage {

  constructor(private timerSvc: TimerService) { }

  vm$: Observable<TimerViewState> = this.timerSvc.store$
    .pipe(
      map(state => {
        const countdown = state.sessionTime - state.tickCount;
        state.timeRemaining = this.getTimeRemaining(countdown);
        return state;
      })
    );
  destroy$ = new Subject();

  ionViewWillEnter() { }

  playPressed(viewModelState) {
    if (viewModelState.state === PlayState.Pristine) {
      this.timerSvc.play();
    } else if (viewModelState.state === PlayState.Paused) {
      this.timerSvc.resume();
    } else {
      console.log('noop');
      console.log('playPressed called while viewModelState is: ', viewModelState);
    }
  }

  pausePressed(viewModelState) {
    this.timerSvc.pause();
  }

  ionViewDidLeave() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getTimeRemaining(countdownSeconds: number): string {
    const mins = Math.floor(countdownSeconds / 60);
    const secs = countdownSeconds - mins * 60;
    return `${('0' + mins.toString()).slice(-2)}:${('0' + secs.toString()).slice(-2)}`;
  }
}
