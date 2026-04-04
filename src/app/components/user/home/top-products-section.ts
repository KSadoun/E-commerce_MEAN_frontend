import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { CatalogProduct } from './home.models';

@Component({
  selector: 'app-top-products-section',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './top-products-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopProductsSection {
  readonly products = input.required<ReadonlyArray<CatalogProduct>>();
}
