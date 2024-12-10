import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChainConstraintComponent } from './chain-constraint.component';

describe('ChainConstraintComponent', () => {
  let component: ChainConstraintComponent;
  let fixture: ComponentFixture<ChainConstraintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChainConstraintComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChainConstraintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
