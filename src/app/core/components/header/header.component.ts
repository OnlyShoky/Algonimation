import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {

  currentTheme = 'indigo-pink.css';

  toggleTheme() {
    const themeLink = document.getElementById('theme-link') as HTMLLinkElement;
    console.log(this.currentTheme);
    if (this.currentTheme === 'deeppurple-amber.css') {
      this.currentTheme = 'indigo-pink.css';
    } else {
      this.currentTheme = 'deeppurple-amber.css';
    }
    themeLink.href = `/assets/themes/${this.currentTheme}`;
  }
}
