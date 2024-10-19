import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableStatisticComponent } from './table-statistic.component';

describe('TableStatisticComponent', () => {
  let component: TableStatisticComponent;
  let fixture: ComponentFixture<TableStatisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableStatisticComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
