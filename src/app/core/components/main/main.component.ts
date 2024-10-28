import { Component } from '@angular/core';
import { SharedMaterialModule } from '../../../shared/material/shared-material.module';
import { TempExampleComponent } from '../../../shared/components/temp-example/temp-example.component';
import { CommonModule } from '@angular/common';
import { NavComponent } from "./nav/nav.component";


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    SharedMaterialModule,
    TempExampleComponent,
    CommonModule,
    NavComponent
],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent  {
  
}