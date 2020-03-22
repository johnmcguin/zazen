import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage implements OnInit {
  constructor() {}

  async ngOnInit() { }

  darkModeChanged($event) {
    document.body.classList.toggle('dark', $event.detail.checked);
  }
}
