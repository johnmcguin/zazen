import { Injectable } from '@angular/core';
import { BehaviorSubject, from, combineLatest, timer, NEVER, Observable } from 'rxjs';

import { SettingsService } from '../repos/settings.service';
import { TimerState, PlayState } from '../types';
import { SessionsService } from '../repos/sessions.service';
import { scan, switchMap, map, takeWhile } from 'rxjs/operators';

export type TimerViewState = TimerState & {
    sessionTime: number;
    tickCount: number;
    timeRemaining: string;
};

@Injectable({
  providedIn: 'root'
})
export class TimerService {

    constructor(
        private settingsSvc: SettingsService,
        private sessionSvc: SessionsService
    ) {
        /**
         * ding on start, ding on end, write results on end
         * listen to inputs
         * 1. component mount
         * 2. play pressed
         * 3. pause pressed
         */
        combineLatest([this.playState$, this.getSessionTime()])
            .pipe(
                switchMap(([playState, sitTime]) => {
                    const timerCond = playState === PlayState.Playing;
                    return this.timerOrNever(sitTime, timerCond);
                })
            )
    }

    /**
     * input observables
     */
    private playState$: BehaviorSubject<PlayState> = new BehaviorSubject(PlayState.Pristine);
    private go$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    private state: TimerViewState = {
        state: PlayState.Pristine,
        tickCount: 0,
        sessionTime: 0,
        timeRemaining: ''
    };

    // tslint:disable-next-line: variable-name
    private _state$ = new BehaviorSubject<TimerViewState>(this.state);
    public readonly store$ = this._state$
        .asObservable()
        .pipe(
            scan((state, newState) => {
                return {
                    ...state,
                    ...newState
                };
            }, this.state)
        );

    private getSessionTime(): Observable<number> {
        return from(this.settingsSvc.getItems())
            .pipe(
                map(settings => {
                    if (settings.defaultSession) {
                        return settings.defaultSession * 60;
                    } else {
                        return 10 * 60;
                    }
                })
            );
    }

    private timerOrNever(time, cond) {
        const timer$ = timer(0, time).pipe(takeWhile(t => t >= 0));
        return cond ? timer$ : NEVER;
    }

    private remainingSeconds(t) {
        return t;
    }

    public play() {
        this.playState$.next(PlayState.Playing);
    }

    public pause() {
        this.playState$.next(PlayState.Paused);
    }

    public resume() {
        this.playState$.next(PlayState.Playing);
    }

    public init() { }
}
