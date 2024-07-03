import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicSelectOptionComponent } from './dynamic-select-option.component';

describe('DynamicSelectOptionComponent', () => {
  let component: DynamicSelectOptionComponent;
  let fixture: ComponentFixture<DynamicSelectOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicSelectOptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicSelectOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
