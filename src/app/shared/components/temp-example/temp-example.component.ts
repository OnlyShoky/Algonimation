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

  // Piano notes
  notes = [
    { note: "Do", frequency: 200.63 },   // C4
    { note: "Do", frequency: 261.63 },   // C4
    { note: "Re", frequency: 293.66 },   // D4
    { note: "Mi", frequency: 329.63 },   // E4
    { note: "Fa", frequency: 349.23 },   // F4
    { note: "Sol", frequency: 392.00 },  // G4
    { note: "La", frequency: 440.00 },   // A4
    { note: "Si", frequency: 493.88 },   // B4
    { note: "Do (octave higher)", frequency: 523.25 }, // C5
    { note: "Re (octave higher)", frequency: 587.33 }, // D5
    { note: "Mi (octave higher)", frequency: 659.25 }, // E5
  ];
  constructor(private audioService: AudioService) {}

  playSound() {
    this.audioService.startSound(this.frequency);
  }

  playPianoSound( i : number) {
    console.log("Piano sound", this.notes[i]);
    this.audioService.playSound(i);
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




  
  ngOnInit() {

  }
}

  

