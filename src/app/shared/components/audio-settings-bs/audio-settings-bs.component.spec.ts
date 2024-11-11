import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioSettingsBSComponent } from './audio-settings-bs.component';

describe('AudioSettingsBSComponent', () => {
  let component: AudioSettingsBSComponent;
  let fixture: ComponentFixture<AudioSettingsBSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudioSettingsBSComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AudioSettingsBSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
