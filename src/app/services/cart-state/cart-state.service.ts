import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartStateService {
  private countSubject = new BehaviorSubject<number>(0);
  count$ = this.countSubject.asObservable();

  setCount(count: number) {
    this.countSubject.next(count);
  }

  getCount(): number {
    return this.countSubject.getValue();
  }

  increment() {
    this.countSubject.next(this.countSubject.getValue() + 1);
  }

  decrement() {
    const current = this.countSubject.getValue();
    this.countSubject.next(Math.max(0, current - 1));
  }

  clear() {
    this.countSubject.next(0);
  }
}