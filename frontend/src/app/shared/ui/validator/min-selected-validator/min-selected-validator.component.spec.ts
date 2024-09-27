import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinSelectedValidatorComponent } from './min-selected-validator.component';

describe('MinSelectedValidatorComponent', () => {
  let component: MinSelectedValidatorComponent;
  let fixture: ComponentFixture<MinSelectedValidatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinSelectedValidatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinSelectedValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
