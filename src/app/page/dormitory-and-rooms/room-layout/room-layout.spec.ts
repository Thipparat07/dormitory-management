import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomLayout } from './room-layout';

describe('RoomLayout', () => {
  let component: RoomLayout;
  let fixture: ComponentFixture<RoomLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
