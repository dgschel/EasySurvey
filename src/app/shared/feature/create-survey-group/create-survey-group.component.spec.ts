import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSurveyGroupComponent } from './create-survey-group.component';

describe('CreateSurveyGroupComponent', () => {
  let component: CreateSurveyGroupComponent;
  let fixture: ComponentFixture<CreateSurveyGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSurveyGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSurveyGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
