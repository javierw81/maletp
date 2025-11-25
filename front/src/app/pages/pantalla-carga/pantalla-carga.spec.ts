import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PantallaCarga } from './pantalla-carga';

describe('PantallaCarga', () => {
  let component: PantallaCarga;
  let fixture: ComponentFixture<PantallaCarga>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PantallaCarga]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PantallaCarga);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
