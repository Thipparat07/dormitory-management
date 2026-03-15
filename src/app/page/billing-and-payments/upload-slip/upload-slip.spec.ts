import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadSlip } from './upload-slip';

describe('UploadSlip', () => {
  let component: UploadSlip;
  let fixture: ComponentFixture<UploadSlip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadSlip]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadSlip);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
