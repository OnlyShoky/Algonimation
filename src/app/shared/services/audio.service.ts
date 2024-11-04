// audio.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audioContext: AudioContext;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode;

  constructor() {
    // Initialize the audio context and nodes
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.audioContext.destination);
  }

  // Start generating a sound with a specific frequency
  startSound(frequency: number = 440) {
    if (!this.oscillator) {
      this.oscillator = this.audioContext.createOscillator();
      this.oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
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
    if (this.oscillator) {
      this.oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    }
  }

  // Change volume
  changeVolume(volume: number) {
    this.gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
  }

  // Method to generate the coin sound
  playCoinSound(frequency:number = 440) {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = 'square'; // 8-bit style
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime); // Start frequency
    oscillator.frequency.exponentialRampToValueAtTime(300, this.audioContext.currentTime + 0.1); // Drop

    gainNode.gain.setValueAtTime(1, this.audioContext.currentTime); // Volume
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);

    oscillator.connect(gainNode).connect(this.audioContext.destination);
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  // Method to generate the laser blast sound
  playLaserSound(frequency: number = 800) {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = 'sawtooth'; // Different wave for laser effect
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime); // Start frequency
    oscillator.frequency.exponentialRampToValueAtTime(300, this.audioContext.currentTime + 0.3); // Drop for laser effect

    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(1, this.audioContext.currentTime + 0.3);

    oscillator.connect(gainNode).connect(this.audioContext.destination);
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  // audio.service.ts
playBlipSound(frequency: number = 800) {
  const oscillator = this.audioContext.createOscillator();
  const gainNode = this.audioContext.createGain();

  // Set the oscillator to a high frequency for a "blip" effect
  oscillator.type = 'sine'; // "sine" wave works well for a blip
  oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime); // Start frequency
  oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.05); // Quick frequency ramp up

  // Short gain envelope for the blip effect
  gainNode.gain.setValueAtTime(1, this.audioContext.currentTime); // Volume
  gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.05); // Decay quickly

  oscillator.connect(gainNode).connect(this.audioContext.destination);
  oscillator.start();
  oscillator.stop(this.audioContext.currentTime + 0.05); // Stop after 50ms for a brief blip
}
}
