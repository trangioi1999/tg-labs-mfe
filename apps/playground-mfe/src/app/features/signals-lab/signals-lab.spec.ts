import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SignalsLab } from './signals-lab';

describe('SignalsLab', () => {
  it('updates computed values and logs effect runs', async () => {
    await TestBed.configureTestingModule({
      imports: [SignalsLab],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(SignalsLab);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const buttons = Array.from(element.querySelectorAll('button'));
    const plus = buttons.find((b) => b.textContent?.includes('+'));

    plus?.click();
    plus?.click();
    plus?.click();
    await fixture.whenStable();

    expect(element.querySelector('output')?.textContent).toBe('3');
    expect(element.textContent).toContain('odd');
    expect(element.querySelector('[aria-label="Effect log"] li')?.textContent).toContain('count=3');
  });
});
