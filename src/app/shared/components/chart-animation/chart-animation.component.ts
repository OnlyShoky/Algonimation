import {
  AfterViewInit,
  Component,
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

@Component({
  selector: 'app-chart-animation',
  standalone: true,
  imports: [MatButtonModule, FormsModule],
  templateUrl: './chart-animation.component.html',
  styleUrls: ['./chart-animation.component.scss'],
})
export class ChartAnimationComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  public chart: any;
  public labels: string[] = [];
  public colors: string[] = [];
  public data: number[] = [];

  public swapDelay: number = 300; // Default delay in milliseconds

  public themeColors:
    | { primary: string; accent: string; warn: string }
    | undefined;

  constructor(
    private themesManagerService: ThemesManagerService,
    private sortingService: SortingService
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
      this.sortingService.swapObservable$.subscribe(async (swapEvent) => {
        await this.swapValues(swapEvent.index1, swapEvent.index2);
        this.sortingService.triggerNextStep();
        // Update chart or visualization based on swapEvent if needed
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  startSorting() {
    this.sortingService.bubbleSort([...this.data]);
  }

  shuffleArray() {
    this.data = this.sortingService.shuffleArray(this.data);
    this.chart.update();
  }

  updateColors(colors: string[] = this.colors) {
    // Update colors with the primary theme color or default color if not set
    this.colors = colors.map(
      (color) => this.themeColors?.primary || 'rgba(255, 99, 132, 0.5)'
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

        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            display: false,
            grid: {
              display: false,
              lineWidth: 0,
            },
            ticks: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  swapValues(index1: number, index2: number): Promise<void> {
    return new Promise((resolve) => {
      // Define the highlight color for the swap animation
      const accentColor = this.themeColors!.warn;
      const highlightColor = accentColor.replace(
        /rgba\((\d+), (\d+), (\d+), [\d.]+\)/,
        'rgba($1, $2, $3, 0.7)'
      );

      // Step 1: Apply highlight color to both bars being swapped
      this.colors[index1] = highlightColor;
      this.colors[index2] = highlightColor;

      // Update the background and border colors for the chart
      this.chart.data.datasets[0].backgroundColor = this.colors;
      this.chart.data.datasets[0].borderColor = this.colors.map((color) =>
        color.replace(
          /rgba\((\d+), (\d+), (\d+), [\d.]+\)/,
          'rgba($1, $2, $3, 1)'
        )
      );
      this.chart.update();

      // Step 2: Delay to make the highlight effect visible
      setTimeout(() => {
        // Swap values in the data array
        [this.data[index1], this.data[index2]] = [
          this.data[index2],
          this.data[index1],
        ];

        // Update the chart data to show the swapped positions
        this.chart.update();

        // Step 3: Restore original colors with a slight delay for the swap effect
        setTimeout(() => {
          // Restore to original theme colors
          this.colors[index1] = this.themeColors!.primary;
          this.colors[index2] = this.themeColors!.primary;

          // Update the background and border colors for the chart
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
        }, this.swapDelay); // Use swapDelay here for color reset
      }, this.swapDelay); // Use swapDelay here for the initial swap
    });
  }
}
