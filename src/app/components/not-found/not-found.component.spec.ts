import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotFoundComponent } from './not-found.component';
import { RouterModule } from '@angular/router';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundComponent, RouterModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('sollte die Komponente erstellen', () => {
    expect(component).toBeTruthy();
  });

  it('sollte den Titel "Seite nicht gefunden" anzeigen', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Seite nicht gefunden');
  });

  it('sollte einen Link zurück zur Startseite haben', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const link = compiled.querySelector('a[routerLink="/"]');
    expect(link).toBeTruthy();
    expect(link?.textContent).toContain('Zurück zur Startseite');
  });

  it('sollte beim Initialisieren eine Konsolenausgabe machen', () => {
    const spy = spyOn(console, 'log');
    component = new NotFoundComponent(); // Konstruktor erneut aufrufen
    expect(spy).toHaveBeenCalledWith('NotFoundComponent initialisiert');
  });
});
