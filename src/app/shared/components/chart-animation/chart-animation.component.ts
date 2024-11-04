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
import {MatIconModule} from '@angular/material/icon';


@Component({
  selector: 'app-chart-animation',
  standalone: true,
  imports: [MatButtonModule, FormsModule, MatSliderModule,MatIconModule],
  templateUrl: './chart-animation.component.html',
  styleUrls: ['./chart-animation.component.scss'],
})
export class ChartAnimationComponent implements OnInit, OnDestroy {
  @Input() sortAlgorithm!: string;

  private subscriptions: Subscription[] = [];
  public chart: any;
  public labels: string[] = [];
  public colors: string[] = [];
  public data: number[] = [];

  public animationDelay: number = 300; // Default delay in milliseconds

  public themeColors:
    | { primary: string; accent: string; warn: string }
    | undefined;
  index1: number = -1;
  index2: number = -1;

  constructor(
    private themesManagerService: ThemesManagerService,
    private sortingService: SortingService,
    private audioService: AudioService,
    private route: ActivatedRoute
  ) {
    this.data = this.sortingService.getValues();
    // Generate labels from 0 to the length of data
    this.labels = this.data.map((_, index) => index.toString());

    // Generate RGBA colors based on the size of the data
    this.colors = this.data.map((_, index) => {
      const alpha = 1 - index / this.data.length; // Decrease opacity with index
      return `rgba(255, 255, 255, ${alpha})`; // White color with decreasing opacity
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
            highlightEvent.unhighlight
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

  async startSorting() {
    let arr: Promise<number[]>;

    console.log('Starting sorting...');
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

      default:
        console.log('Invalid sort algorithm');
        arr = Promise.resolve([]);
        break;
    }

    const sortedArray = await arr;
    console.log('Sorted Array:', sortedArray);
    this.highlightAllBars();
    console.log('Sorting completed.');
  }

  async highlightAllBars() {
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
    // Update colors with the primary theme color or default color if not set
    this.colors = colors.map(
      (color) =>
        (color = this.themeColors?.primary || 'rgba(255, 99, 132, 0.5)')
    );

    // Use regex to replace the alpha value in rgba with '1'
    this.chart.data.datasets[0].backgroundColor = this.colors;
    this.chart.data.datasets[0].borderColor = this.colors.map((color) =>
      color.replace(
        /rgba\((\d+), (\d+), (\d+), [\d.]+\)/,
        'rgba($1, $2, $3, 1)'
      )
    );

    if (this.chart && this.chart.width) {
      // Perform operations that rely on chart width
      this.chart.update();
    } else {
      console.warn('Chart width is not yet available.');
    }
  }

  // Define variables to store initial positions and distance for swapping
  private initialX1: number | null = null;
  private initialX2: number | null = null;
  private distance: number | null = null;

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
        animation: {
          duration: 0, // Set duration for a smoother animation effect
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
              }

              // Ensure initial values are set
              if (
                this.initialX1 !== null &&
                this.initialX2 !== null &&
                this.distance !== null
              ) {
                const progress = animation.currentStep / animation.numSteps;

                // Use initial positions and distance to update bar positions smoothly
                bar1.x = this.initialX1 + this.distance * progress;
                bar2.x = this.initialX2 - this.distance * progress;
              }
            }
          },
          onComplete: () => {
            // Reset initial values after animation completes
            this.initialX1 = null;
            this.initialX2 = null;
            this.distance = null;
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

  highlightBar(index: number, unhighlight: boolean = false): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const accentColor = this.themeColors!.accent;
        const highlightColor = accentColor.replace(
          /rgba\((\d+), (\d+), (\d+), [\d.]+\)/,
          'rgba($1, $2, $3, 0.7)'
        );

        this.colors[index] = unhighlight
          ? this.themeColors!.primary
          : highlightColor;

        if (!unhighlight)
          this.audioService.playCoinSound(this.data[index] * 100);

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
      console.log('Swapping indices:', this.index1, this.index2);

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
      this.chart.options.animation.duration = this.animationDelay - 10;
      this.chart.update();

      // Step 2: Delay to make the highlight effect visible
      setTimeout(() => {
        // Perform the swap
        this.chart.options.animation.duration = 0; // Disable further animations
        this.chart.update();

        [this.data[index1], this.data[index2]] = [
          this.data[index2],
          this.data[index1],
        ];
        this.chart.update();

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

          this.index1 = -1;
          this.index2 = -1;

          this.chart.update();

          // Resolve the Promise after colors are reset
          resolve();
        }, this.animationDelay); // Use animationDelay here for color reset
      }, this.animationDelay); // Use animationDelay here for the initial swap
    });
  }
}
