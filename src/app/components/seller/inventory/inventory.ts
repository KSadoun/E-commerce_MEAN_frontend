import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-seller-inventory',
  imports: [],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SellerInventory {}
