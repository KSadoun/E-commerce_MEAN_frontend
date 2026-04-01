import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { HomeNavLink } from './home.models';

@Component({
  selector: 'app-home-header',
  imports: [RouterLink],
  templateUrl: './home-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeHeader {
  readonly navLinks = input.required<ReadonlyArray<HomeNavLink>>();
  readonly isAuthenticated = input<boolean>(false);
}
