import { Component, ChangeDetectorRef, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/admin/categories';
import { DeleteConfirmModalComponent } from '../../../shared/components/delete-confirm-modal/delete-confirm-modal';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, FormsModule, HttpClientModule, DeleteConfirmModalComponent],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories implements OnInit {
  categories: Category[] = [];
  isLoading = false;
  searchTerm: string = '';
  isDeleteModalOpen = false;
  deletingCategoryId: number | null = null;
  deletingCategoryName = '';
  isDeleting = false;

  constructor(@Inject(CategoryService) private categoryService: CategoryService, private cdr: ChangeDetectorRef, private router: Router) {}

  get filteredCategories(): Category[] {
    if (!this.searchTerm) {
      return this.categories;
    }
    return this.categories.filter(category =>
      category.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  ngOnInit() {
    this.isLoading = true;
    this.categoryService.getAllCategories().subscribe((response: any) => {
      this.categories = response.categories;
      console.log('Fetched categories:', this.categories);
      this.isLoading = false;
      
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 0);
    });
  }

  viewCategoryProducts(categoryId: number): void {
    this.router.navigate(['/admin/categories', categoryId, 'products']);
  }

  restrictCategory(categoryId: number): void {
    this.isLoading = true;
    this.categoryService.restrictCategory(categoryId).subscribe(() => {
      const category = this.categories.find(cat => cat.id === categoryId);
      if (category) {
        category.isRestricted = true;
      }
      this.categoryService.clearCache();
      this.isLoading = false;
      
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 0);
    });
  }

  unrestrictCategory(categoryId: number): void {
    this.isLoading = true;
    this.categoryService.unrestrictCategory(categoryId).subscribe(() => {
      const category = this.categories.find(cat => cat.id === categoryId);
      if (category) {
        category.isRestricted = false;
      }
      this.categoryService.clearCache();
      this.isLoading = false;
      
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 0);
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
    this.categoryService.deleteCategory(categoryId).subscribe(() => {
      this.categories = this.categories.filter(category => category.id !== categoryId);
      this.categoryService.clearCache();
      this.isDeleting = false;
      this.cancelDeleteCategory();
      this.cdr.detectChanges();
    }, () => {
      this.isDeleting = false;
      this.cdr.detectChanges();
    });
  }
}
