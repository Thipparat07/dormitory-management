import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverduePayment } from './overdue-payment';

describe('OverduePayment', () => {
  let component: OverduePayment;
  let fixture: ComponentFixture<OverduePayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverduePayment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverduePayment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
