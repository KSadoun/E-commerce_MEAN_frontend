import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero-section',
  imports: [RouterLink],
  templateUrl: './hero-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSection {
  readonly headline = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly imageUrl = input.required<string>();
}
