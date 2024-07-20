import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFormInputComponent } from './create-form-input.component';

describe('CreateFormInputComponent', () => {
  let component: CreateFormInputComponent;
  let fixture: ComponentFixture<CreateFormInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateFormInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateFormInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
