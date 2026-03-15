import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

// Authentication
import { Login } from './page/Authentication/login/login';
import { Register } from './page/Authentication/register/register';
import { LoginSuccess } from './page/Authentication/login-success/login-success';
import { ConfirmEmail } from './page/Authentication/confirm-email/confirm-email';

// Dashboards
import { TenantDashboard } from './page/Dashboards/tenant-dashboard/tenant-dashboard';
import { OwnerDashboard } from './page/Dashboards/owner-dashboard/owner-dashboard';

// Owner - Dormitory & Room Management
import { DormRegistration } from './page/dormitory-and-rooms/dorm-registration/dorm-registration';
import { RoomLayout } from './page/dormitory-and-rooms/room-layout/room-layout';
import { RoomBooking } from './page/dormitory-and-rooms/room-booking/room-booking';
import { RoomTypeManagement } from './page/dormitory-and-rooms/room-type-management/room-type-management';
import { RoomTenantDetails } from './page/dormitory-and-rooms/room-tenant-details/room-tenant-details';
import { OwnerBankAccount } from './page/owner-settings/owner-bank-account/owner-bank-account';

// Tenant - Billing & Payments
import { Billing } from './page/billing-and-payments/billing/billing';
import { InvoiceDetails } from './page/billing-and-payments/invoice-details/invoice-details';
import { OverduePayment } from './page/billing-and-payments/overdue-payment/overdue-payment';
import { UploadSlip } from './page/billing-and-payments/upload-slip/upload-slip';
import { JoinDormitory } from './page/join-dormitory/join-dormitory';

// Shared / Other
import { DormInfo } from './page/dormitory-and-rooms/dorm-info/dorm-info';
import { MaintenanceReport } from './page/maintenance-report/maintenance-report';
import { NotFound } from './page/not-found/not-found';

export const routes: Routes = [
    { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
    { path: 'login-success', redirectTo: 'auth/success', pathMatch: 'full' },
    { path: 'confirm-link', redirectTo: 'auth/confirm', pathMatch: 'full' },
    { path: 'login', redirectTo: 'auth/login', pathMatch: 'full' },
    { path: 'register', redirectTo: 'auth/register', pathMatch: 'full' },
    { path: 'owner-dashboard', redirectTo: 'owner/dashboard', pathMatch: 'full' },
    { path: 'tenant-dashboard', redirectTo: 'tenant/dashboard', pathMatch: 'full' },

    // Authentication
    {
        path: 'auth',
        children: [
            { path: 'login', component: Login },
            { path: 'register', component: Register },
            { path: 'success', component: LoginSuccess },
            { path: 'confirm', component: ConfirmEmail },
        ]
    },

    // Owner Section
    {
        path: 'owner',
        canActivate: [authGuard],
        children: [
            { path: 'dashboard', component: OwnerDashboard },
            { path: 'registration', component: DormRegistration },
            {
                path: 'dormitory/:dormId',
                children: [
                    { path: 'layout', component: RoomLayout },
                    { path: 'room-booking', component: RoomBooking },
                    { path: 'room-types', component: RoomTypeManagement },
                    { path: 'bank-account', component: OwnerBankAccount },
                    { path: 'room-details/:roomId', component: RoomTenantDetails },
                ]
            },
            // Legacy/Direct fallback if needed during transition
            { path: 'bank-account', component: OwnerBankAccount },
        ]
    },

    // Tenant Section
    {
        path: 'tenant',
        canActivate: [authGuard],
        children: [
            { path: 'dashboard', component: TenantDashboard },
            { path: 'join', component: JoinDormitory },
            { path: 'billing', component: Billing },
            { path: 'invoice/:id', component: InvoiceDetails },
            { path: 'overdue', component: OverduePayment },
            { path: 'upload-slip', component: UploadSlip },
        ]
    },

    // Shared Routes
    { path: 'dorm-info', component: DormInfo, canActivate: [authGuard] },
    { path: 'maintenance-report', component: MaintenanceReport, canActivate: [authGuard] },

    // 404 Not Found - MUST BE LAST
    { path: 'not-found', component: NotFound },
    { path: '**', redirectTo: 'not-found' }
];
