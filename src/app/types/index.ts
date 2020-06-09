export interface ISession {
    sessionLength: number;
    completed: boolean;
    date: Date;
}

export interface ISettings {
    preferredSound?: string;
    leadInTime?: number; // seconds
    defaultSession?: number; // minutes
}

export interface ISound {
    name: string;
    id: string;
    path: string;
}

interface IPristine {
    state: PlayState.Pristine;
}

interface IPlaying {
    state: PlayState.Playing;
}

interface IPaused {
    state: PlayState.Paused;
}

interface IDone {
    state: PlayState.Done;
}

export enum PlayState {
    Pristine = 'pristine',
    Playing = 'playing',
    Paused = 'paused',
    Done = 'done',
}

export type TimerState = IPristine | IPlaying | IPaused | IDone;
