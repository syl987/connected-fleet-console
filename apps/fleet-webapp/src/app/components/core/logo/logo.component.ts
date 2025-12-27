import { coerceCssPixelValue } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-logo',
  template: '{{ name() }}',
  styleUrl: './logo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[style.font-size]': 'fontSize()',
    '[style.line-height]': 'lineHeight()',
    'class': 'app-logo',
  },
})
export class LogoComponent {
  readonly name = input.required<string>();

  readonly size = input('inherit', { transform: coerceCssPixelValue });

  readonly fontSize = computed(() => +this.size() + 'px');
  readonly lineHeight = computed(() => +this.size() * 1.25 + 'px');
}
