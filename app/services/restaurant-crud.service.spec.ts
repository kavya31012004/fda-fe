import { TestBed } from '@angular/core/testing';

import { RestaurantCRUDService } from './restaurant-crud.service';

describe('RestaurantCRUDService', () => {
  let service: RestaurantCRUDService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestaurantCRUDService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
