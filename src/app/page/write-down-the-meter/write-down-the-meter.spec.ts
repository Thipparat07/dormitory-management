import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteDownTheMeter } from './write-down-the-meter';

describe('WriteDownTheMeter', () => {
  let component: WriteDownTheMeter;
  let fixture: ComponentFixture<WriteDownTheMeter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WriteDownTheMeter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WriteDownTheMeter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
