import { Component, OnInit, HostListener, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ThemesManagerService } from '../../services/themes-manager.service';
import { Subscription } from 'rxjs';
import { SortingService } from '../../services/sorting.service';
import { AlgorithmService } from '../../services/algorithm.service';
import { Algorithm } from '../../models/algorithm';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

declare var Prism: any;

@Component({
  selector: 'app-code-block',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './code-block.component.html',
  styleUrl: './code-block.component.scss',
})
export class CodeBlockComponent implements OnInit {
  async loadPrism() {
    if (typeof Prism === 'undefined') {
      await import('prismjs');
    }
  }
  @Input() sortAlgorithm!: string;
  private _snackBar = inject(MatSnackBar);

  private subscriptions: Subscription[] = [];
  public lineAnimationDelay: number = 10; // Default delay in milliseconds

  dataLine: string = '1'; // Default data-line value
  codeClass: string = 'language-python'; // Default class
  currentLanguage = 'python';
  deltaLine: number = 0;
  codeText: string = 'print("Hello, World!")'; // Default code text

  codePython = `import random

    def bogosort(arr):
        while not is_sorted(arr):
            random.shuffle(arr)
        return arr
    
    def is_sorted(arr):
        return all(arr[i] <= arr[i + 1] for i in range(len(arr) - 1))`;

  codeC = `#include <iostream>
#include <vector>
#include <algorithm>
#include <random>

bool is_sorted(const std::vector<int>& arr) {
    for (size_t i = 1; i < arr.size(); ++i) {
        if (arr[i] < arr[i - 1]) return false;
    }
    return true;
}

void bogosort(std::vector<int>& arr) {
    std::random_device rd;  // Random number generator
    while (!is_sorted(arr)) {
        std::shuffle(arr.begin(), arr.end(), rd);
    }
}`;

  codeJS = `function isSorted(arr) {
  for (let i = 1; i < arr.length; i++) {
      if (arr[i] < arr[i - 1]) return false;
  }
  return true;
}

function bogosort(arr) {
  while (!isSorted(arr)) {
      arr.sort(() => Math.random() - 0.5);
  }
  return arr;
}`;

  algorithm: Algorithm | undefined;

  highlightedCode!: string;

  constructor(
    private themesManagerService: ThemesManagerService,
    private sortingService: SortingService,
    private algorithmService: AlgorithmService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {



    this.algorithm = this.algorithmService.getAlgorithmByName(
      this.sortAlgorithm
    );

    if (this.algorithm) {
      this.codeC = this.algorithm?.code.cpp;
      this.codeJS = this.algorithm?.code.javascript;
      this.codePython = this.algorithm?.code.python;
    } else {
      console.error('Algorithm not found');
      this.router.navigate(['/404']);

    }

    if (typeof window !== 'undefined') {
      // Code that uses Prism.js
      const code = this.codePython;
      this.highlightedCode = Prism.highlight(
        code,
        Prism.languages.python,
        'python'
      );
    }

    this.subscriptions.push(
      this.themesManagerService.currentLanguage$.subscribe(
        (language: string) => {
          this.currentLanguage = language;
          this.updateCodeBlock(language);
        }
      ),
      this.sortingService.linePointerSubject$.subscribe(
        async (lineEvent: number) => {
          await this.changeDataLine(lineEvent);
          this.sortingService.triggerNextStep();
        }
      ),
      this.sortingService.delaySubject$.subscribe(
        async (delay: number) => {

          this.lineAnimationDelay = delay;
        }
      ),
      this.route.paramMap.subscribe((params) => {
        // You can access route parameters here
        const algorithm = params.get('algorithm') || ''; // or any parameter you're using
        this.algorithm = this.algorithmService.getAlgorithmByName(algorithm);


        if (this.algorithm) {
          this.codeC = this.algorithm?.code.cpp;
          this.codeJS = this.algorithm?.code.javascript;
          this.codePython = this.algorithm?.code.python;
        } else {
          console.error('Algorithm not found');
        }
        this.updateCodeBlock(this.currentLanguage);
      })
    );

  }

  changeDataLine(line: number): Promise<void> {
    line += this.deltaLine;
    return new Promise((resolve) => {
      setTimeout(() => {
        this.dataLine = line.toString();
        requestAnimationFrame(() => {
          Prism.highlightAll();
        });
        resolve();
      }, this.lineAnimationDelay);
    });
  }

  updateCodeBlock(newClass: string) {
    if (typeof Prism == 'undefined') {
      console.warn('Prism is still not defined after import');
      return;
    }
    this.codeClass = 'language-' + newClass;

    switch (newClass) {
      case 'python':
        this.codeText = this.codePython;
        this.deltaLine = this.algorithm?.deltaLine.python || 0;

        this.highlightedCode = Prism.highlight(
          this.codeText,
          Prism.languages.python,
          'python'
        );

        break;
      case 'cpp':
        this.codeText = this.codeC;
        this.deltaLine = this.algorithm?.deltaLine.cpp || 0;
        this.highlightedCode = Prism.highlight(
          this.codeText,
          Prism.languages.cpp,
          'cpp'
        );

        break;
      case 'js':
        this.codeText = this.codeJS;
        this.deltaLine = this.algorithm?.deltaLine.javascript || 0;
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

  }

  changeText(newText: string) {

    this.codeText = newText;
    Prism.highlightAll();
  }

  @HostListener('window:resize')
  onWindowResize() {
    // Execute Prism.highlightAll() on window resize or zoom change
    Prism.highlightAll();

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.codeText).then(
      () => {
        this.openSnackBar('Code copied!', 'Close');
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000, // Duration in milliseconds (2 seconds)

    });
  }
}

