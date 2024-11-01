import { Component } from '@angular/core';
import { CodeBlockComponent } from '../../../../shared/components/code-block/code-block.component';
import { TempExampleComponent } from '../../../../shared/components/temp-example/temp-example.component';
import { ChartAnimationComponent } from '../../../../shared/components/chart-animation/chart-animation.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dsa',
  standalone: true,
  imports: [CodeBlockComponent, TempExampleComponent, ChartAnimationComponent],
  templateUrl: './dsa.component.html',
  styleUrl: './dsa.component.scss',
})
export class DsaComponent {
  algorithm!: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Retrieve the algorithm from the route parameter
    this.route.paramMap.subscribe(params => {
      const algoName = params.get('algorithm');
      if (algoName) {
        this.algorithm = algoName;
      }
    });
  }

  getAlgorithmCode(): string {
    return this.algorithm ? this.algorithm : '';
  }

}

