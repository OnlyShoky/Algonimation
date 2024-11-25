import { Component } from '@angular/core';
import { SharedMaterialModule } from '../../../../shared/material/shared-material.module';
import { AlgorithmService } from '../../../../shared/services/algorithm.service';
import { RouterLink } from '@angular/router';
import { Algorithm } from '../../../../shared/models/algorithm';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [SharedMaterialModule, RouterLink],
  templateUrl: './intro.component.html',
  styleUrl: './intro.component.scss'
})
export class IntroComponent {
getSpaceComplexity(_t70: string) {
throw new Error('Method not implemented.');
}
getBestCaseTimeComplexity(_t70: string) {
throw new Error('Method not implemented.');
}

  algoNames : string[] = [];
  algorithms: Algorithm[] = [];


    constructor(algorithmService: AlgorithmService) {
      
      this.algoNames = algorithmService.getAllAlgorithmNames();
      this.algorithms = algorithmService.getAlgorithms();
      
     }

}
