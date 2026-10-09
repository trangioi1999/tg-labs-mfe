import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { Button, PageHeader } from '@tg-labs/shared-ui';
import { CopyButton } from '../../ui/copy-button';
import {
  type JsonIndent,
  describeJson,
  formatJson,
  minifyJson,
} from './json-format';

type OutputMode = 'pretty' | 'minified';

const SAMPLE = `{"name":"tg-labs","private":true,"apps":["shell","blog-mfe","docs-mfe","tools-mfe","playground-mfe"],"federation":{"type":"native","shared":["@angular/core","rxjs"]},"ports":{"shell":4200,"blog":4201}}`;

@Component({
  selector: 'tg-json-formatter',
  imports: [Button, PageHeader, CopyButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './json-formatter.html',
})
export class JsonFormatter {
  protected readonly input = signal('');
  protected readonly mode = signal<OutputMode>('pretty');
  protected readonly indent = signal<JsonIndent>(2);

  protected readonly indentOptions: readonly {
    value: JsonIndent;
    label: string;
  }[] = [
    { value: 2, label: '2 spaces' },
    { value: 4, label: '4 spaces' },
    { value: 'tab', label: 'Tab' },
  ];

  protected readonly result = computed(() =>
    this.mode() === 'pretty'
      ? formatJson(this.input(), this.indent())
      : minifyJson(this.input()),
  );

  protected readonly output = computed(() => {
    const result = this.result();
    return result.ok ? result.output : '';
  });

  protected readonly summary = computed(() => {
    const result = this.result();
    return result.ok ? describeJson(result.value) : '';
  });

  protected readonly isEmpty = computed(() => this.input().trim().length === 0);

  protected setIndent(value: string): void {
    const option = this.indentOptions.find((o) => String(o.value) === value);
    if (option) {
      this.indent.set(option.value);
    }
  }

  protected loadSample(): void {
    this.input.set(SAMPLE);
  }

  protected clear(): void {
    this.input.set('');
  }
}
