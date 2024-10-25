import { Component } from '@angular/core';
import { SharedMaterialModule } from '../../../shared/material/shared-material.module';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [SharedMaterialModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {}
