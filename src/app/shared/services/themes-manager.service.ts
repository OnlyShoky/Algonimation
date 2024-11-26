import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})


export class ThemesManagerService {

  private currentTheme: string = 'python-theme';
  private isDarkMode: boolean = false;
  private currentLanguage: string = 'python';

  // Create a BehaviorSubject for the language
  private languageSubject = new BehaviorSubject<string>(this.currentLanguage);
  currentLanguage$ = this.languageSubject.asObservable();

  // Create a BehaviorSubject for the language
  private themeSubject = new BehaviorSubject<string>(this.currentTheme);
  currentTheme$ = this.themeSubject.asObservable();




  // Define theme colors
  private themeColors: {
    [key: string]: { primary: string; accent: string; secondary: string; warn: string };
  } = {
      'python-theme': {
        primary: '#A8D5BA',
        accent: '#69F0AE',
        secondary: '#FEFFA7',
        warn: '#FF5252',
      },
      'python-dark-theme': {
        primary: '#005A32',
        accent: '#69F0AE',
        secondary: '#FFE700',
        warn: '#D32F2F',
      },
      'cpp-theme': {
        primary: '#A1C4E9',
        accent: '#448AFF',
        secondary: '#FEFFA7',
        warn: '#FF5252',
      },
      'cpp-dark-theme': {
        primary: '#0D47A1',
        accent: '#2962FF',
        secondary: '#FFE700',
        warn: '#D32F2F',
      },
      'js-theme': {
        primary: '#fad643',
        accent: '#ff6e40',
        secondary: '#BCF2F6',
        warn: '#FF5252',
      },
      'js-dark-theme': { primary: '#FFA000', accent: '#FF6D00', secondary: '#08C2FF', warn: '#D32F2F' },
    };

  initTheme(): void {
    if (typeof window != 'undefined' && document.readyState === 'complete') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark)
        this.toggleDarkMode();

        document.body.style.visibility = 'visible';
        document.body.style.opacity = '1';
    }
  }

  // Toggle dark mode
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.switchLanguageTheme(this.currentLanguage);
    this.switchCodeBlockTheme(this.isDarkMode);
  }

  switchLanguage(language: string) {
    this.currentLanguage = language;
    this.languageSubject.next(language);
  }

  // Switch current theme
  switchTheme(theme: string) {
    document.body.classList.remove(this.currentTheme);
    this.currentTheme = theme;
    this.themeSubject.next(this.currentTheme);
    document.body.classList.add(this.currentTheme);
  }

  switchCodeBlockTheme(isDarkMode: boolean) {
    if (isDarkMode) {
      document.body.classList.remove('prism-theme');
      document.body.classList.add('prism-tomorrow-theme');
      return;
    }
    document.body.classList.remove('prism-tomorrow-theme');
    document.body.classList.add('prism-theme');
  }

  // Switch theme based on language
  switchLanguageTheme(language: string) {
    const themeMap: { [key: string]: string } = {
      python: this.isDarkMode ? 'python-dark-theme' : 'python-theme',
      cpp: this.isDarkMode ? 'cpp-dark-theme' : 'cpp-theme',
      js: this.isDarkMode ? 'js-dark-theme' : 'js-theme',
    };
    this.switchTheme(themeMap[language] || 'light-theme');
    this.switchLanguage(language);
  }

  getCurrentTheme(): string {
    return this.currentTheme;
  }

  getIsDarkMode(): boolean {
    return this.isDarkMode;
  }

  // Function to get the current colors based on the theme
  getThemeColors():
    | { primary: string; accent: string; warn: string }
    | undefined {
    return this.themeColors[this.currentTheme];
  }
  // Function to get current theme colors in RGBA format
  getThemeColorsRGBA(
    alpha: number = 1
  ): { primary: string; accent: string; secondary: string; warn: string } | undefined {
    console.log('RGBA : currenttheme : ', this.currentTheme);
    const colors = this.themeColors[this.currentTheme];
    if (colors) {
      return {
        primary: hexToRgba(colors.primary, alpha),
        accent: hexToRgba(colors.accent, alpha),
        secondary: hexToRgba(colors.secondary, alpha),
        warn: hexToRgba(colors.warn, alpha),
      };
    }
    return undefined;
  }
}

// Utility function to convert hex to RGBA
function hexToRgba(hex: string, alpha: number = 1): string {
  // Remove the hash at the start if it's there
  hex = hex.replace(/^#/, '');

  // Parse the r, g, b values
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Return the rgba color string
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
