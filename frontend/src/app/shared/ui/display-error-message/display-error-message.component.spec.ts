import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayErrorMessageComponent } from './display-error-message.component';

describe('DisplayErrorMessageComponent', () => {
  let component: DisplayErrorMessageComponent;
  let fixture: ComponentFixture<DisplayErrorMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayErrorMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
