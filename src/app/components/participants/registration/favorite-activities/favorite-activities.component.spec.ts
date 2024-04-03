import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteActivitiesComponent } from './favorite-activities.component';

describe('FavoriteActivitiesComponent', () => {
  let component: FavoriteActivitiesComponent;
  let fixture: ComponentFixture<FavoriteActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoriteActivitiesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FavoriteActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
