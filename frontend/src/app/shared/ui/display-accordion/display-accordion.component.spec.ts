import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayAccordionComponent } from './display-accordion.component';

describe('DisplayAccordionComponent', () => {
  let component: DisplayAccordionComponent;
  let fixture: ComponentFixture<DisplayAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayAccordionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
