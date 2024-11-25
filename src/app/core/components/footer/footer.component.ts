import { Component } from '@angular/core';
import { DarkmodeToggleComponent } from '../../../shared/components/darkmode-toggle/darkmode-toggle.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [DarkmodeToggleComponent, MatButtonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

}
