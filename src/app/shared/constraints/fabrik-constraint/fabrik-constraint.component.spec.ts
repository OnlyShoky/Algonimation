import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FabrikConstraintComponent } from './fabrik-constraint.component';

describe('FabrikConstraintComponent', () => {
  let component: FabrikConstraintComponent;
  let fixture: ComponentFixture<FabrikConstraintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FabrikConstraintComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FabrikConstraintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
