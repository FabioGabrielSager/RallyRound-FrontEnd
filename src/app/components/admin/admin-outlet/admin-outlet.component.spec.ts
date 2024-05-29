import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOutletComponent } from './admin-outlet.component';

describe('StaffHomeComponent', () => {
  let component: AdminOutletComponent;
  let fixture: ComponentFixture<AdminOutletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminOutletComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
