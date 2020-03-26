import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SettingsPage } from './settings.page';
import { SettingsService } from 'src/app/repos/settings.service';
import { SessionsService } from 'src/app/repos/sessions.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

describe('SettingsPage', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;

  beforeEach(async(() => {
    const nativeAudioSpy = jasmine.createSpyObj('NativeAudio', ['preloadSimple', 'play', 'stop']);
    const settingsSpy = jasmine.createSpyObj('SettingsService', ['setObject', 'getItems', 'setItem', 'getItem', 'addItem', 'updateItem']);
    const sessionsSpy = jasmine.createSpyObj('SessionsService', ['setObject', 'getItems', 'setItem', 'getItem', 'addItem', 'updateItem']);
    TestBed.configureTestingModule({
      declarations: [SettingsPage],
      imports: [
        IonicModule.forRoot(),
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: NativeAudio, useValue: nativeAudioSpy },
        { provide: SettingsService, useValue: settingsSpy },
        { provide: SessionsService, useValue: sessionsSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsPage);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
