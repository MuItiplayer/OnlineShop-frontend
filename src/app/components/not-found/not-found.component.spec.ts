import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NotFoundComponent } from './not-found.component';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('sollte erstellt werden', () => {
    expect(component).toBeTruthy();
  });

  it('sollte "404" als Überschrift anzeigen', () => {
    const h1Element = debugElement.query(By.css('h1'));
    expect(h1Element.nativeElement.textContent).toBe('404');
  });

  it('sollte "Seite nicht gefunden" als Untertitel anzeigen', () => {
    const h2Element = debugElement.query(By.css('h2'));
    expect(h2Element.nativeElement.textContent).toBe('Seite nicht gefunden');
  });

  it('sollte einen erklärenden Text anzeigen', () => {
    const pElement = debugElement.query(By.css('p'));
    expect(pElement.nativeElement.textContent)
      .toBe('Die von Ihnen gesuchte Seite existiert nicht oder wurde verschoben.');
  });

  it('sollte einen Link zurück zur Startseite enthalten', () => {
    const linkElement = debugElement.query(By.css('a.home-button'));

    expect(linkElement).toBeTruthy();
    expect(linkElement.nativeElement.textContent).toBe('Zurück zur Startseite');
    expect(linkElement.attributes['routerLink']).toBe('/');
  });

  it('sollte ein console.log beim Initialisieren ausgeben', () => {
    spyOn(console, 'log');
    const testComponent = new NotFoundComponent();

    expect(console.log).toHaveBeenCalledWith('NotFoundComponent initialisiert');
  });
});
