import { Component } from '@angular/core';
import { SharedMaterialModule } from '../../material/shared-material.module';

@Component({
  selector: 'app-temp-example',
  standalone: true,
  imports: [SharedMaterialModule],
  templateUrl: './temp-example.component.html',
  styleUrl: './temp-example.component.scss'
})
export class TempExampleComponent {

}
