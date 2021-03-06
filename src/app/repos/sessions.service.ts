import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { ISession } from '../types';
import { IDataRepo } from './database.interface';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class SessionsService implements IDataRepo<ISession> {
  private collection = 'sessions';
  constructor() { }
  // figure out how to make this a protected method that can't be called directly
  // should only be called internally and publicly only through other APIs
  async setObject(payload: ISession[]) {
    return await Storage.set({
      key: this.collection,
      value: JSON.stringify(payload)
    });
  }

  async getItems() {
    const { value } = await Storage.get({ key: this.collection });
    return JSON.parse(value);
  }

  async addItem(payload: ISession) {
    const { value } = await Storage.get({ key: this.collection });
    if (!value) {
      return await this.setObject([payload]);
    }
    const sessions = JSON.parse(value);
    sessions.push(payload);
    return this.setObject(sessions);
  }
}
