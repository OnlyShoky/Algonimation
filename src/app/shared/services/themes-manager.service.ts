import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemesManagerService {
  private currentTheme: string = 'python-theme';
  private isDarkMode: boolean = false;
  private currentLanguage: string = 'python';


  // Crear un BehaviorSubject para el idioma
  private languageSubject = new BehaviorSubject<string>(this.currentLanguage);
  currentLanguage$ = this.languageSubject.asObservable();

  // Método para alternar entre temas claros y oscuros
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.switchLanguageTheme(this.currentLanguage);
    this.switchCodeBlockTheme(this.isDarkMode);

    console.log(' ThemesManagerService: toggleDarkMode: ' + this.isDarkMode);
  }

  switchLanguage(language: string) {
    this.currentLanguage = language;
    this.languageSubject.next(language); // Notifica el cambio

    console.log(
      ' ThemesManagerService: switchLanguage: ' + this.currentLanguage)
  }

  // Cambia el tema actual
  switchTheme(theme: string) {
    document.body.classList.remove(this.currentTheme);
    this.currentTheme = theme;
    document.body.classList.add(this.currentTheme);
  }

  switchCodeBlockTheme(isDarkMode: boolean) {
    if(isDarkMode) {
      
      document.body.classList.remove("prism-theme");
      document.body.classList.add("prism-tomorrow-theme");
      return;
    }
    document.body.classList.remove("prism-tomorrow-theme");
    document.body.classList.add("prism-theme");

  }

  // Cambia el tema basado en el lenguaje
  switchLanguageTheme(language: string) {
    const themeMap: { [key: string]: string } = {
      python: this.isDarkMode ? 'python-dark-theme' : 'python-theme',
      cpp: this.isDarkMode ? 'cpp-dark-theme' : 'cpp-theme',
      js: this.isDarkMode ? 'js-dark-theme' : 'js-theme',
    };
    
    this.switchLanguage(language);
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
