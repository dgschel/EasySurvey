import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralMessageComponent } from './general-message.component';

describe('GeneralMessageComponent', () => {
  let component: GeneralMessageComponent;
  let fixture: ComponentFixture<GeneralMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
