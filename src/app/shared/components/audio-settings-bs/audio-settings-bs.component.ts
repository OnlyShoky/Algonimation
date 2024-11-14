import { Component, inject, ViewChild } from '@angular/core';
import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AudioService } from '../../services/audio.service';
import { FormControl, FormsModule } from '@angular/forms';
import { MatDivider } from '@angular/material/divider';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-audio-settings-bs',
  standalone: true,
  imports: [MatBottomSheetModule, MatButtonModule, MatIconModule, MatMenuModule, MatSliderModule, MatButtonToggleModule, FormsModule, MatDivider],
  templateUrl: './audio-settings-bs.component.html',
  styleUrl: './audio-settings-bs.component.scss'
})
export class AudioSettingsBSComponent {
  @ViewChild(MatMenu) menuMat!: MatMenu;
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;

  audioService: any;
  volume: number = 0.2;

  audioTypeControl = new FormControl('');
  audioType: string = 'piano';
  constructor(audioService: AudioService) {
    this.audioService = audioService;
    this.updateVolume(this.volume);
  }

  toggleMute() {
    if (this.volume === 0) {
      this.volume = 1; // Restore to a default volume level
    } else {
      this.volume = 0; // Mute
    }
  }

  updateVolume(value: number): void {
    this.audioService.changeVolume(value);
  }

  updateAudioType() {
    this.audioService.changeSoundType(this.audioType);
  }
}
