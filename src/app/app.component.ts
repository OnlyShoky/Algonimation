import { Component } from '@angular/core';
import { HeaderComponent} from './core/components/header/header.component';
import { FooterComponent } from "./core/components/footer/footer.component";
import { MainComponent } from "./core/components/main/main.component";




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    MainComponent,

],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Algonimation';

  showFiller = true;



}
