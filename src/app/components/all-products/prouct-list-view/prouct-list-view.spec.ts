import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProuctListView } from './prouct-list-view';

describe('ProuctListView', () => {
  let component: ProuctListView;
  let fixture: ComponentFixture<ProuctListView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProuctListView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProuctListView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
