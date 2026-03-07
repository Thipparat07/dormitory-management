import { Routes } from '@angular/router';
import { Login } from './page/login/login';
import { Register } from './page/register/register';
import { Main } from './page/main/main';
import { Dormdata } from './page/dormdata/dormdata';
import { FromOwner } from './page/from-owner/from-owner';
import { OwnerAddbank } from './page/owner-addbank/owner-addbank';
import { Rentbill } from './page/rentbill/rentbill';
import { BillDetails } from './page/bill-details/bill-details';
import { OverduePayment } from './page/overdue-payment/overdue-payment';
import { Transferreceipt } from './page/transferreceipt/transferreceipt';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    // { path: '', redirectTo: 'login', pathMatch: 'full' },
    // { path: 'login', component: Login },
    // { path: 'register', component: Register },
    { path: 'main', component: Main },
    { path: 'dormdata', component: Dormdata },
    { path: 'from-owner', component: FromOwner },
    { path: 'owner-addbank', component: OwnerAddbank },
    { path: 'rentbill', component: Rentbill },
    { path: 'bill-details', component: BillDetails },
    { path: 'overdue-payment', component: OverduePayment },
    { path: 'transferreceipt', component: Transferreceipt },

    { path: '', redirectTo: 'login', pathMatch: 'full' },

    { path: 'login', component: Login },
    { path: 'register', component: Register },

    // { path: 'main', component: Main, canActivate: [authGuard] },
    // { path: 'dormdata', component: Dormdata, canActivate: [authGuard] },
    // { path: 'from-owner', component: FromOwner, canActivate: [authGuard] },
    // { path: 'owner-addbank', component: OwnerAddbank, canActivate: [authGuard] },
    // { path: 'rentbill', component: Rentbill, canActivate: [authGuard] },
    // { path: 'bill-details', component: BillDetails, canActivate: [authGuard] },
    // { path: 'overdue-payment', component: OverduePayment, canActivate: [authGuard] },
    // { path: 'transferreceipt', component: Transferreceipt, canActivate: [authGuard] },
];
