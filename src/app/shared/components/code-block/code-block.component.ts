import {  Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemesManagerService } from '../../services/themes-manager.service';

declare var Prism: any;

@Component({
  selector: 'app-code-block',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './code-block.component.html',
  styleUrl: './code-block.component.scss',
})
export class CodeBlockComponent implements OnInit {
  dataLine: string = '1'; // Default data-line value
  codeClass: string = 'language-python'; // Default class
  codeText: string =
    '\tprint("Hello, World!")\n\tprint("Goodbye, World!")\n\tprint("Goodbye, World!")\n\tprint("Goodbye, World!")\n\tprint("Goodbye, World!")\n\tprint("Goodbye, World!")'; // Default code text with tabs

  codePython = `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]`;

  codeC = `#include <iostream>
    using namespace std;

    void bubbleSort(int arr[], int n) {
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    swap(arr[j], arr[j + 1]);
                }
            }
        }
    }`;

  codeJS = `function bubbleSort(arr) {
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap arr[j] and arr[j+1]
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}`;

  highlightedCode!: string;

  constructor(private themesManagerService: ThemesManagerService) {}

  ngOnInit() {
    const code = this.codePython;
    this.highlightedCode = Prism.highlight(
      code,
      Prism.languages.python,
      'python'
    );

    this.themesManagerService.currentLanguage$.subscribe((language: string) => {
      this.updateCodeBlock(language);
    });
  }

  changeDataLine(line: number) {
    this.dataLine = line.toString();
    requestAnimationFrame(() => {
      Prism.highlightAll();
    });
  }

  updateCodeBlock(newClass: string) {
    console.log(" updateCodeBlock: ",newClass);
    this.codeClass = "language-" + newClass;

    switch (newClass) {
      case 'python':
        this.codeText = this.codePython;

        this.highlightedCode = Prism.highlight(
          this.codeText,
          Prism.languages.python,
          'python'
        );

        break;
      case 'cpp':
        this.codeText = this.codeC;

        this.highlightedCode = Prism.highlight(
          this.codeText,
          Prism.languages.cpp,
          'cpp'
        );

        break;
      case 'js':
        this.codeText = this.codeJS;

        this.highlightedCode = Prism.highlight(
          this.codeText,
          Prism.languages.javascript,
          'javascript'
        );

        break;
    }
    requestAnimationFrame(() => {
      Prism.highlightAll();
    });
    console.log(this.codeClass);
  }

  changeText(newText: string) {
    console.log(newText);
    this.codeText = newText;
    Prism.highlightAll();
  }
}
