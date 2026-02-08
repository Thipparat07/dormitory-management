import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerAddbank } from './owner-addbank';

describe('OwnerAddbank', () => {
  let component: OwnerAddbank;
  let fixture: ComponentFixture<OwnerAddbank>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerAddbank]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerAddbank);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
