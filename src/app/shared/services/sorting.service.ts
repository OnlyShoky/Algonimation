import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SortingService {
  // Array of unique values from 0 to 10
  values: number[] = Array.from(
    new Set(Array.from({ length: 11 }, (_, index) => index))
  );

  private swapSubject = new Subject<{ index1: number; index2: number }>();
  public swapObservable$ = this.swapSubject.asObservable();

  private linePointerSubject = new Subject<number>();
  public linePointerSubject$ = this.linePointerSubject.asObservable();
  public deltaLine: number = 2;

  // Subject to trigger the next step
  private stepTrigger = new Subject<void>();

  constructor() {}

  // Bubble sort implementation
  async bubbleSort(arr: number[]): Promise<number[]> {
    const n = arr.length;
    this.linePointerSubject.next(0 + this.deltaLine);
    await this.waitForUserStep();
    for (let i = 0; i < n - 1; i++) {
      this.linePointerSubject.next(1 + this.deltaLine);
      await this.waitForUserStep();
      for (let j = 0; j < n - i - 1; j++) {
        this.linePointerSubject.next(2 + this.deltaLine);
        await this.waitForUserStep();
        if (arr[j] > arr[j + 1]) {
          this.linePointerSubject.next(3 + this.deltaLine);
          await this.waitForUserStep();
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          this.linePointerSubject.next(4 + this.deltaLine);
          await this.waitForUserStep();
          this.swapSubject.next({ index1: j, index2: j + 1 });
          await this.waitForUserStep();
        }
      }
    }
    this.linePointerSubject.next(1);

    return arr;
  }

  // Function to randomize the order of values
  shuffleArray(arr: number[]): number[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Random index
      // Swap arr[i] and arr[j]
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Function to get the current unique values
  getValues(): number[] {
    return this.values;
  }

  // Function to sort the values using bubble sort
  sortValues(): Promise<number[]> {
    return this.bubbleSort([...this.values]); // Sort a copy of the original array
  }

  // Function to shuffle the values
  randomizeValues(): number[] {
    return this.shuffleArray([...this.values]); // Shuffle a copy of the original array
  }

  private async waitForUserStep(): Promise<void> {
    await new Promise<void>((resolve) => {
      this.stepTrigger.subscribe(() => resolve());
    });
  }

  // Method to trigger the next step externally
  public triggerNextStep(): void {
    this.stepTrigger.next();
  }
}
