import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Transferreceipt } from './transferreceipt';

describe('Transferreceipt', () => {
  let component: Transferreceipt;
  let fixture: ComponentFixture<Transferreceipt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Transferreceipt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Transferreceipt);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
