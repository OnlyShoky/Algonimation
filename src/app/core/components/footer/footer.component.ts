import { Component } from '@angular/core';
import { DarkmodeToggleComponent } from '../../../shared/components/darkmode-toggle/darkmode-toggle.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [DarkmodeToggleComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

}
