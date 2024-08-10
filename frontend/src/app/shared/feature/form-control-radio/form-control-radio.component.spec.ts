import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormControlRadioComponent } from './form-control-radio.component';

describe('FormControlRadioComponent', () => {
  let component: FormControlRadioComponent;
  let fixture: ComponentFixture<FormControlRadioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormControlRadioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormControlRadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
