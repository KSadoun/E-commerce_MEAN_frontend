import { Component, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/admin/users';
import { User } from '../../../models/user';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class UserDashboard implements OnInit {
  user: User | null = null;
  wishlist: any[] = [];
  orders: any[] = [];
  loading = true;

  constructor(private userService: UserService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.userService.getMyProfile().subscribe({
      next: (res: any) => {
        this.user = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load profile:', err),
    });

    this.userService.getMyWishlist().subscribe({
      next: (wishlist: any) => {
        this.wishlist = wishlist.items;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load wishlist:', err),
    });

    this.userService.getMyOrders().subscribe({
      next: (orders: any) => {
        this.orders = orders.orders;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load orders:', err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}


