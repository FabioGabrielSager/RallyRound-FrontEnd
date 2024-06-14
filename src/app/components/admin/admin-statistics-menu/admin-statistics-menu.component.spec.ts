import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminStatisticsMenuComponent } from './admin-statistics-menu.component';

describe('AdminStatisticsMenuComponent', () => {
  let component: AdminStatisticsMenuComponent;
  let fixture: ComponentFixture<AdminStatisticsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminStatisticsMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminStatisticsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
