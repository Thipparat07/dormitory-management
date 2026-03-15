import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerBankAccount } from './owner-bank-account';

describe('OwnerBankAccount', () => {
  let component: OwnerBankAccount;
  let fixture: ComponentFixture<OwnerBankAccount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerBankAccount]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerBankAccount);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
