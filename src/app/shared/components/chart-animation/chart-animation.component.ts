import {
  AfterViewInit,
  Component,
  Input,
  NgModule,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ThemesManagerService } from '../../services/themes-manager.service';
import { SortingService } from '../../services/sorting.service';
import Chart from 'chart.js/auto';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AudioService } from '../../services/audio.service';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { AudioSettingsBSComponent } from "../audio-settings-bs/audio-settings-bs.component";

@Component({
  selector: 'app-chart-animation',
  standalone: true,
  imports: [MatButtonModule, FormsModule, MatSliderModule, MatIconModule, AudioSettingsBSComponent],
  templateUrl: './chart-animation.component.html',
  styleUrls: ['./chart-animation.component.scss'],
})
export class ChartAnimationComponent implements OnInit, OnDestroy {
  @Input() sortAlgorithm!: string; // The sorting algorithm to be used

  // Subscription array to store all subscriptions for cleanup
  private subscriptions: Subscription[] = [];

  isSorting: boolean = false;  // Flag to track sorting status

  // Chart data and labels
  public chart: any; // Chart instance (e.g., Chart.js)
  public labels: string[] = []; // Labels for chart data
  public colors: string[] = []; // Colors for chart data visualization
  public data: number[] = []; // Array to store data for sorting

  // Animation-related settings
  public animationDelay: number = 500; // Default delay for animation in milliseconds
  public animationScrollValue: number = 200; // Speed of animation scroll

  // Theme colors for chart styling (primary, accent, secondary, warn)
  public themeColors: { primary: string; accent: string; secondary: string; warn: string } | undefined;

  // Variables for tracking indices during sorting (for swapping)
  index1: number = -1; // First index for swapping
  index2: number = -1; // Second index for swapping

  // Variables for tracking positions during animation
  private initialX1: number | null = null; // Initial X position of element 1 (for animation)
  private initialX2: number | null = null; // Initial X position of element 2 (for animation)
  private distance: number | null = null; // Distance to move elements during swap animation
  private animationSteps: number | null = null; // Total steps for the animation

  // Constructor to initialize services and prepare data
  constructor(
    private themesManagerService: ThemesManagerService,
    private sortingService: SortingService,
    private audioService: AudioService,
    private route: ActivatedRoute
  ) {
    // Fetch initial data for sorting
    this.data = this.sortingService.getValues();

    // Generate labels for the chart (index of each data element)
    this.labels = this.data.map((_, index) => index.toString());

    // Generate colors for each data element, decreasing opacity with index
    this.colors = this.data.map((_, index) => {
      const alpha = 1 - index / this.data.length; // Opacity decreases as index increases
      return `rgba(255, 255, 255, ${alpha})`; // Use white color with decreasing opacity
    });
  }

