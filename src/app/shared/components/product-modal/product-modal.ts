import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Category, SellerProduct } from '../../../services/seller/inventory.service';

export type ProductModalMode = 'add' | 'edit' | 'delete';

@Component({
  selector: 'app-product-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './product-modal.html',
  styleUrl: './product-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductModal {
  readonly mode = input.required<ProductModalMode>();
  readonly productData = input<SellerProduct | undefined>();
  readonly categories = input<Category[]>([]);

  readonly onSave = output<SellerProduct>();
  readonly onDelete = output<number>();
  readonly onCancel = output<void>();

  private readonly formBuilder = inject(FormBuilder);

  readonly existingImages = signal<string[]>([]);
  readonly selectedImages = signal<string[]>([]);
  readonly submitted = signal(false);
  readonly previewImages = computed(() => {
    const selected = this.selectedImages();
    if (selected.length > 0) {
      return selected;
    }

    return this.existingImages();
  });

  readonly form = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    categoryId: [0, [Validators.required, Validators.min(1)]],
    price: [0, [Validators.required, Validators.min(1)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    description: ['', [Validators.required]],
  });

  readonly changedFields = computed(() => {
    const product = this.productData();
    if (!product || this.mode() !== 'edit') {
      return new Set<string>();
    }

    const changed = new Set<string>();
    const values = this.form.getRawValue();

    if (values.name !== product.name) changed.add('name');
    if (Number(values.categoryId) !== product.categoryId) changed.add('categoryId');
    if (Number(values.price) !== product.price) changed.add('price');
    if (Number(values.stock) !== product.stock) changed.add('stock');
    if (values.description !== product.description) changed.add('description');
    if (this.selectedImages().length > 0) changed.add('image');

    return changed;
  });

  constructor() {
    effect(() => {
      const mode = this.mode();
      const product = this.productData();

      if (mode === 'delete') {
        return;
      }

      if (product) {
        this.form.patchValue({
          name: product.name,
          categoryId: product.categoryId,
          price: product.price,
          stock: product.stock,
          description: product.description,
        });
        this.existingImages.set(
          product.images && product.images.length > 0
            ? product.images
            : product.image
              ? [product.image]
              : [],
        );
      } else {
        this.form.reset({
          name: '',
          categoryId: this.categories().at(0)?.id ?? 0,
          price: 0,
          stock: 0,
          description: '',
        });
        this.existingImages.set([]);
      }

      this.selectedImages.set([]);
      this.submitted.set(false);
    });

    effect(() => {
      // Categories may arrive after the modal opens; keep add mode category valid.
      if (this.mode() !== 'add' || this.productData()) {
        return;
      }

      const categories = this.categories();
      if (!categories.length) {
        return;
      }

      const currentCategoryId = Number(this.form.controls.categoryId.value ?? 0);
      const hasCurrentCategory = categories.some((category) => category.id === currentCategoryId);

      if (!hasCurrentCategory || currentCategoryId < 1) {
        this.form.patchValue({ categoryId: categories[0].id });
      }
    });
  }

  get title(): string {
    const mode = this.mode();
    if (mode === 'add') return 'Add Product';
    if (mode === 'edit') return 'Edit Product';
    return 'Delete Product';
  }

  onFileSelected(event: Event): void {
    const files = Array.from((event.target as HTMLInputElement).files || []);
    if (!files.length) return;

    const validTypes = ['image/jpeg', 'image/png'];
    const validFiles = files.filter((file) => validTypes.includes(file.type));
    if (!validFiles.length) {
      return;
    }

    const readPromises = validFiles.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(typeof reader.result === 'string' ? reader.result : '');
          };
          reader.readAsDataURL(file);
        }),
    );

    Promise.all(readPromises).then((images) => {
      const sanitized = images.filter((img) => Boolean(img));
      if (!sanitized.length) {
        return;
      }

      this.selectedImages.set(sanitized);
    });
  }

  cancel(): void {
    this.onCancel.emit();
  }

  submit(): void {
    if (this.mode() === 'delete') {
      const id = this.productData()?.id;
      if (id !== undefined) {
        this.onDelete.emit(id);
      }
      return;
    }

    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.getRawValue();
    const current = this.productData();
    const selectedImages = this.selectedImages();
    const selectedCategoryId = Number(values.categoryId ?? 0);
    const selectedCategory = this.categories().find(
      (category) => category.id === selectedCategoryId,
    );

    const images =
      selectedImages.length > 0
        ? selectedImages
        : (current?.images ?? (current?.image ? [current.image] : []));

    const payload: SellerProduct = {
      id: current?.id ?? 0,
      name: values.name ?? '',
      category: selectedCategory?.name ?? current?.category ?? 'Uncategorized',
      categoryId: selectedCategoryId || current?.categoryId || 0,
      price: Number(values.price ?? 0),
      stock: Number(values.stock ?? 0),
      description: values.description ?? '',
      image: images[0] || current?.image || '',
      images,
      status: current?.status ?? 'Pending',
    };

    this.onSave.emit(payload);
  }
}
