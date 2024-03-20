import { HttpInterceptorFn } from '@angular/common/http';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('logintoken');
    const excludeApi = 'https://www.zipcodeapi.com/rest/';

    if (req.url.includes(excludeApi)) {
        return next(req);
    }
    if (token) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }
    return next(req);
};

