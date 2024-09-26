import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionSuccesfullySavedComponent } from './submission-succesfully-saved.component';

describe('SubmissionSuccesfullySavedComponent', () => {
  let component: SubmissionSuccesfullySavedComponent;
  let fixture: ComponentFixture<SubmissionSuccesfullySavedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmissionSuccesfullySavedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmissionSuccesfullySavedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
