import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeLangButtonComponent } from './code-lang-button.component';

describe('CodeLangButtonComponent', () => {
  let component: CodeLangButtonComponent;
  let fixture: ComponentFixture<CodeLangButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeLangButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CodeLangButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
