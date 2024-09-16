import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayAlreadyPaidComponent } from './display-already-paid.component';

describe('DisplayAlreadyPaidComponent', () => {
  let component: DisplayAlreadyPaidComponent;
  let fixture: ComponentFixture<DisplayAlreadyPaidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayAlreadyPaidComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayAlreadyPaidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
