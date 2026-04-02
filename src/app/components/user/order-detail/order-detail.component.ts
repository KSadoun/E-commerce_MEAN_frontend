import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../services/order/order.service';
import { Order } from '../../../models/order';

@Component({
    selector: 'app-order-detail',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './order-detail.component.html',
    styleUrl: './order-detail.component.css',
})
export class OrderDetailComponent implements OnInit {
    order: Order | null = null;
    loading = true;
    error = '';
    cancelling = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private orderService: OrderService
    ) {}

    ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.loadOrder(id);
    }

    loadOrder(id: number) {
        this.loading = true;
        this.orderService.getOrderById(id).subscribe({
            next: (order) => {
                this.order = order;
                this.loading = false;
            },
            error: () => {
                this.error = 'Order not found';
                this.loading = false;
            },
        });
    }

    canCancel(): boolean {
        if (!this.order) return false;
        return !['shipped', 'delivered', 'cancelled'].includes(this.order.status);
    }

    cancelOrder() {
        if (!this.order) return;
        this.cancelling = true;

        this.orderService.cancelOrder(this.order.id).subscribe({
            next: (res: any) => {
                this.order = res.order;
                this.cancelling = false;
            },
            error: (err) => {
                this.error = err.error?.message || 'Failed to cancel order';
                this.cancelling = false;
            },
        });
    }

    getStatusColor(status: string): string {
        switch (status) {
            case 'placed': return 'bg-blue-100 text-blue-700';
            case 'confirmed': return 'bg-indigo-100 text-indigo-700';
            case 'processing': return 'bg-yellow-100 text-yellow-700';
            case 'shipped': return 'bg-purple-100 text-purple-700';
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            case 'pending_payment': return 'bg-orange-100 text-orange-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    }

    goBack() {
        this.router.navigate(['/orders']);
    }
}