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
  isLoading = false;

  constructor(private usersService: UserService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Fetch users from the backend API and assign to this.users
    this.usersService.getAllUsers().subscribe((response: any) => {
      console.log('Fetched response:', response);
      this.users = response.users; 
      
      // Ensure change detection runs
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 0);
    });
  }

  restrictUser(userId: number) {
    this.isLoading = true;
    this.usersService.restrictUser(userId).subscribe(() => {
      this.users = this.users.map(user => {
        if (user.id === userId) {
          return { ...user, isActive: false };
        }
        return user;
      });
      this.usersService.clearCache();
      setTimeout(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }, 0);
    });
  }

  unrestrictUser(userId: number) {
    this.isLoading = true;
    this.usersService.unrestrictUser(userId).subscribe(() => {
      this.users = this.users.map(user => {
        if (user.id === userId) {
          return { ...user, isActive: true };
        }
        return user;
      });
      this.usersService.clearCache();
      setTimeout(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }, 0);
    });
  }

  deleteUser(userId: number) {
    this.isLoading = true;
    this.usersService.deleteUser(userId).subscribe(() => {
      this.users = this.users.filter(user => user.id !== userId);
      this.usersService.clearCache();
      setTimeout(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }, 0);
    });
  }
}

