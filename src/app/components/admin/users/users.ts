import { Component, ChangeDetectorRef, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/user';

import { UserService } from '../../../services/admin/users';
import { LoadingService } from '../../../core/services/loading.service';
import { DeleteConfirmModalComponent } from '../../../shared/components/delete-confirm-modal/delete-confirm-modal';

@Component({
  selector: 'app-users',
  imports: [CommonModule, DeleteConfirmModalComponent],
  templateUrl: './users.html',
  styleUrl: './users.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Users implements OnInit {

  users: User[] = [];
  page = 1;
  readonly pageSize = 6;
  isDeleteModalOpen = false;
  deletingUserId: number | null = null;
  deletingUserName = '';
  isDeleting = false;

  constructor(private usersService: UserService, private cdr: ChangeDetectorRef, private loadingService: LoadingService) {}

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.users.length / this.pageSize));
  }

  get paginatedUsers(): User[] {
    const start = (this.page - 1) * this.pageSize;
    return this.users.slice(start, start + this.pageSize);
  }

  ngOnInit() {
    this.loadingService.show();
    // Fetch users from the backend API and assign to this.users
    this.usersService.getAllUsers().subscribe((response: any) => {
      console.log('Fetched response:', response);
      this.users = response.users; 
      this.loadingService.hide();
      
      // Ensure change detection runs
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 0);
    }, () => {
      this.loadingService.hide();
      this.cdr.detectChanges();
    });
  }

  restrictUser(userId: number) {
    this.loadingService.show();
    this.usersService.restrictUser(userId).subscribe(() => {
      this.users = this.users.map(user => {
        if (user.id === userId) {
          return { ...user, isActive: false };
        }
        return user;
      });
      this.usersService.clearCache();
      this.loadingService.hide();
      this.cdr.detectChanges();
    }, () => {
      this.loadingService.hide();
      this.cdr.detectChanges();
    });
  }

  unrestrictUser(userId: number) {
    this.loadingService.show();
    this.usersService.unrestrictUser(userId).subscribe(() => {
      this.users = this.users.map(user => {
        if (user.id === userId) {
          return { ...user, isActive: true };
        }
        return user;
      });
      this.usersService.clearCache();
      this.loadingService.hide();
      this.cdr.detectChanges();
    }, () => {
      this.loadingService.hide();
      this.cdr.detectChanges();
    });
  }

  promptDeleteUser(user: User) {
    this.deletingUserId = user.id;
    this.deletingUserName = user.name;
    this.isDeleteModalOpen = true;
    this.cdr.detectChanges();
  }

  cancelDeleteUser() {
    this.isDeleteModalOpen = false;
    this.deletingUserId = null;
    this.deletingUserName = '';
    this.cdr.detectChanges();
  }

  deleteUser() {
    if (this.deletingUserId === null) {
      return;
    }

    const userId = this.deletingUserId;
    this.isDeleting = true;
    this.loadingService.show();
    this.usersService.deleteUser(userId).subscribe(() => {
      this.users = this.users.filter(user => user.id !== userId);
      if (this.page > this.totalPages) {
        this.page = this.totalPages;
      }
      this.usersService.clearCache();
      this.cancelDeleteUser();
      this.isDeleting = false;
      this.loadingService.hide();
      this.cdr.detectChanges();
    }, () => {
      this.isDeleting = false;
      this.loadingService.hide();
      this.cdr.detectChanges();
    });
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
    }
  }
}

