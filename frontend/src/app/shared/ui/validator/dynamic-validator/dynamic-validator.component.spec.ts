import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicValidatorComponent } from './dynamic-validator.component';

describe('DynamicValidatorComponent', () => {
  let component: DynamicValidatorComponent;
  let fixture: ComponentFixture<DynamicValidatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicValidatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
