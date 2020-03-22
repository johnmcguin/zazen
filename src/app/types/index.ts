export interface ISession {
    // in seconds
    sessionLength: number;
    completed: boolean;
    date: Date;
}

export interface ISettings {
    // theme: string;
    preferredSound?: string;
    leadInTime?: number;
}
