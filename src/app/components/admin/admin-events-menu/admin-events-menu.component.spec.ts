import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEventsMenuComponent } from './admin-events-menu.component';

describe('AdminEventsMenuComponent', () => {
  let component: AdminEventsMenuComponent;
  let fixture: ComponentFixture<AdminEventsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEventsMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminEventsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
