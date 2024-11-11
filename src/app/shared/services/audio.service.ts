// audio.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private audioContext: AudioContext | undefined;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | undefined;
  private volume: number = 1;
  private audioType = "piano";

  notes = [
    { note: "Empty", frequency: 0 },         // Unused element at index 0
    { note: "Do", frequency: 261.63 },       // C4
    { note: "Re", frequency: 293.66 },       // D4
    { note: "Mi", frequency: 329.63 },       // E4
    { note: "Fa", frequency: 349.23 },       // F4
    { note: "Sol", frequency: 392.00 },      // G4
    { note: "La", frequency: 440.00 },       // A4
    { note: "Si", frequency: 493.88 },       // B4
    { note: "Do (octave higher)", frequency: 523.25 },  // C5
    { note: "Re (octave higher)", frequency: 587.33 },  // D5
    { note: "Mi (octave higher)", frequency: 659.25 },  // E5
    { note: "Fa (octave higher)", frequency: 698.46 },  // F5
  ];

  constructor() {
    // Initialize the audio context and nodes
    if (typeof window !== 'undefined') {
      // Code that uses Prism.js
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
    } else {
      console.warn('AudioService: Unable to initialize audio context');
    }
  }

  // Start generating a sound with a specific frequency
  startSound(frequency: number = 440) {
    if (!this.oscillator && this.audioContext && this.gainNode) {
      this.oscillator = this.audioContext.createOscillator();
      this.oscillator.frequency.setValueAtTime(
        frequency,
        this.audioContext.currentTime
      );
      this.oscillator.connect(this.gainNode);
      this.oscillator.start();
    }
  }

  // Stop the sound
  stopSound() {
    if (this.oscillator) {
      this.oscillator.stop();
      this.oscillator.disconnect();
      this.oscillator = null;
    }
  }

  // Change frequency
  changeFrequency(frequency: number) {
    if (this.oscillator && this.audioContext) {
      this.oscillator.frequency.setValueAtTime(
        frequency,
        this.audioContext.currentTime
      );
    }
  }

  // Change volume
  // changeVolume(volume: number) {
  //   this.gainNode && this.audioContext ? this.gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime) : null;
  // }

  changeVolume(volume: number) {
    this.volume = volume;
  }

  changeSoundType(audioType: string) {
    this.audioType = audioType;
  }

  playSound(frequency: number = 440) {
    switch (this.audioType) {
      case 'blip':
        this.playFluteSound(frequency);
        break;
      case 'coin':
        this.playCoinSound(frequency);
        break;
      case 'piano':
        this.playPianoSound(frequency);
        break;
      default:
        this.playPianoSound(frequency);
        break;
    }
  }

  // Method to generate the coin sound
  playCoinSound(index: number) {
    if (!this.audioContext) {
      return;
    }
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = 'square'; // 8-bit style
    oscillator.frequency.setValueAtTime(this.notes[index].frequency +100, this.audioContext.currentTime);
    // Start frequency
    oscillator.frequency.exponentialRampToValueAtTime(
      300,
      this.audioContext.currentTime + 0.1
    ); // Drop

    gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime); // Initial volume
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      this.audioContext.currentTime + 0.1
    );

    oscillator.connect(gainNode).connect(this.audioContext.destination);
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }



  playPianoSound(index: number) {
    if (!this.audioContext) {
      return;
    }

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = 'sine'; // Sine wave for a smoother, piano-like sound
    oscillator.frequency.setValueAtTime(this.notes[index].frequency, this.audioContext.currentTime);

    // Set up a simple fade-out to mimic a piano key's sound envelope
    gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime); // Initial volume
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1); // Fade-out time

    // Connect nodes
    oscillator.connect(gainNode).connect(this.audioContext.destination);
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 1); // Play for 1 second
  }

  playFluteSound(index: number = 1) {
    if (!this.audioContext) {
      return;
    }

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = 'sine'; // Sine wave for a pure, flute-like tone
    oscillator.frequency.setValueAtTime(this.notes[index].frequency, this.audioContext.currentTime);

    // Flute-like gentle fade-in and sustain
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime); // Start at silence
    gainNode.gain.linearRampToValueAtTime(0.5 * this.volume, this.audioContext.currentTime + 0.1); // Quick fade-in
    gainNode.gain.exponentialRampToValueAtTime(0.0001, this.audioContext.currentTime + 1.5); // Gradual fade-out

    // Connect nodes
    oscillator.connect(gainNode).connect(this.audioContext.destination);
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 1.5); // Play for 1.5 seconds
  }


  // audio.service.ts
  playBlipSound(index: number = 1) {
    if (!this.audioContext) {
      return;
    }
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    // Set the oscillator to a high frequency for a "blip" effect
    oscillator.type = 'sine'; // "sine" wave works well for a blip
    oscillator.frequency.setValueAtTime(this.notes[index].frequency, this.audioContext.currentTime);

    oscillator.frequency.exponentialRampToValueAtTime(
      1200,
      this.audioContext.currentTime + 0.05
    ); // Quick frequency ramp up

    // Short gain envelope for the blip effect
    gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime); // Volume
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      this.audioContext.currentTime + 0.05
    ); // Decay quickly

    oscillator.connect(gainNode).connect(this.audioContext.destination);
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.05); // Stop after 50ms for a brief blip
  }


}
