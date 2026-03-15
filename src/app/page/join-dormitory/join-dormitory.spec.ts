import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinDormitory } from './join-dormitory';

describe('JoinDormitory', () => {
  let component: JoinDormitory;
  let fixture: ComponentFixture<JoinDormitory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinDormitory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinDormitory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
