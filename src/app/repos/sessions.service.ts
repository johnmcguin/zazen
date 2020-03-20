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

  async setObject(payload: ISession[]) {
    return await Storage.set({
      key: this.collection,
      value: JSON.stringify({
        items: payload
      })
    });
  }

  async getObject() {
    const { value } = await Storage.get({ key: this.collection });
    return JSON.parse(value);
  }

  async addItem(payload: ISession) {
    const { value } = await Storage.get({ key: this.collection });
    const sessions = JSON.parse(value);
    debugger;
    sessions.items.push(payload);
    return this.setObject(sessions);
  }
}
