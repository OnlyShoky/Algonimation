import { Component } from '@angular/core';
import {SharedMaterialModule} from '../../../../shared/material/shared-material.module';

@Component({
  selector: 'app-code-lang-button',
  standalone: true,
  imports: [SharedMaterialModule],
  templateUrl: './code-lang-button.component.html',
  styleUrl: './code-lang-button.component.scss'
})
export class CodeLangButtonComponent {

  
  currentTheme = '';
  defaultLanguage:string = 'python'

  theme= 'my_theme'
  isChecked = false;

  ngOnInit(): void {
    if (typeof document !== 'undefined') {
      const bodyClassList = document.body.classList;
      this.currentTheme = bodyClassList.item(1)  ?? '';
      console.log(this.currentTheme); // Muestra el valor seleccionado en la consola
    }
    
  }



  onFontStyleChange(value: string) {
    
 
    const bodyClassList = document.body.classList;
    this.currentTheme = bodyClassList.item(1)  ?? 'light-theme';
    console.log(this.currentTheme); // Muestra el valor seleccionado en la consola


    switch (value) {
      case 'python':
        document.body.classList.remove(this.currentTheme);
        document.body.classList.add('python-theme');
        break;
      case 'c':
        document.body.classList.remove(this.currentTheme);
        document.body.classList.add('c-theme');
        break;
      case 'js':
        document.body.classList.remove(this.currentTheme);
       document.body.classList.add('js-theme');
        break;
    }

  }
}


