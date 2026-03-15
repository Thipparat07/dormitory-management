import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterElectricity } from './water-electricity';

describe('WaterElectricity', () => {
  let component: WaterElectricity;
  let fixture: ComponentFixture<WaterElectricity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaterElectricity]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaterElectricity);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
