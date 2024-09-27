import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinLengthValidatorComponent } from './min-length-validator.component';

describe('MinLengthValidatorComponent', () => {
  let component: MinLengthValidatorComponent;
  let fixture: ComponentFixture<MinLengthValidatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinLengthValidatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinLengthValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
