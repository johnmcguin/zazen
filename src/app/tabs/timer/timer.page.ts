import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, interval, empty, from, combineLatest, of } from 'rxjs';
import { mapTo, takeWhile, switchMap, scan, finalize, withLatestFrom, map, mergeMap } from 'rxjs/operators';
import { SessionsService } from '../../repos/sessions.service';
import { SettingsService } from 'src/app/repos/settings.service';
import { SoundService } from 'src/app/services/sound.service';

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
  settings$;
  settings;
  currentSeconds$: BehaviorSubject<number>;
  private targetTime;
  private currentSeconds;

  constructor(private sessionRepo: SessionsService, private settingsRepo: SettingsService, private soundService: SoundService) { }

  ngOnInit() {
    this.interval$ = interval(1000).pipe(mapTo(-1));
    this.playState$ = new BehaviorSubject<boolean>(false);
    this.currentSeconds$ = new BehaviorSubject(0);

    this.settings$ = from(this.settingsRepo.getItems())
      .subscribe(settings => {
        this.settings = settings;
        const nextCurrentSecs = settings.defaultSession ? settings.defaultSession * 60 : 10 * 60;
        this.currentSeconds$.next(nextCurrentSecs);
        // this.currentSeconds = settings.defaultSession ? settings.defaultSession * 60 : 10 * 60;
        this.timeRemaining = this.getTimeRemaining(this.currentSeconds$.getValue());
      });

    this.currentSeconds$.subscribe(secs => {
      this.currentSeconds = secs;
    });
    // TODO: pick up here. I think I need to merge on some observable that would observe this.currentSeconds
    // this.timer$ = this.playState$
    //   .pipe(
    //     switchMap(val => {
    //       return (val && this.currentSeconds$.getValue() > 0 ? this.interval$ : empty())
    //     }),
    //     scan((accum, curr: any) => {
    //       return (curr ? curr + accum : accum);
    //     }, this.currentSeconds$.getValue()),
    //     takeWhile(v => v >= 0),
    //     finalize(() => {
    //       this.sessionRepo.addItem({
    //         sessionLength: this.targetTime,
    //         completed: this.currentSeconds === 0 ? true : false,
    //         date: new Date()
    //       });
    //     })
    //   )
    //   .subscribe(countdownSeconds => {
    //     this.timeRemaining = this.getTimeRemaining(countdownSeconds);
    //   });
    this.timer$ = combineLatest([this.playState$, this.currentSeconds$])
      .pipe(
        map(([playState, currentSecs]) => {
          return playState && currentSecs > 0;
        }),
        // mergeMap(val => {
        //   return combineLatest([this.currentSeconds$, this.interval$]);
        //   // return (val ? this.interval$ : empty())
        // }, (src, [currentSecs, interv]) => {
        //   return src ? { interv, currentSecs } : empty();
        //   // return mm;
        // }),
        mergeMap(val => {
          return combineLatest([this.currentSeconds$, this.interval$])
            .pipe(
              map(([currentSecs, interv]) => {
                return val ? { currentSecs, interv } : empty();
              })
            );
        }),
        map((data: any) => {
          return data.currentSecs + data.interv;
          // const { interv, currentSecs } = data;
          // return interv.pipe(
          //   scan((accum, curr) => (curr ? curr + accum : accum), currentSecs)
          // );
        }),
        // switchMap(val => {
        //   return (val ? this.interval$ : empty())
        // }),
        // withLatestFrom(this.currentSeconds$),
        // map(([interv, currentSecs]) => {
        //   const nextTick = interv + currentSecs;
        //   this.currentSeconds = nextTick;
        //   return nextTick;
        // }),
        // scan((accum, curr: any) => {
        //   const secs = accum.getValue();
        //   return (curr ? curr + secs : secs);
        //   // return (curr ? curr + accum : accum);
        // }, this.currentSeconds$),
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
    this.soundService.play(this.settings.preferredSound);
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
