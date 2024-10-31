import { Component, OnInit } from '@angular/core';
import { SharedMaterialModule } from '../../material/shared-material.module';
import { SortingService } from '../../services/sorting.service';

@Component({
  selector: 'app-temp-example',
  standalone: true,
  imports: [SharedMaterialModule],
  templateUrl: './temp-example.component.html',
  styleUrl: './temp-example.component.scss'
})
export class TempExampleComponent implements OnInit {
  sortedValues: number[] = [];
  shuffledValues: number[] = [];
  
  constructor(private sortingService: SortingService) {}

  ngOnInit() {

  }
}
