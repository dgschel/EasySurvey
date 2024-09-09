import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayQrCodeComponent } from './display-qr-code.component';

describe('DisplayQrCodeComponent', () => {
  let component: DisplayQrCodeComponent;
  let fixture: ComponentFixture<DisplayQrCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayQrCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayQrCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
