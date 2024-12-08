import { Component } from '@angular/core';
import { CodeBlockComponent } from '../../../../shared/components/code-block/code-block.component';
import { ChartAnimationComponent } from '../../../../shared/components/chart-animation/chart-animation.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlgorithmService } from '../../../../shared/services/algorithm.service';
import { Algorithm } from '../../../../shared/models/algorithm';
import { CommonModule } from '@angular/common';
import { SharedMaterialModule } from '../../../../shared/material/shared-material.module';
import { SortingService } from '../../../../shared/services/sorting.service';

@Component({
  selector: 'app-dsa',
  standalone: true,
  imports: [CodeBlockComponent, ChartAnimationComponent, CommonModule, SharedMaterialModule],
  templateUrl: './dsa.component.html',
  styleUrl: './dsa.component.scss',
})
export class DsaComponent {
  algorithm!: Algorithm;
  algorithmNotFound = false;



  constructor(private route: ActivatedRoute, private algorithmService: AlgorithmService, private router: Router, private sortingService: SortingService) { }




  ngOnInit(): void {

    // Retrieve the algorithm from the route parameter
    this.route.paramMap.subscribe(params => {
      const algoName = params.get('algorithm');
      if (algoName) {
        this.loadAlgorithmContent(algoName);
        this.sortingService.cancelSorting();
      } else {
        this.router.navigate(['/404']);

        console.error('Algorithm not found');
        this.algorithmNotFound = true;
      }
    });
  }

  goTo404Page() {
    this.router.navigate(['/404']);
  }

  loadAlgorithmContent(algorithmName: string) {
    // Load the content for the specific algorithm, like bubble sort, etc.
    this.algorithm = this.algorithmService.getAlgorithmByName(algorithmName) || {
      name: '',
      category: '',
      description: '',
      code: { cpp: '', python: '', javascript: '' },
      deltaLine: { cpp: 0, python: 0, javascript: 0 },
    };
  }


  getAlgorithmCode(): string {
    return this.algorithm ? this.algorithm.name : '';
  }

}

