import { TestBed } from '@angular/core/testing';
import { JsonFormatter } from './json-formatter';

async function setup() {
  await TestBed.configureTestingModule({
    imports: [JsonFormatter],
  }).compileComponents();
  const fixture = TestBed.createComponent(JsonFormatter);
  await fixture.whenStable();
  const element = fixture.nativeElement as HTMLElement;
  const type = async (value: string) => {
    const input = element.querySelector<HTMLTextAreaElement>('#json-input');
    if (!input) throw new Error('input not found');
    input.value = value;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  };
  const output = () =>
    element.querySelector<HTMLTextAreaElement>('#json-output')?.value;
  return { element, type, output };
}

describe('JsonFormatter', () => {
  it('formats valid JSON as the user types', async () => {
    const { element, type, output } = await setup();

    await type('{"a":[1,2]}');

    expect(output()).toBe('{\n  "a": [\n    1,\n    2\n  ]\n}');
    expect(element.querySelector('#json-status')?.textContent).toContain(
      'Valid JSON',
    );
  });

  it('shows an error with a location for invalid JSON', async () => {
    const { element, type, output } = await setup();

    await type('{"a": }');

    expect(output()).toBe('');
    const alert = element.querySelector('[role="alert"]');
    expect(alert?.textContent).toContain('Invalid JSON');
    expect(alert?.textContent).toContain('line 1');
  });
});
