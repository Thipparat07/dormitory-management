import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomTenantDetails } from './room-tenant-details';

describe('RoomTenantDetails', () => {
  let component: RoomTenantDetails;
  let fixture: ComponentFixture<RoomTenantDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomTenantDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomTenantDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
