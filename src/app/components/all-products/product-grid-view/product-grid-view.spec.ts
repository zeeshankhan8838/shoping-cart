import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductGridView } from './product-grid-view';

describe('ProductGridView', () => {
  let component: ProductGridView;
  let fixture: ComponentFixture<ProductGridView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductGridView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductGridView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
