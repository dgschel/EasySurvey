import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormControlSelectComponent } from './form-control-select.component';

describe('FormControlSelectComponent', () => {
  let component: FormControlSelectComponent;
  let fixture: ComponentFixture<FormControlSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormControlSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormControlSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
