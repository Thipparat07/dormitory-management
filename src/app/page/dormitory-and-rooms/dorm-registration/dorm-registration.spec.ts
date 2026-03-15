import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DormRegistration } from './dorm-registration';

describe('DormRegistration', () => {
  let component: DormRegistration;
  let fixture: ComponentFixture<DormRegistration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DormRegistration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DormRegistration);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
