import { Component } from '@angular/core';
import { Observable, Subject, fromEvent } from 'rxjs';
import { TimerService } from 'src/app/services/timer.service';
import NoSleep from 'nosleep.js';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-timer',
  templateUrl: 'timer.page.html',
  styleUrls: ['timer.page.scss']
})
export class TimerPage {

  vm$: Observable<any>;
  destroy$ = new Subject();
  noSleep = new NoSleep();

  constructor(private timerSvc: TimerService) {
    this.vm$ = this.timerSvc.store$;
  }

  ionViewWillEnter() {
    this.timerSvc.api().init();
  }

  ionViewDidEnter() {
    const play = document.getElementById('playBtn');
    fromEvent(play, 'click').pipe(take(1)).subscribe(() => {
      this.noSleep.enable();
    });
  }

  play() {
    this.timerSvc.api().play();
  }

  pause() {
    this.timerSvc.api().pause();
  }

  resume() {
    this.timerSvc.api().resume();
  }

  ionViewDidLeave() {
    this.destroy$.next();
    this.destroy$.complete();
    this.noSleep.disable();
  }
}
