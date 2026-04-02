import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { FooterLinkGroup } from './home.models';

@Component({
  selector: 'app-home-footer',
  templateUrl: './home-footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeFooter {
  readonly companyDescription = input.required<string>();
  readonly linkGroups = input.required<ReadonlyArray<FooterLinkGroup>>();
}
