import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, interval, empty } from 'rxjs';
import { mapTo, takeWhile, switchMap, scan, finalize } from 'rxjs/operators';
import { SessionsService } from '../../repos/sessions.service';

@Component({
  selector: 'app-timer',
  templateUrl: 'timer.page.html',
  styleUrls: ['timer.page.scss']
})
export class TimerPage implements OnInit {
  timeRemaining: string;
  playState$: BehaviorSubject<boolean>;
  timer$;
  interval$: Observable<number>;
  // needs to be configurable
  // TODO: pick up here
  // query settings for default time as an observable.
  // kick off targetTime and currentSeconds with this value
  private targetTime = .1 * 60;
  private currentSeconds = .1 * 60; // should be default from settings

  constructor(private sessionRepo: SessionsService) { }

  ngOnInit() {
    this.timeRemaining = this.getTimeRemaining(this.currentSeconds);
    this.interval$ = interval(1000).pipe(mapTo(-1));
    this.playState$ = new BehaviorSubject<boolean>(false);

    this.timer$ = this.playState$
      .pipe(
        switchMap(val => (val ? this.interval$ : empty())),
        scan((accum, curr: any) => (curr ? curr + accum : accum), this.currentSeconds),
        takeWhile(v => v >= 0),
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

  play() {
    this.playState$.next(true);
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
