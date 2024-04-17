import { Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthService } from './login/services/auth.service';
import { UpdateQuoteOrderComponent } from './home/update-quote-order/update-quote-order.component';
import { AuthGuard } from './login/services/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: LandingComponent },
    { path: '', component: LandingComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegistrationComponent },
    { path: 'dashboard', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'dashboard/updatequoteOrder/:pendingOrderId/:equipmentType/:originZipId/:destinationZipId/:pickUpDate', component: UpdateQuoteOrderComponent, canActivate: [AuthGuard] }
];
