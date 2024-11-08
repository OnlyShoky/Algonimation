import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SortingService {
  // Array of unique values from 0 to 10
  values: number[] = Array.from(
    new Set(Array.from({ length: 11 }, (_, index) => index + 1))
  );

  private swapSubject = new Subject<{ index1: number; index2: number }>();
  public swapObservable$ = this.swapSubject.asObservable();

  private highlightSubject = new Subject<{
    index: number;
    unhighlight: boolean;
    needTrigger?: boolean;
    colorType?: string;
  }>();
  public highlightSubject$ = this.highlightSubject.asObservable();

  private linePointerSubject = new Subject<number>();
  public linePointerSubject$ = this.linePointerSubject.asObservable();
  public deltaLine: number = 2;

  // Subject to trigger the next step
  private stepTrigger = new Subject<void>();

  constructor() { }

  // Helper functions

  async highlightElement(index: number, unhighlight: boolean, needTrigger = false, colorType: string = 'accent') {

    this.highlightSubject.next({ index, unhighlight, needTrigger, colorType });

    if (needTrigger) {
      await this.waitForUserStep();
    }

  }

  async moveToLine(line: number) {
    this.linePointerSubject.next(line + this.deltaLine);
    await this.waitForUserStep();
  }

  async swapElements(arr: number[], index1: number, index2: number) {
    [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
    this.swapSubject.next({ index1, index2 });
    await this.waitForUserStep();
  }

  // Bubble Sort Implementation
  async bubbleSort(arr: number[]): Promise<number[]> {

    const n = arr.length;

    await this.moveToLine(0);
    for (let i = 0; i < n - 1; i++) {
      await this.moveToLine(1);
      for (let j = 0; j < n - i - 1; j++) {
        await this.moveToLine(2);

        // Highlight current elements
        await this.highlightElement(j, false, false, 'secondary');
        await this.highlightElement(j + 1, false, true, 'secondary');

        await this.moveToLine(3);
        if (arr[j] > arr[j + 1]) {
          await this.moveToLine(4);
          await this.swapElements(arr, j, j + 1);
        }

        // Unhighlight current elements
        await this.highlightElement(j, true);
        await this.highlightElement(j + 1, true);
      }
      // Highlight sorted element at the end of each pass

      await this.highlightElement(n - i - 1, false);
    }
    await this.highlightElement(0, false);
    await this.moveToLine(1);

    return arr;
  }

  // Selection Sort Implementation
  async selectionSort(arr: number[]): Promise<number[]> {

    const n = arr.length;

    await this.moveToLine(0);
    for (let i = 0; i < n - 1; i++) {
      await this.moveToLine(1);

      let minIdx = i;
      await this.highlightElement(minIdx, false, true, 'secondary');

      for (let j = i + 1; j < n; j++) {
        await this.moveToLine(2);

        // Highlight current element
        await this.highlightElement(j, false, true, 'secondary');
        await this.highlightElement(j, true);

        if (arr[j] < arr[minIdx]) {
          await this.highlightElement(minIdx, true); // Unhighlight previous min
          minIdx = j;
          await this.highlightElement(j, false, true); // Highlight new min
          await this.moveToLine(3);
        }
      }

      if (i !== minIdx) {
        await this.swapElements(arr, i, minIdx);
      }

      // Highlight sorted element at index i
      await this.highlightElement(i, false, true);
    }
    await this.moveToLine(1);
    await this.highlightElement(n - 1, false, true);


    return arr;
  }
  async insertionSort(arr: number[]): Promise<number[]> {
    console.log("insertionSort");

    const n = arr.length;
    this.linePointerSubject.next(0 + this.deltaLine);
    await this.waitForUserStep();
    await this.highlightElement(0, false, true);

    for (let i = 1; i < n; i++) {
      this.linePointerSubject.next(1 + this.deltaLine);
      await this.waitForUserStep();

      let key = arr[i];
      let j = i - 1;

      await this.highlightElement(i, false, false, 'secondary');
      this.linePointerSubject.next(2 + this.deltaLine);
      await this.waitForUserStep();

      while (j >= 0 && arr[j] > key) {
        // Highlight current elements
        await this.highlightElement(j, false, false, 'secondary');
        await this.highlightElement(j + 1, false, true, 'secondary');

        this.linePointerSubject.next(3 + this.deltaLine);
        await this.waitForUserStep();
        await this.swapElements(arr, j + 1, j);
        // Highlight sorted element at index i
        await this.highlightElement(j + 1, false, true);
        j--;
        
        this.linePointerSubject.next(4 + this.deltaLine);
        await this.waitForUserStep();
        

      }
       await this.highlightElement(j+1 , false, true);


      arr[j + 1] = key;
      this.linePointerSubject.next(5 + this.deltaLine);
      await this.waitForUserStep();
    }
    await this.highlightElement(n-1, false, false);
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
