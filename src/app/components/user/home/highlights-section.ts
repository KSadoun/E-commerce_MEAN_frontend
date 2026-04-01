import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { HighlightFeature } from './home.models';

@Component({
  selector: 'app-highlights-section',
  templateUrl: './highlights-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HighlightsSection {
  readonly highlights = input.required<ReadonlyArray<HighlightFeature>>();
}
