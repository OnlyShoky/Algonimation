import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ThemesManagerService } from '../../services/themes-manager.service';
import { distinctUntilChanged } from 'rxjs/operators';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-chart-animation',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './chart-animation.component.html',
  styleUrls: ['./chart-animation.component.scss'],
})
export class ChartAnimationComponent implements OnInit {
  public chart: any;
  public labels: string[] = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
  ];
  public colors: string[] = [
    'rgba(255, 99, 132, 0.5)',
    'rgba(255, 159, 64, 0.5)',
    'rgba(255, 205, 86, 0.5)',
    'rgba(75, 192, 192, 0.5)',
    'rgba(54, 162, 235, 0.5)',
    'rgba(153, 102, 255, 0.5)',
    'rgba(201, 203, 207, 0.5)',
    'rgba(255, 99, 132, 0.5)',
    'rgba(255, 159, 64, 0.5)',
    'rgba(255, 205, 86, 0.5)',
    'rgba(75, 192, 192, 0.5)',
    'rgba(54, 162, 235, 0.5)',
    'rgba(153, 102, 255, 0.5)',
    'rgba(201, 203, 207, 0.5)',
    'rgba(255, 99, 132, 0.5)',
    'rgba(255, 159, 64, 0.5)',
    'rgba(255, 205, 86, 0.5)',
  ];
  public data: number[] = [
    65, 59, 80, 81, 56, 55, 40, 48, 60, 72, 64, 76, 68, 52, 44, 58, 62,
  ];

  public themeColors:
    | { primary: string; accent: string; warn: string }
    | undefined;

  constructor(private themesManagerService: ThemesManagerService) {}

  ngOnInit(): void {
    this.createChart();
    this.themesManagerService.currentTheme$
      .pipe(distinctUntilChanged())
      .subscribe(() => {

        this.themeColors = this.themesManagerService.getThemeColorsRGBA(0.2);
        this.updateColors();
      });
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
    this.chart.update();
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

  swapValues(index1: number, index2: number) {
    // Define the highlight color for the swap animation
    const accentColor = this.themeColors!.accent; // Assuming accent is in RGBA format
    const highlightColor = accentColor.replace(/rgba\((\d+), (\d+), (\d+), [\d.]+\)/, 'rgba($1, $2, $3, 0.7)'); // Change opacity to 0.7    
    console.log('highlightColor :', highlightColor);
    
    // Step 1: Apply highlight color to both bars being swapped
    this.colors[index1] = highlightColor;
    this.colors[index2] = highlightColor;
  
    // Update the background and border colors for the chart
    this.chart.data.datasets[0].backgroundColor = this.colors;
    this.chart.data.datasets[0].borderColor = this.colors.map((color) =>
      color.replace(/rgba\((\d+), (\d+), (\d+), [\d.]+\)/, 'rgba($1, $2, $3, 1)')
    );
    this.chart.update();
  
    // Step 2: Delay to make the highlight effect visible
    setTimeout(() => {
      // Swap values in the data array
      [this.data[index1], this.data[index2]] = [this.data[index2], this.data[index1]];
  
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
          color.replace(/rgba\((\d+), (\d+), (\d+), [\d.]+\)/, 'rgba($1, $2, $3, 1)')
        );
         this.chart.update();
      }, 300); // Delay before resetting colors for visibility
  
    }, 300); // Delay to let the highlight color show before the swap
  }
  
  
  
}
