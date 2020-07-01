import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TimerService } from 'src/app/services/timer.service';


@Component({
  selector: 'app-timer',
  templateUrl: 'timer.page.html',
  styleUrls: ['timer.page.scss']
})
export class TimerPage {

  vm$: Observable<any>;
  destroy$ = new Subject();

  constructor(private timerSvc: TimerService) {
    this.vm$ = this.timerSvc.store$;
  }

  ionViewWillEnter() {
    this.timerSvc.api().init();
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
  }
}
