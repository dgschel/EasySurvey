import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralErrorMessageComponent } from './general-error-message.component';

describe('GeneralErrorMessageComponent', () => {
  let component: GeneralErrorMessageComponent;
  let fixture: ComponentFixture<GeneralErrorMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralErrorMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
