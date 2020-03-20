import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, interval, empty } from 'rxjs';
import { mapTo, takeWhile, switchMap, scan, finalize } from 'rxjs/operators';
import { SessionsService } from '../repos/sessions.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  timeRemaining: string;
  playState$: BehaviorSubject<boolean>;
  timer$;
  interval$: Observable<number>;
  // needs to be configurable
  // TODO: pick up here
  private targetTime = .1 * 60;
  private currentSeconds = .1 * 60; // should be default from settings

  constructor(private repo: SessionsService) { }

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
          this.repo.addItem({
            time: this.targetTime,
            completed: this.currentSeconds === 0 ? true : false,
            date: new Date()
          });
        })
      )
      .subscribe(countdownSeconds => {
        this.timeRemaining = this.getTimeRemaining(countdownSeconds);
      });
  }

  selectMeditationTime() {
    console.log('time clicked');
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
