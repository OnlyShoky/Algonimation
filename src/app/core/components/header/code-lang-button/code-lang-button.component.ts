import { Component } from '@angular/core';
import { SharedMaterialModule } from '../../../../shared/material/shared-material.module';
import { ThemesManagerService } from '../../../../shared/services/themes-manager.service';

@Component({
  selector: 'app-code-lang-button',
  standalone: true,
  imports: [SharedMaterialModule],
  templateUrl: './code-lang-button.component.html',
  styleUrl: './code-lang-button.component.scss',
})
export class CodeLangButtonComponent {
  defaultLanguage: string = 'python';

  constructor(private themesManagerService: ThemesManagerService) {}

  ngOnInit(): void {
  }

  onFontStyleChange(value: string) {
    this.themesManagerService.switchLanguageTheme(value);
  }
}
