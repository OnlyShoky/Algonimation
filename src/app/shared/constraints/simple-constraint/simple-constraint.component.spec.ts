import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleConstraintComponent } from './simple-constraint.component';

describe('SimpleConstraintComponent', () => {
  let component: SimpleConstraintComponent;
  let fixture: ComponentFixture<SimpleConstraintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleConstraintComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SimpleConstraintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
