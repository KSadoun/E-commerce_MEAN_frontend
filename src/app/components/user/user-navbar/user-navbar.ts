import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthApi } from '../../../services/auth/auth-api';

@Component({
  selector: 'app-user-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './user-navbar.html',
})
export class UserNavbar implements OnInit {
  isLoggedIn = false;

  constructor(private authApi: AuthApi) {}

  ngOnInit() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
  }
}
