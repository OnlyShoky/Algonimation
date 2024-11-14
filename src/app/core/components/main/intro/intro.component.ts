import { Component } from '@angular/core';
import { SharedMaterialModule } from '../../../../shared/material/shared-material.module';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [SharedMaterialModule],
  templateUrl: './intro.component.html',
  styleUrl: './intro.component.scss'
})
export class IntroComponent {

}
