import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked
} from '@angular/core';
import { CatalogProduct } from '../home/home.models';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../services/cart/cart.service';
import { UserService } from '../../../services/admin/users';
import { ProductCard } from '../../../shared/components/product-card/product-card';

@Component({
  selector: 'app-products-grid-section',
  imports: [ProductCard],
  templateUrl: './products-grid-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsGridSection {
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly userService = inject(UserService);

  readonly products = input.required<ReadonlyArray<CatalogProduct>>();
  readonly materialOptions = input.required<ReadonlyArray<string>>();

  // --- Signals الخاصة بالفلتر والـ Pagination ---
  readonly maxSelectedPrice = signal(6000);
  readonly selectedMaterials = signal<Set<string>>(new Set());
  readonly itemsPerPage = signal(4); // عدد المنتجات في الصفحة
  readonly currentPage = signal(1);  // الصفحة الحالية

  readonly addingToCart = signal<Record<string, boolean>>({});
  readonly wishlistLoading = signal<Record<string, boolean>>({});
  readonly wishlistedProductIds = signal<Set<number>>(new Set());
  readonly cartMessage = signal('');
  readonly sortBy = signal<string>('featured');

  // 1. حساب أقل وأعلى سعر (للفلتر)
  readonly lowestPrice = computed(() => {
    const prices = this.products().map((p) => p.price);
    return prices.length > 0 ? Math.floor(Math.min(...prices)) : 0;
  });

  readonly highestPrice = computed(() => {
    const prices = this.products().map((p) => p.price);
    return prices.length > 0 ? Math.ceil(Math.max(...prices)) : 6000;
  });

  // 2. تصفية المنتجات بناءً على الفلاتر
  readonly filteredProducts = computed(() =>
    this.products().filter((product) => {
      const matchesPrice = product.price <= this.maxSelectedPrice();
      const chosenMaterials = this.selectedMaterials();
      const matchesMaterial = chosenMaterials.size === 0 || chosenMaterials.has(product.material);
      return matchesPrice && matchesMaterial;
    }),
  );
// 3. مصفوفة المنتجات بعد الفلترة والترتيب (قبل التقطيع لصفحات)
readonly sortedProducts = computed(() => {
  const items = [...this.filteredProducts()]; // ناخد نسخة عشان م نعدلش في الأصل
  const option = this.sortBy();

  switch (option) {
    case 'price-asc': return items.sort((a, b) => a.price - b.price);
    case 'price-desc': return items.sort((a, b) => b.price - a.price);
    case 'name-asc': return items.sort((a, b) => a.title.localeCompare(b.title));
    case 'name-desc': return items.sort((a, b) => b.title.localeCompare(a.title));
    default: return items; // Featured أو الأحدث (حسب ترتيب الـ API)
  }
});

  // 4. تقسيم المنتجات لصفحات (Pagination Logic)
  readonly totalPages = computed(() => 
    Math.ceil(this.filteredProducts().length / this.itemsPerPage())
  );

  readonly visibleProducts = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
    const endIndex = startIndex + this.itemsPerPage();
    return this.sortedProducts().slice(startIndex, endIndex);
  });

  constructor() {
    // ضبط السعر الأقصى عند تحميل البيانات
    effect(() => {
      const topPrice = this.highestPrice();
      untracked(() => this.maxSelectedPrice.set(topPrice));
    });

    // إعادة اليوزر للصفحة 1 لو غير الفلتر (عشان ميبقاش واقف في صفحة فاضية)
    effect(() => {
      this.maxSelectedPrice();
      this.selectedMaterials();
      untracked(() => this.currentPage.set(1));
    });

    if (this.authService.isAuthenticated()) {
      this.loadWishlist();
    }
  }

  private loadWishlist(): void {
    this.userService.getMyWishlist().subscribe({
      next: (response: any) => {
        const ids = new Set<number>((response?.items || []).map((item: any) => Number(item.id)));
        this.wishlistedProductIds.set(ids);
      },
    });
  }

  // --- Functions ---
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  setMaxPrice(rawValue: string): void {
    this.maxSelectedPrice.set(Number(rawValue));
  }

  toggleMaterial(material: string, checked: boolean): void {
    this.selectedMaterials.update((items) => {
      const next = new Set(items);
      if (checked) next.add(material);
      else next.delete(material);
      return next;
    });
  }

  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.sortBy.set(value);
    this.currentPage.set(1); // نرجع للصفحة الأولى لما الترتيب يتغير
  }

  isWishlisted(product: CatalogProduct): boolean {
    return this.wishlistedProductIds().has(product.backendId);
  }

  toggleWishlist(product: CatalogProduct): void {
    if (!this.authService.isAuthenticated()) {
      this.cartMessage.set('Please log in to manage your wishlist');
      setTimeout(() => this.cartMessage.set(''), 3000);
      return;
    }

    if (!product.backendId || product.backendId <= 0) {
      return;
    }

    const productKey = product.id;
    const isCurrentlyWishlisted = this.isWishlisted(product);
    this.wishlistLoading.update((state) => ({ ...state, [productKey]: true }));

    const request = isCurrentlyWishlisted
      ? this.userService.removeFromWishlist(product.backendId)
      : this.userService.addToWishlist(product.backendId);

    request.subscribe({
      next: () => {
        this.wishlistLoading.update((state) => ({ ...state, [productKey]: false }));
        this.wishlistedProductIds.update((ids) => {
          const next = new Set(ids);
          if (isCurrentlyWishlisted) {
            next.delete(product.backendId);
          } else {
            next.add(product.backendId);
          }
          return next;
        });
      },
      error: (err) => {
        this.wishlistLoading.update((state) => ({ ...state, [productKey]: false }));
        this.cartMessage.set(err.error?.message || 'Failed to update wishlist');
        setTimeout(() => this.cartMessage.set(''), 3000);
      },
    });
  }

  addToCart(product: CatalogProduct): void {
    if (!product.backendId || product.backendId <= 0) {
      this.cartMessage.set('This product is not available for purchase');
      setTimeout(() => this.cartMessage.set(''), 3000);
      return;
    }

    if (product.stock <= 0) {
      this.cartMessage.set('This product is out of stock');
      setTimeout(() => this.cartMessage.set(''), 3000);
      return;
    }

    this.addingToCart.update((state) => ({ ...state, [product.id]: true }));
    this.cartService.addItem(product.backendId, 1).subscribe({
      next: () => {
        this.addingToCart.update((state) => ({ ...state, [product.id]: false }));
        this.cartMessage.set(`${product.title} added to cart!`);
        setTimeout(() => this.cartMessage.set(''), 2000);
      },
      error: () => {
        this.addingToCart.update((state) => ({ ...state, [product.id]: false }));
        setTimeout(() => this.cartMessage.set(''), 3000);
      }
    });
  }
}