  ngOnInit(): void {
    this.createChart();

    this.subscriptions.push(
      this.themesManagerService.currentTheme$.subscribe(() => {
        this.themeColors = this.themesManagerService.getThemeColorsRGBA(0.2);

        this.updateColors();
      }),
      this.sortingService.highlightSubject$.subscribe(
        async (highlightEvent) => {
          await this.highlightBar(
            highlightEvent.index,
            highlightEvent.unhighlight,
            highlightEvent.colorType
          );
          if (highlightEvent.needTrigger) this.sortingService.triggerNextStep();
          // Update chart or visualization based on highlightEvent if needed
        }
      ),
      this.sortingService.swapObservable$.subscribe(async (swapEvent) => {
        await this.swapValues(swapEvent.index1, swapEvent.index2);
        this.sortingService.triggerNextStep();
        // Update chart or visualization based on swapEvent if needed
      }),
      this.route.paramMap.subscribe((params) => {
        // You can access route parameters here
        this.sortAlgorithm = params.get('algorithm') || '';
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  updateInvertedSpeed(event: any): void {
    const maxSliderValue = 500;
    const minSliderValue = 1;
    this.animationDelay = maxSliderValue - this.animationScrollValue + minSliderValue;
    this.sortingService.setAnimationDelay(this.animationDelay);
  }

  async startSorting() {
    this.isSorting = true;  // Disable buttons during sorting

    let arr: Promise<number[]>;

    this.sortingService.startSorting();

    switch (this.sortAlgorithm) {
      case 'bubble-sort':
        arr = this.sortingService.bubbleSort([...this.data]);
        break;

      case 'insertion-sort':
        arr = this.sortingService.insertionSort([...this.data]);
        break;

      case 'selection-sort':
        arr = this.sortingService.selectionSort([...this.data]);
        break;

      case 'quick-sort':
        arr = this.sortingService.quickSort([...this.data]);
        break;

      default:
        arr = Promise.resolve([]);
        break;
    }

    await arr;

    if(this.sortingService.getCancelTrigger())
      this.unHighlightAllBars();
    else
      this.highlightAllBars();

    this.isSorting = false;  // Disable buttons during sorting
  }

  async unHighlightAllBars() {
    this.animationDelay = 0
    // Unhighlight all bars from start to end
    for (let i = 0; i < this.data.length; i++) {
      await this.highlightBar(i, true); // true to unhighlight
    }
  }

  async highlightAllBars() {
    this.animationDelay = 20
    // Unhighlight all bars from start to end
    for (let i = 0; i < this.data.length; i++) {
      await this.highlightBar(i, true); // true to unhighlight
    }
    // Highlight all bars from start to end
    for (let i = 0; i < this.data.length; i++) {
      await this.highlightBar(i, false); // false to highlight
    }
    // Unhighlight all bars from start to end
    for (let i = 0; i < this.data.length; i++) {
      await this.highlightBar(i, true); // true to unhighlight
    }
  }

  shuffleArray() {
    this.data = this.sortingService.shuffleArray(this.data);
    this.updateColors();
    this.chart.update();
  }

  updateColors(colors: string[] = this.colors) {

    // Conditionally update colors based on sorting state
    if (this.isSorting) {
      // If sorting, preserve the alpha value but change the RGB part (the color)
      this.colors = colors.map((color) => {
        // Extract the alpha value from the current color
        const alphaMatch = color.match(/rgba\((\d+), (\d+), (\d+), ([\d.]+)\)/);
        const alpha = alphaMatch ? alphaMatch[4] : '0.5'; // Default to 0.5 if no alpha is found
        const alphaNumber = parseFloat(alpha);
        if (alphaNumber > 0.5)
          color = this.themeColors?.accent || 'rgba(255, 99, 132, 0.5)';
        else
          color = this.themeColors?.primary || 'rgba(255, 99, 132, 0.5)';

        return color.replace(
          /rgba\((\d+), (\d+), (\d+), [\d.]+\)/,
          'rgba($1, $2, $3, ' + (alpha) + ')'
        );


      });



    } else {
      // If not sorting, update color and alpha value as per theme color
      this.colors = colors.map(
        (color) =>
          (color = this.themeColors?.primary || 'rgba(255, 99, 132, 0.5)')
      );

      // // Use regex to replace the alpha value in rgba with '1'
      this.chart.data.datasets[0].backgroundColor = this.colors;
      this.chart.data.datasets[0].borderColor = this.colors.map((color) =>
        color.replace(
          /rgba\((\d+), (\d+), (\d+), [\d.]+\)/,
          'rgba($1, $2, $3, 1)'
        )
      );
    }




    if (this.chart && this.chart.width) {
      // Perform operations that rely on chart width
      this.chart.update();
    } else {
      console.warn('Chart width is not yet available.');
    }
  }

  createChart() {
    this.chart = new Chart('MyChart', {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: '',
            data: this.data,
            backgroundColor: this.colors,
            borderColor: this.colors.map((color) => color.replace('0.5', '1')), // Make borders opaque
            borderWidth: 1,
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
        responsive: true,
        events: [],

        animation: {
          duration: 0, // Set duration for a smoother animation effect
          loop: false,

          onProgress: (animation) => {
            const meta = animation.chart.getDatasetMeta(0);

            if (meta && meta.data && this.index1 >= 0 && this.index2 >= 0) {
              const bar1 = meta.data[this.index1];
              const bar2 = meta.data[this.index2];

              // Initialize initial positions and distance only once at the start of the animation
              if (
                this.initialX1 === null &&
                this.initialX2 === null &&
                bar1 &&
                bar2
              ) {
                this.initialX1 = bar1.x;
                this.initialX2 = bar2.x;
                this.distance = this.initialX2 - this.initialX1;
                this.animationSteps = animation.numSteps; // Store the initial numSteps value
              }

              // Ensure initial values are set
              if (
                this.initialX1 !== null &&
                this.initialX2 !== null &&
                this.distance !== null &&
                this.animationSteps !== null
              ) {
                const progress = Math.min(
                  animation.currentStep / this.animationSteps,
                  1
                );

                // Use initial positions and distance to update bar positions smoothly
                bar1.x = this.initialX1 + this.distance * progress;
                bar2.x = this.initialX2 - this.distance * progress;
              }
            }
          },
          onComplete: () => {
            // Check if indices are valid before swapping
            if (this.index1 !== -1 && this.index2 !== -1) {
              // Perform the swap
              // Disable further animations
              [this.data[this.index1], this.data[this.index2]] = [
                this.data[this.index2],
                this.data[this.index1],
              ];

              // Reset indices after swap
              this.index1 = -1;
              this.index2 = -1;
              this.chart.options.animation.duration = 0;
            }

            // Reset initial values after animation completes
            this.initialX1 = null;
            this.initialX2 = null;
            this.distance = null;
            this.animationSteps = null;
          },
        },



        scales: {
          x: {
            grid: { display: false },
          },
          y: {
            display: false,
            grid: { display: false, lineWidth: 0 },
            ticks: { display: false },
          },
        },
        plugins: {
          legend: { display: false },
        },
      },
    });
  }

  highlightBar(
    index: number,
    unhighlight: boolean = false,
    colorType: string = 'accent'
  ): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {


        let highlightColor = this.themeColors!.accent.replace(
          /rgba\((\d+), (\d+), (\d+), [\d.]+\)/,
          'rgba($1, $2, $3, 0.8)'
        );


        switch (colorType) {
          case 'primary':
            highlightColor = this.themeColors!.primary.replace(
              /rgba\((\d+), (\d+), (\d+), [\d.]+\)/,
              'rgba($1, $2, $3, 0.8)'
            );
            break;
          case 'accent':
            highlightColor = this.themeColors!.accent.replace(
              /rgba\((\d+), (\d+), (\d+), [\d.]+\)/,
              'rgba($1, $2, $3, 0.8)'
            );
            break;
          case 'secondary':
            highlightColor = this.themeColors!.secondary.replace(
              /rgba\((\d+), (\d+), (\d+), [\d.]+\)/,
              'rgba($1, $2, $3, 0.5)'
            );
            break;
          case 'accent-light':
            highlightColor = this.themeColors!.accent.replace(
              /rgba\((\d+), (\d+), (\d+), [\d.]+\)/,
              'rgba($1, $2, $3, 0.4)'
            );
            break;
          default:
            highlightColor = this.themeColors!.accent.replace(
              /rgba\((\d+), (\d+), (\d+), [\d.]+\)/,
              'rgba($1, $2, $3, 0.8)'
            );
        }



        this.colors[index] = unhighlight ? this.themeColors!.primary : highlightColor;

        if (!unhighlight) {

          
          this.audioService.playSound(this.data[index]);

        }

        this.chart.data.datasets[0].backgroundColor = this.colors;
        this.chart.data.datasets[0].borderColor = this.colors.map((color) =>
          color.replace(
            /rgba\((\d+), (\d+), (\d+), [\d.]+\)/,
            'rgba($1, $2, $3, 1)'
          )
        );
        this.chart.update();
        // Resolve the Promise after colors are reset
        resolve();
      }, this.animationDelay);
    });
  }

  swapValues(index1: number, index2: number): Promise<void> {
    return new Promise((resolve) => {
      // Store the index of the bars being swapped
      this.index1 = index1;
      this.index2 = index2;

      // Define the highlight color for the swap animation
      const warnColor = this.themeColors!.warn;
      const highlightColor = warnColor.replace(
        /rgba\((\d+), (\d+), (\d+), [\d.]+\)/,
        'rgba($1, $2, $3, 0.7)'
      );

      // Step 1: Apply highlight color to both bars being swapped
      this.colors[index1] = highlightColor;
      this.colors[index2] = highlightColor;

      // Update the chart colors
      this.chart.data.datasets[0].backgroundColor = this.colors;
      this.chart.data.datasets[0].borderColor = this.colors.map((color) =>
        color.replace(
          /rgba\((\d+), (\d+), (\d+), [\d.]+\)/,
          'rgba($1, $2, $3, 1)'
        )
      );

      // Set the animation duration for the swap
      this.chart.options.animation.duration = this.animationDelay - 20;
      this.chart.update();

      // Step 2: Delay to make the highlight effect visible
      setTimeout(() => {
        // Perform the swap

        // Step 3: Reset colors after the swap is visually complete
        setTimeout(() => {
          // Restore original colors
          this.colors[index1] = this.themeColors!.primary;
          this.colors[index2] = this.themeColors!.primary;

          // Update chart colors and reset the animation duration to prevent any further animation
          this.chart.data.datasets[0].backgroundColor = this.colors;
          this.chart.data.datasets[0].borderColor = this.colors.map((color) =>
            color.replace(
              /rgba\((\d+), (\d+), (\d+), [\d.]+\)/,
              'rgba($1, $2, $3, 1)'
            )
          );

          this.chart.update();

          // Resolve the Promise after colors are reset
          resolve();
        }, this.animationDelay); // Use animationDelay here for color reset
      }, this.animationDelay); // Use animationDelay here for the initial swap
    });
  }

  formatLabel(value: number): string {
    if (value >= 500) {
      return 'Max Speed';
    }
    return 'Speed ' + 'x' + ((value) / 50 + 1);

  }

}
