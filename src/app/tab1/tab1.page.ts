import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, timer, NEVER, combineLatest } from 'rxjs';
import { switchMap, map, takeWhile, filter, tap, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  constructor() { }
  timeRemaining: string;
  private k = 1000;
  INTERVAL = this.k;
  MINUTES = 20;
  TIME = this.MINUTES * this.k * 60;
  current: number;
  time = this.TIME;

  toggle$ = new BehaviorSubject(true);

  remainingSeconds$ = this.toggle$.pipe(
    switchMap((running: boolean) => {
      return running ? timer(0, this.INTERVAL) : NEVER;
    }),
    map(this.toRemainingSeconds),
    takeWhile(t => t >= 0)
  );

  ms$ = this.remainingSeconds$.pipe(
    map(this.toMs),
    tap(t => this.current = t)
  );

  minutes$ = this.ms$.pipe(
    map(this.toMinutes),
    map(s => s.toString()),
    startWith(this.toMinutes(this.time).toString())
  );

  seconds$ = this.ms$.pipe(
    map(this.toSecondsString),
    startWith(this.toSecondsString(this.time).toString())
  );

  timeRemaining$ = combineLatest([this.minutes$, this.seconds$]);

  ngOnInit() {
    this.timeRemaining$
      .subscribe(([minutes, seconds]) => {
        this.timeRemaining = `${minutes}:${seconds}`;
      });
  }

  selectMeditationTime() {
    console.log('time clicked');
  }

  play() {
    this.toggle$.next(true);
    this.toggle$.pipe(
      filter((toggled: boolean) => !toggled)
    )
    .subscribe(() => {
      this.time = this.current;
    });
  }

  pause() {
    this.toggle$.next(false);
    this.toggle$.pipe(
      filter((toggled: boolean) => !toggled)
    )
    .subscribe(() => {
      this.time = this.current;
    });
  }

  toMinutes(ms: number) {
    return Math.floor(ms / this.k / 60);
  }

  toSeconds(ms: number) {
    return Math.floor(ms / this.k) % 60;
  }

  toSecondsString(ms: number) {
    const seconds = this.toSeconds(ms);
    return seconds < 10 ? `0${seconds}` : seconds.toString();
  }

  toMs(t: number) {
    return t * this.INTERVAL;
  }

  currentInterval() {
    return this.time / this.INTERVAL;
  }

  toRemainingSeconds(t: number) {
    return this.time / this.INTERVAL - t;
  }
}
