import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FromOwner } from './from-owner';

describe('FromOwner', () => {
  let component: FromOwner;
  let fixture: ComponentFixture<FromOwner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FromOwner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FromOwner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
