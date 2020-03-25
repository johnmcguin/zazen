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
