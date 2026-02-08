import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dormdata } from './dormdata';

describe('Dormdata', () => {
  let component: Dormdata;
  let fixture: ComponentFixture<Dormdata>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dormdata]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dormdata);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
