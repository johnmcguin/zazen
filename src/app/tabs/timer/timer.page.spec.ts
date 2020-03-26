import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TimerPage } from './timer.page';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { SettingsService } from 'src/app/repos/settings.service';
import { SessionsService } from 'src/app/repos/sessions.service';

describe('TimerPage', () => {
  let component: TimerPage;
  let fixture: ComponentFixture<TimerPage>;

  beforeEach(async(() => {
    const nativeAudioSpy = jasmine.createSpyObj('NativeAudio', ['preloadSimple', 'play', 'stop']);
    const settingsSpy = jasmine.createSpyObj('SettingsService', ['setObject', 'getItems', 'setItem', 'getItem', 'addItem', 'updateItem']);
    const sessionsSpy = jasmine.createSpyObj('SessionsService', ['setObject', 'getItems', 'setItem', 'getItem', 'addItem', 'updateItem']);
    TestBed.configureTestingModule({
      declarations: [TimerPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: NativeAudio, useValue: nativeAudioSpy },
        { provide: SettingsService, useValue: settingsSpy },
        { provide: SessionsService, useValue: sessionsSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TimerPage);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
