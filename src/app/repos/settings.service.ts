import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { ISettings } from '../types';
import { IDataRepo } from './database.interface';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class SettingsService implements IDataRepo<ISettings> {
  private collection = 'settings';
  constructor() { }
  // figure out how to make this a protected method that can't be called directly
  // should only be called internally and publicly only through other APIs
  async addItem(payload: ISettings) {
    return await Storage.set({
      key: this.collection,
      value: JSON.stringify(payload)
    });
  }

  async updateItem(payload: ISettings) {
    const { value } = await Storage.get({ key: this.collection });
    if (!value) {
      return await this.addItem(payload);
    }
    const settings = JSON.parse(value);
    const newSettings = Object.assign({}, settings, payload);
    return this.addItem(newSettings);
  }
}
