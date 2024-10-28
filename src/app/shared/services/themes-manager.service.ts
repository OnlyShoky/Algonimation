import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemesManagerService {
  private currentTheme: string = 'python-theme';
  private isDarkMode: boolean = false;
  private currentLanguage: string = 'python';

  constructor() {}

  // Método para alternar entre temas claros y oscuros
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.switchLanguageTheme(this.currentLanguage);

    console.log(' ThemesManagerService: toggleDarkMode: ' + this.isDarkMode);
  }

  // Cambia el tema actual
  switchTheme(theme: string) {
    document.body.classList.remove(this.currentTheme);
    this.currentTheme = theme;
    document.body.classList.add(this.currentTheme);
  }

  // Cambia el tema basado en el lenguaje
  switchLanguageTheme(language: string) {
    const themeMap: { [key: string]: string } = {
      python: this.isDarkMode ? 'python-dark-theme' : 'python-theme',
      c: this.isDarkMode ? 'c-dark-theme' : 'c-theme',
      js: this.isDarkMode ? 'js-dark-theme' : 'js-theme',
    };
    this.switchTheme(themeMap[language] || 'light-theme');

    this.currentLanguage = language;

    console.log(
      ' ThemesManagerService: switchLanguageTheme: ' +
        themeMap +
        ' - ' +
        themeMap[language]
    );
    console.log(
      ' ThemesManagerService: switchLanguageTheme: ' + this.currentTheme
    );
  }

  getCurrentTheme(): string {
    console.log('ThemesManagerService: getCurrentTheme: ' + this.currentTheme);
    return this.currentTheme;
  }

  getIsDarkMode(): boolean {
    return this.isDarkMode;
  }
}
