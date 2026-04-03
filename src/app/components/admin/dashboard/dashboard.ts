import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardStats } from '../../../services/admin/dashboard';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class AdminDashboard implements OnInit {
  stats: DashboardStats | null = null;

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
    private loadingService: LoadingService,
  ) {}

  ngOnInit() {
    this.loadingService.show();
    this.dashboardService.getDashboardStats().subscribe((data) => {
      this.stats = data;
      console.log('Fetched dashboard stats:', this.stats);
      this.loadingService.hide();

      setTimeout(() => {
        this.cdr.detectChanges();
      }, 0);
    }, () => {
      this.loadingService.hide();
      this.cdr.detectChanges();
    });
  }
}
