import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequiredValidatorComponent } from './required-validator.component';

describe('RequiredValidatorComponent', () => {
  let component: RequiredValidatorComponent;
  let fixture: ComponentFixture<RequiredValidatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequiredValidatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequiredValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
