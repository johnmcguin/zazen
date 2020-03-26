import { TestBed } from '@angular/core/testing';

import { SoundService } from './sound.service';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

describe('SoundService', () => {
  const nativeAudioSpy = jasmine.createSpyObj('NativeAudio', ['preloadSimple', 'play', 'stop']);
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: NativeAudio, useValue: nativeAudioSpy }
    ]
  }));

  it('should be created', () => {
    const service: SoundService = TestBed.get(SoundService);
    expect(service).toBeTruthy();
  });
});
