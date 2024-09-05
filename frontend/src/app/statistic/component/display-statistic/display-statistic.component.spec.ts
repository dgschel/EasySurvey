import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayStatisticComponent } from './display-statistic.component';

describe('DisplayStatisticComponent', () => {
  let component: DisplayStatisticComponent;
  let fixture: ComponentFixture<DisplayStatisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayStatisticComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
