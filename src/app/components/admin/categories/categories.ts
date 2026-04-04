import { Component, ChangeDetectorRef, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/admin/categories';
import { DeleteConfirmModalComponent } from '../../../shared/components/delete-confirm-modal/delete-confirm-modal';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, FormsModule, HttpClientModule, DeleteConfirmModalComponent],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories implements OnInit {
  categories: Category[] = [];
  searchTerm: string = '';
  page = 1;
  readonly pageSize = 6;
  isDeleteModalOpen = false;
  deletingCategoryId: number | null = null;
  deletingCategoryName = '';
  isDeleting = false;

  constructor(
    @Inject(CategoryService) private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private loadingService: LoadingService,
  ) {}

  get filteredCategories(): Category[] {
    if (!this.searchTerm) {
      return this.categories;
    }
    return this.categories.filter(category =>
      category.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredCategories.length / this.pageSize));
  }

  get paginatedCategories(): Category[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredCategories.slice(start, start + this.pageSize);
  }

  ngOnInit() {
    this.loadingService.show();
    this.categoryService.getAllCategories().subscribe((response: any) => {
      this.categories = response.categories;
      console.log('Fetched categories:', this.categories);
      this.loadingService.hide();
      
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 0);
    }, () => {
      this.loadingService.hide();
      this.cdr.detectChanges();
    });
  }

  viewCategoryProducts(categoryId: number): void {
    this.router.navigate(['/admin/categories', categoryId, 'products']);
  }

  restrictCategory(categoryId: number): void {
    this.loadingService.show();
    this.categoryService.restrictCategory(categoryId).subscribe(() => {
      const category = this.categories.find(cat => cat.id === categoryId);
      if (category) {
        category.isRestricted = true;
      }
      this.categoryService.clearCache();
      this.loadingService.hide();
      
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 0);
    }, () => {
      this.loadingService.hide();
      this.cdr.detectChanges();
    });
  }

  unrestrictCategory(categoryId: number): void {
    this.loadingService.show();
    this.categoryService.unrestrictCategory(categoryId).subscribe(() => {
      const category = this.categories.find(cat => cat.id === categoryId);
      if (category) {
        category.isRestricted = false;
      }
      this.categoryService.clearCache();
      this.loadingService.hide();
      
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 0);
    }, () => {
      this.loadingService.hide();
      this.cdr.detectChanges();
    });
  }

  promptDeleteCategory(category: Category): void {
    this.deletingCategoryId = category.id;
    this.deletingCategoryName = category.name;
    this.isDeleteModalOpen = true;
    this.cdr.detectChanges();
  }

  cancelDeleteCategory(): void {
    this.isDeleteModalOpen = false;
    this.deletingCategoryId = null;
    this.deletingCategoryName = '';
    this.cdr.detectChanges();
  }

  deleteCategory(): void {
    if (this.deletingCategoryId === null) {
      return;
    }

    const categoryId = this.deletingCategoryId;
    this.isDeleting = true;
    this.loadingService.show();
    this.categoryService.deleteCategory(categoryId).subscribe(() => {
      this.categories = this.categories.filter(category => category.id !== categoryId);
      if (this.page > this.totalPages) {
        this.page = this.totalPages;
      }
      this.categoryService.clearCache();
      this.isDeleting = false;
      this.loadingService.hide();
      this.cancelDeleteCategory();
      this.cdr.detectChanges();
    }, () => {
      this.isDeleting = false;
      this.loadingService.hide();
      this.cdr.detectChanges();
    });
  }

  onSearchChange(): void {
    this.page = 1;
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
    }
  }
}
