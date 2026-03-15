import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DormInfo } from './dorm-info';

describe('DormInfo', () => {
  let component: DormInfo;
  let fixture: ComponentFixture<DormInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DormInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DormInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
