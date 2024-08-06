import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicOptionComponent } from './dynamic-option.component';

describe('DynamicOptionComponent', () => {
  let component: DynamicOptionComponent;
  let fixture: ComponentFixture<DynamicOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicOptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
