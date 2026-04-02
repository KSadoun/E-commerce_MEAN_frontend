import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';                                     
import { AuthApi } from '../../../services/auth/auth-api';
import { CartStateService } from '../../../services/cart-state/cart-state.service'; 
import { CartService } from '../../../services/cart/cart.service';                  

@Component({
  selector: 'app-user-navbar',
  imports: [RouterLink, RouterLinkActive, AsyncPipe],   
  templateUrl: './user-navbar.html',
})
export class UserNavbar implements OnInit {
  isLoggedIn = false;

  constructor(
    private authApi: AuthApi,
    public cartState: CartStateService,   
    private cartService: CartService,     
  ) {}

  ngOnInit() {
    this.checkLoginStatus();
    this.loadCartCount();                
  }

  checkLoginStatus() {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
  }

  private loadCartCount() {
    this.cartService.getSummary().subscribe({
      next: () => {},
      error: () => {
       
        this.cartService.getCart().subscribe({
          next: () => {},
          error: () => this.cartState.clear(),
        });
      },
    });
  }
}