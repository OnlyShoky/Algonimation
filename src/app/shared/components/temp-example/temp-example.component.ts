import { Component, OnInit } from '@angular/core';
import { SharedMaterialModule } from '../../material/shared-material.module';
import { SortingService } from '../../services/sorting.service';
import { AudioService } from '../../services/audio.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-temp-example',
  standalone: true,
  imports: [SharedMaterialModule,CommonModule,FormsModule],
  templateUrl: './temp-example.component.html',
  styleUrl: './temp-example.component.scss'
})
export class TempExampleComponent implements OnInit {
  sortedValues: number[] = [];
  shuffledValues: number[] = [];

  frequency = 440;
  volume = 0.5;

  constructor(private audioService: AudioService) {}

  playSound() {
    this.audioService.startSound(this.frequency);
  }

  stopSound() {
    this.audioService.stopSound();
  }

  changeFrequency(newFrequency: number) {
    this.audioService.changeFrequency(newFrequency);
  }

  changeVolume(newVolume: number) {
    this.audioService.changeVolume(newVolume);
  }

  playCoinSound() {
    this.audioService.playCoinSound();
  }

  playLaserSound() {
    this.audioService.playLaserSound();
  }

  playBlipSound(frequency:number) {
    this.audioService.playBlipSound(frequency);
  }
  
  ngOnInit() {

  }
}

  

