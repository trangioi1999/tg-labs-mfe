import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App (shell layout)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders the global header, main landmark and footer', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('tg-header')).not.toBeNull();
    expect(element.querySelector('main#main')).not.toBeNull();
    expect(element.querySelector('tg-footer')).not.toBeNull();
  });

  it('links to every remote section from the primary navigation', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const links = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll(
        'nav[aria-label="Primary"] a',
      ),
    ).map((a) => a.getAttribute('href'));

    expect(links).toEqual(['/blog', '/docs', '/tools', '/playground']);
  });
});
