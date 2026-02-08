import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Rentbill } from './rentbill';

describe('Rentbill', () => {
  let component: Rentbill;
  let fixture: ComponentFixture<Rentbill>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Rentbill]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Rentbill);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
