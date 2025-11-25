import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicacionesCardComponent } from './publicaciones-card-component';

describe('PublicacionesCardComponent', () => {
  let component: PublicacionesCardComponent;
  let fixture: ComponentFixture<PublicacionesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicacionesCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicacionesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
