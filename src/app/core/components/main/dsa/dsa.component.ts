import { Component } from '@angular/core';
import { CodeBlockComponent } from '../../../../shared/components/code-block/code-block.component';
import { TempExampleComponent } from '../../../../shared/components/temp-example/temp-example.component';
import { ChartAnimationComponent } from '../../../../shared/components/chart-animation/chart-animation.component';
import { ActivatedRoute } from '@angular/router';
import { AlgorithmService } from '../../../../shared/services/algorithm.service';
import { Algorithm } from '../../../../shared/models/algorithm';

@Component({
  selector: 'app-dsa',
  standalone: true,
  imports: [CodeBlockComponent, TempExampleComponent, ChartAnimationComponent],
  templateUrl: './dsa.component.html',
  styleUrl: './dsa.component.scss',
})
export class DsaComponent {
  algorithm!: Algorithm;

  constructor(private route: ActivatedRoute, private algorithmService: AlgorithmService) { }

  ngOnInit(): void {
    // Retrieve the algorithm from the route parameter
    this.route.paramMap.subscribe(params => {
      const algoName = params.get('algorithm');
      if (algoName) {
        this.algorithm = this.algorithmService.getAlgorithmByName(algoName) || {
          name: '',
          description: '',
          code: { cpp: '', python: '', javascript: '' },
          deltaLine: { cpp: 0, python: 0, javascript: 0 },
        };

      }
    });
  }

  getAlgorithmCode(): string {
    return this.algorithm ? this.algorithm.name : '';
  }

}

