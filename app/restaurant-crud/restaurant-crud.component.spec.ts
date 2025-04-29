import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantCRUDComponent } from './restaurant-crud.component';

describe('RestaurantCRUDComponent', () => {
  let component: RestaurantCRUDComponent;
  let fixture: ComponentFixture<RestaurantCRUDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantCRUDComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantCRUDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
