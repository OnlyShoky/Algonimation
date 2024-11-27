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
  public deltaLine: number = 1;

  // Subject to trigger the next step
  private stepTrigger = new Subject<void>();
  delay: number = 500;

  private delaySubject = new Subject<number>();
  public delaySubject$ = this.delaySubject.asObservable();

  cancelTrigger = false;


  constructor() { }

  // Helper functions

  setAnimationDelay(delay: number) {
    console.log('Animation delay set to', delay);
    this.delay = delay;
    this.delaySubject.next(delay);
  }

  getAnimationDelay() {
    return this.delay;
  }

  getCancelTrigger() {
    return this.cancelTrigger;
  }

  cancelSorting() {
    this.cancelTrigger = true;
  }

  startSorting() {
    this.cancelTrigger = false;
  }



  async highlightElement(index: number, unhighlight: boolean, needTrigger = false, colorType: string = 'accent') {
    // cancel sorting
    if (!this.cancelTrigger) {


      this.highlightSubject.next({ index, unhighlight, needTrigger, colorType });

      if (needTrigger) {
        await this.waitForUserStep();
      }
    }
  }

  async moveToLine(line: number) {
    if (!this.cancelTrigger) {
      this.linePointerSubject.next(line + this.deltaLine);
      await this.waitForUserStep();
    }
  }

  async swapElements(arr: number[], index1: number, index2: number) {

    if (!this.cancelTrigger) {

      [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
      this.swapSubject.next({ index1, index2 });
      await this.waitForUserStep();
    }
  }

  // Bubble Sort Implementation
  async bubbleSort(arr: number[]): Promise<number[]> {

    const n = arr.length;

    await this.moveToLine(1);
    for (let i = 0; i < n - 1; i++) {
      await this.moveToLine(2);
      for (let j = 0; j < n - i - 1; j++) {

        // cancel sorting
        if (this.cancelTrigger)
          return arr;
        await this.moveToLine(3);

        // Highlight current elements
        await this.highlightElement(j, false, true, 'accent-light');
        await this.highlightElement(j + 1, false, true, 'accent-light');

        await this.moveToLine(4);
        if (arr[j] > arr[j + 1]) {
          await this.moveToLine(5);
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
    await this.moveToLine(0);

    return arr;
  }

  // Selection Sort Implementation
  async selectionSort(arr: number[]): Promise<number[]> {
    await this.moveToLine(1);
    const n = arr.length;

    await this.moveToLine(2);
    for (let i = 0; i < n - 1; i++) {

      await this.moveToLine(3);
      let minIdx = i;
      await this.highlightElement(minIdx, false, true, 'accent-light');

      await this.moveToLine(4);
      for (let j = i + 1; j < n; j++) {
        // cancel sorting
        if (this.cancelTrigger)
          return arr;

        // Highlight current element
        await this.highlightElement(j, false, true, 'accent-light');
        await this.highlightElement(j, true);
        await this.moveToLine(5);
        if (arr[j] < arr[minIdx]) {
          await this.highlightElement(minIdx, true); // Unhighlight previous min
          await this.moveToLine(6);
          minIdx = j;
          await this.highlightElement(j, false, true); // Highlight new min
          await this.moveToLine(3);
        }
      }

      if (i !== minIdx) {
        await this.moveToLine(7);
        await this.swapElements(arr, i, minIdx);
      }

      // Highlight sorted element at index i
      await this.highlightElement(i, false, true);
    }
    await this.moveToLine(1);
    await this.highlightElement(n - 1, false, true);

    await this.moveToLine(0);
    return arr;
  }
  async insertionSort(arr: number[]): Promise<number[]> {
    console.log("insertionSort");
    await this.moveToLine(0);

    const n = arr.length;
    this.linePointerSubject.next(0 + this.deltaLine);
    await this.waitForUserStep();
    await this.highlightElement(0, false, true);

    await this.moveToLine(1);
    for (let i = 1; i < n; i++) {

      this.linePointerSubject.next(1 + this.deltaLine);
      await this.waitForUserStep();

      await this.moveToLine(2);
      let key = arr[i];
      await this.moveToLine(3);
      let j = i - 1;

      await this.highlightElement(i, false, false, 'accent-light');
      this.linePointerSubject.next(2 + this.deltaLine);
      await this.waitForUserStep();

      await this.moveToLine(4);
      // cancel sorting
      if (this.cancelTrigger)
        return arr;
      while (j >= 0 && arr[j] > key) {
        // cancel sorting
        if (this.cancelTrigger)
          return arr;
        // Highlight current elements
        await this.highlightElement(j, false, false, 'accent-light');
        await this.highlightElement(j + 1, false, true, 'accent-light');

        this.linePointerSubject.next(3 + this.deltaLine);
        await this.waitForUserStep();
        await this.moveToLine(5);
        await this.swapElements(arr, j + 1, j);
        // Highlight sorted element at index i
        await this.highlightElement(j + 1, false, true);
        j--;
        await this.moveToLine(6);


        this.linePointerSubject.next(4 + this.deltaLine);
        await this.waitForUserStep();


      }
      await this.highlightElement(j + 1, false, true);


      arr[j + 1] = key;
      await this.moveToLine(7);

      this.linePointerSubject.next(5 + this.deltaLine);
      await this.waitForUserStep();
    }
    await this.highlightElement(n - 1, false, false);
    this.linePointerSubject.next(1);

    await this.moveToLine(0);
    return arr;

  }

  // Inside SortingService

  async quickSort(arr: number[], low = 0, high = arr.length - 1): Promise<number[]> {
    console.log('quickSort');

    // cancel sorting
    if (this.cancelTrigger)
      return arr;
    // Line pointer for tracking line execution
    await this.moveToLine(10);



    if (low < high) {

      await this.moveToLine(11);
      const pivotIndex = await this.partition(arr, low, high);




      await this.moveToLine(12);

      // Recursively sort the left and right halves around the pivot
      await this.quickSort(arr, low, pivotIndex - 1);
      await this.moveToLine(13);

      await this.quickSort(arr, pivotIndex + 1, high);
      await this.moveToLine(14);



    }

    await this.moveToLine(1);
    return arr;
  }

  // Partition function used in QuickSort
  private async partition(arr: number[], low: number, high: number): Promise<number> {
    await this.moveToLine(0);
    const pivot = arr[high];
    await this.moveToLine(1);
    let i = low - 1;

    // Highlight the pivot element
    await this.highlightElement(high, false, true, 'accent');

    for (let j = low; j < high; j++) {

      await this.moveToLine(2);
      // Highlight current element for comparison
      await this.highlightElement(j, false, true, 'accent-light');
      if (arr[j] < pivot) {
        await this.moveToLine(3);
        i++;
        await this.moveToLine(4);

        // Swap if element is less than pivot
        if (i !== j)
          await this.swapElements(arr, i, j);
        await this.moveToLine(5);


      }
      // Unhighlight current element
      await this.highlightElement(j, true);

    }

    await this.highlightElement(high, true);
    // Place pivot in correct sorted position
    await this.swapElements(arr, i + 1, high);
    await this.moveToLine(6);

    // await this.highlightElement(i + 1, false, true); // Highlight sorted pivot position
    await this.moveToLine(7);
    return i + 1;
  }

  // Inside SortingService
async binarySearch(arr: number[], target: number): Promise<number[]> {
  let low = 0;
  let high = arr.length - 1;

  await this.highlightElement(low, false, false, 'secondary');
  await this.highlightElement(high, false, false, 'secondary');

  await this.moveToLine(1); // Initial setup for binary search
  while (low <= high) {


    await this.moveToLine(2); // Compute middle index
    const mid = Math.floor((low + high) / 2);

    // Highlight the middle element
    await this.highlightElement(mid, false, true, 'accent-light');
    await this.moveToLine(3); // Check if middle is the target

    if (arr[mid] === target) {
      // Target found
      await this.moveToLine(4);
      // Highlight the found element
      await this.highlightElement(mid, false, true, 'accent');
      return [mid];
    }

    await this.moveToLine(5); // Determine search range

    if (arr[mid] < target) {
      await this.moveToLine(6); // Target is in the upper half
      await this.highlightElement(mid, true);
      await this.highlightElement(low, true);

      low = mid + 1;
      await this.highlightElement(low, false, false, 'secondary');
      await this.highlightElement(high, false, true, 'secondary');
    } else {
      await this.moveToLine(7); // Target is in the lower half
      await this.highlightElement(high, true);
      await this.highlightElement(mid, true);
      high = mid - 1;
      await this.highlightElement(low, false, false, 'secondary');
      await this.highlightElement(high, false, true, 'secondary');
    }
  }

  await this.moveToLine(8); // Target not found
  return [-1];
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
