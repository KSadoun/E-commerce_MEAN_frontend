import { HttpInterceptorFn } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';

const getGuestId = (): string => {
  let guestId = localStorage.getItem('guestId');
  if (!guestId) {
    guestId = uuidv4();
    localStorage.setItem('guestId', guestId);
  }
  return guestId;
};

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    headers['x-guest-id'] = getGuestId();
  }

  req = req.clone({ setHeaders: headers });
  return next(req);
};