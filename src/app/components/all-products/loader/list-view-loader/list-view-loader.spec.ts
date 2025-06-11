import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListViewLoader } from './list-view-loader';

describe('ListViewLoader', () => {
  let component: ListViewLoader;
  let fixture: ComponentFixture<ListViewLoader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListViewLoader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListViewLoader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
