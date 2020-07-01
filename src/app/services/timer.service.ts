import { Injectable } from '@angular/core';
import { from, interval, isObservable, EMPTY, BehaviorSubject, of } from 'rxjs';

import { SettingsService } from '../repos/settings.service';
import { TimerState, PlayState } from '../types';
import { scan, map, takeWhile, tap, withLatestFrom, finalize, startWith, mergeMap, share, mapTo, switchMap } from 'rxjs/operators';
import { SoundService } from './sound.service';

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
        private soundSvc: SoundService
    ) {
    }

    private initialState: TimerViewState = {
        state: PlayState.Pristine,
        tickCount: 0,
        sessionTime: 0,
        timeRemaining: ''
    };

    private action$ = new BehaviorSubject(this.initialState);
    private current$ = new BehaviorSubject<Partial<TimerViewState>>({});
    private playing$ = new BehaviorSubject(false);
    public readonly store$ = this.action$
        .pipe(
            mergeMap((action: any) => isObservable(action) ? action : from([action])),
            startWith(this.initialState),
            scan(this.reduce.bind(this)),
            share()
        );

    private reduce(state, action) {
        this.current$.next(state);
        switch (action.type) {
            case 'INIT':
                return {
                    ...state
                };
            case 'INIT_COMPLETE':
                return {
                    ...state,
                    ...action.payload,
                    state: PlayState.Pristine,
                };
            case 'PLAY':
                this.playing$.next(true);
                this.soundSvc.play(state.preferredSound || 'sound2');
                return {
                    ...state,
                    state: PlayState.Playing,
                    playing: true
                };
            case 'PAUSE':
                this.playing$.next(false);
                return {
                    ...state,
                    state: PlayState.Paused,
                    playing: false
                };
            case 'RESUME':
                this.playing$.next(true);
                return {
                    ...state,
                    state: PlayState.Playing,
                    playing: true
                };
            case 'TICK':
                const countdownSeconds = state.sessionTime - state.tickCount;
                const mins = Math.floor(countdownSeconds / 60);
                const secs = countdownSeconds - mins * 60;
                const timeRemaining = `${('0' + mins.toString()).slice(-2)}:${('0' + secs.toString()).slice(-2)}`;

                const tickCount = state.playing ? state.tickCount + 1 : state.tickCount;
                return {
                    ...state,
                    tickCount,
                    timeRemaining
                };
            case 'END':
                const countdown = state.sessionTime;
                const mns = Math.floor(countdown / 60);
                const scs = countdown - mns * 60;
                const remaining = `${('0' + mns.toString()).slice(-2)}:${('0' + scs.toString()).slice(-2)}`;
                this.soundSvc.play(state.preferredSound || 'sound2');
                this.playing$.next(false);
                return {
                    ...state,
                    tickCount: 0,
                    timeRemaining: remaining,
                    state: PlayState.Done
                };
            default:
                return state;
        }
    }

    public api() {
        return {
            init: this.actionCreator(() => {
                return from(this.settingsSvc.getItems()).pipe(
                    map(settingsData => {
                        const countdownSeconds = settingsData.defaultSession * 60 || 10 * 60;
                        const mins = Math.floor(countdownSeconds / 60);
                        const secs = countdownSeconds - mins * 60;
                        const timeRemaining = `${('0' + mins.toString()).slice(-2)}:${('0' + secs.toString()).slice(-2)}`;
                        return {
                            ...settingsData,
                            sessionTime: settingsData.defaultSession ? settingsData.defaultSession * 60 : 10 * 60,
                            timeRemaining
                        };
                    }),
                    map((settingsData) => ({ type: 'INIT_COMPLETE', payload: settingsData }))
                );
            }),
            play: this.actionCreator(() => ({ type: 'PLAY', payload: this.timer.call(this) })),
            pause: this.actionCreator(() => ({ type: 'PAUSE' })),
            resume: this.actionCreator(() => ({ type: 'RESUME' })),
            end: this.actionCreator(() => ({ type: 'END', payload: this.api().init() }))
        };
    }

    private timer() {
        const timer$ = interval(1000).pipe(
            withLatestFrom(this.current$),
            takeWhile(([tick, state]) => state.tickCount < state.sessionTime),
            mapTo({ type: 'TICK' }),
        );

        const onComplete = function() {
            this.api().end();
        }.bind(this);

        timer$.subscribe({
            complete: onComplete
        });

        return this.playing$.pipe(
            switchMap(playing => playing ? timer$ : EMPTY),
        );
    }

    private actionCreator(fn) {
        const actn = (...args) => {
            const action = fn.call(null, ...args);
            this.action$.next(action);
            // handle async
            if (isObservable(action.payload)) {
                this.action$.next(action.payload);
            }
            return action;
        };
        return actn.bind(this);
    }

    getTimeRemaining(countdownSeconds: number): string {
        const mins = Math.floor(countdownSeconds / 60);
        const secs = countdownSeconds - mins * 60;
        return `${('0' + mins.toString()).slice(-2)}:${('0' + secs.toString()).slice(-2)}`;
    }
}
