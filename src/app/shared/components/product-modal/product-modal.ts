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

  readonly imagePreview = signal<string>('');
  readonly selectedImage = signal<string | null>(null);
  readonly submitted = signal(false);

  readonly form = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    category: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(1)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
  });

  readonly changedFields = computed(() => {
    const product = this.productData();
    if (!product || this.mode() !== 'edit') {
      return new Set<string>();
    }

    const changed = new Set<string>();
    const values = this.form.getRawValue();

    if (values.name !== product.name) changed.add('name');
    if (values.category !== product.category) changed.add('category');
    if (Number(values.price) !== product.price) changed.add('price');
    if (Number(values.stock) !== product.stock) changed.add('stock');
    if (values.description !== product.description) changed.add('description');
    if (this.selectedImage()) changed.add('image');

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
          category: product.category,
          price: product.price,
          stock: product.stock,
          description: product.description,
        });
        this.imagePreview.set(product.image);
      } else {
        this.form.reset({
          name: '',
          category: this.categories().at(0)?.name ?? '',
          price: 0,
          stock: 0,
          description: '',
        });
        this.imagePreview.set('');
      }

      this.selectedImage.set(null);
      this.submitted.set(false);
    });
  }

  get title(): string {
    const mode = this.mode();
    if (mode === 'add') return 'Add Product';
    if (mode === 'edit') return 'Edit Product';
    return 'Delete Product';
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      this.selectedImage.set(result);
      this.imagePreview.set(result);
    };
    reader.readAsDataURL(file);
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

    const payload: SellerProduct = {
      id: current?.id ?? 0,
      name: values.name ?? '',
      category: (values.category as SellerProduct['category']) ?? 'Electronics',
      price: Number(values.price ?? 0),
      stock: Number(values.stock ?? 0),
      description: values.description ?? '',
      image: this.selectedImage() ?? current?.image ?? '',
      status: current?.status ?? 'Active',
    };

    this.onSave.emit(payload);
  }
}
