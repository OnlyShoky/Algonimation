import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {SharedMaterialModule} from '../../../shared/material/shared-material.module';

import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { CodeLangButtonComponent } from "./code-lang-button/code-lang-button.component";



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    SharedMaterialModule,
    CommonModule,
    CodeLangButtonComponent
],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})



export class HeaderComponent implements OnInit {

  currentTheme = '';
  defaultLanguage:string = 'python'

  theme= 'my_theme'
  isChecked = false;



  constructor() { }

  @ViewChild('darkModeSwitch', { read: ElementRef }) element: ElementRef | undefined;


  sun = 'M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm40-83q119-15 199.5-104.5T800-480q0-123-80.5-212.5T520-797v634Z'
  moon ='M12 21q-3.75 0-6.375-2.625T3 12q0-3.75 2.625-6.375T12 3q.2 0 .425.013 .225.013 .575.038-.9.8-1.4 1.975-.5 1.175-.5 2.475 0 2.25 1.575 3.825Q14.25 12.9 16.5 12.9q1.3 0 2.475-.463T20.95 11.15q.025.3 .038.488Q21 11.825 21 12q0 3.75-2.625 6.375T12 21Zm0-1.5q2.725 0 4.75-1.687t2.525-3.963q-.625.275-1.337.412Q17.225 14.4 16.5 14.4q-2.875 0-4.887-2.013T9.6 7.5q0-.6.125-1.287.125-.687.45-1.562-2.45.675-4.062 2.738Q4.5 9.45 4.5 12q0 3.125 2.188 5.313T12 19.5Zm-.1-7.425Z'

  ngAfterViewInit() {
    if (this.element){
      this.element.nativeElement.querySelector('.mdc-switch__icon--on').firstChild.setAttribute('d', this.moon);
      this.element.nativeElement.querySelector('.mdc-switch__icon--off').firstChild.setAttribute('d', this.sun);
    }
  }


  ngOnInit(): void {

    
  }


  onToggleChange(event: MatSlideToggleChange) {
    this.isChecked = event.checked;
  }


}
