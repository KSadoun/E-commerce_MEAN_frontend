import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/user';

import { UserService } from '../../../services/admin/users';

@Component({
  selector: 'app-users',
  imports: [CommonModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {

  users: User[] = []

  constructor(private usersService: UserService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Fetch users from the backend API and assign to this.users
    this.usersService.getAllUsers().subscribe((users) => {
      this.users = users;
      console.log('Fetched users:', this.users);
      this.cdr.detectChanges();
    });
  }
}

