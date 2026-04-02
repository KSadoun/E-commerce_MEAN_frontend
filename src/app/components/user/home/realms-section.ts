import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RealmCategory } from './home.models';

@Component({
  selector: 'app-realms-section',
  templateUrl: './realms-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RealmsSection {
  readonly categories = input.required<ReadonlyArray<RealmCategory>>();
}
