import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardStats } from '../../../services/admin/dashboard';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class AdminDashboard implements OnInit {
  stats: DashboardStats | null = null;
  isLoading = false;

  constructor(private dashboardService: DashboardService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.isLoading = true;
    this.dashboardService.getDashboardStats().subscribe((data) => {
      this.stats = data;
      console.log('Fetched dashboard stats:', this.stats);
      this.isLoading = false;

      setTimeout(() => {
        this.cdr.detectChanges();
      }, 0);
    });
  }
}
