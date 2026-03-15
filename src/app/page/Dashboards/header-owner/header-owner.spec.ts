import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderOwner } from './header-owner';

describe('HeaderOwner', () => {
  let component: HeaderOwner;
  let fixture: ComponentFixture<HeaderOwner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderOwner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderOwner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
