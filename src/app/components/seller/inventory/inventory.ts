import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { InventoryFilters } from './inventory-filters/inventory-filters';
import { ProductsTable } from './products-table/products-table';
import {
  Category,
  InventoryService,
  SellerProduct,
} from '../../../services/seller/inventory.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductModal } from '../../../shared/components/product-modal/product-modal';
import { ToastContainer } from '../../../shared/components/toast-container/toast-container';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-seller-inventory',
  imports: [InventoryFilters, ProductsTable, ProductModal, ToastContainer],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SellerInventory {
  private readonly inventoryService = inject(InventoryService);
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly search = signal('');
  readonly category = signal('All');
  readonly status = signal('All');
  readonly page = signal(1);
  readonly pageSize = 6;
  readonly products = signal<SellerProduct[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly categoryNames = computed(() => this.categories().map((item) => item.name));

  readonly modalOpen = signal(false);
  readonly modalMode = signal<'add' | 'edit' | 'delete'>('add');
  readonly selectedProduct = signal<SellerProduct | undefined>(undefined);

  readonly filteredProducts = computed(() =>
    this.products().filter((product) => {
      const searchMatch = product.name.toLowerCase().includes(this.search().toLowerCase());
      const categoryMatch = this.category() === 'All' || product.category === this.category();
      const statusMatch = this.status() === 'All' || product.status === this.status();
      return searchMatch && categoryMatch && statusMatch;
    }),
  );

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredProducts().length / this.pageSize)),
  );

  readonly paginatedProducts = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.filteredProducts().slice(start, start + this.pageSize);
  });

  private getApiErrorMessage(error: any, fallback: string): string {
    const details = error?.error?.errors;
    if (Array.isArray(details) && details.length > 0) {
      const first = details[0];
      const path = first?.path ? `${first.path}: ` : '';
      return `${path}${first?.message || fallback}`;
    }

    return error?.error?.message || fallback;
  }

  constructor() {
    this.inventoryService
      .getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((products) => this.products.set(products));

    this.inventoryService
      .getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((categories) => this.categories.set(categories));

    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const mode = params.get('modal');
      if (mode === 'add') {
        this.openModal('add');
      }
    });
  }

  setSearch(value: string): void {
    this.search.set(value);
    this.page.set(1);
  }

  setCategory(value: string): void {
    this.category.set(value);
    this.page.set(1);
  }

  setStatus(value: string): void {
    this.status.set(value);
    this.page.set(1);
  }

  nextPage(): void {
    this.page.update((value) => Math.min(this.totalPages(), value + 1));
  }

  prevPage(): void {
    this.page.update((value) => Math.max(1, value - 1));
  }

  openModal(mode: 'add' | 'edit' | 'delete', product?: SellerProduct): void {
    this.modalMode.set(mode);
    this.selectedProduct.set(product);
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
    this.selectedProduct.set(undefined);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { modal: null },
      queryParamsHandling: 'merge',
    });
  }

  onSaveProduct(product: SellerProduct): void {
    if (this.modalMode() === 'add') {
      const payload: Omit<SellerProduct, 'id'> = {
        image: product.image,
        images: product.images,
        name: product.name,
        category: product.category,
        categoryId: product.categoryId,
        price: product.price,
        stock: product.stock,
        description: product.description,
        status: product.status ?? 'Pending',
      };
      this.inventoryService
        .addProduct(payload)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.toastService.show('success', 'Product added successfully.');
            this.closeModal();
          },
          error: (error) =>
            this.toastService.show(
              'error',
              this.getApiErrorMessage(error, 'Failed to add product.'),
            ),
        });
      return;
    }

    this.inventoryService
      .updateProduct(product)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.show('success', 'Product updated successfully.');
          this.closeModal();
        },
        error: (error) =>
          this.toastService.show(
            'error',
            this.getApiErrorMessage(error, 'Failed to update product.'),
          ),
      });
  }

  onDeleteProduct(productId: number): void {
    this.inventoryService
      .deleteProduct(productId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.show('success', 'Product deleted successfully.');
          this.closeModal();
        },
        error: (error) =>
          this.toastService.show(
            'error',
            this.getApiErrorMessage(error, 'Failed to delete product.'),
          ),
      });
  }

  onEdit(productId: number): void {
    const product = this.products().find((item) => item.id === productId);
    if (!product) {
      this.toastService.show('error', 'Product not found.');
      return;
    }
    this.openModal('edit', product);
  }

  onDelete(productId: number): void {
    const product = this.products().find((item) => item.id === productId);
    if (!product) {
      this.toastService.show('error', 'Product not found.');
      return;
    }
    this.openModal('delete', product);
  }

  onToggleStatus(productId: number): void {
    this.inventoryService
      .toggleProductStatus(productId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (product) => {
          if (product) {
            this.toastService.show('info', `${product.name} has been resubmitted for review.`);
          }
        },
        error: (error) =>
          this.toastService.show(
            'error',
            this.getApiErrorMessage(error, 'Failed to resubmit product.'),
          ),
      });
  }
}
