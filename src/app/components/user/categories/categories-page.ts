import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-categories-page',
  standalone: true,
  templateUrl: './categories-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesPage {}
