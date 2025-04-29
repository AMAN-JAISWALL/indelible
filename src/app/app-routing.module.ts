// Angular Import
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// project import
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { WebsiteComponent } from './modules/website/website/website.component';
import { authGuard } from './_guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      
      {
        path: '',
        redirectTo: '/auth/signin',
        pathMatch: 'full'
      },
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'auth/verification',
        loadComponent: () => import('./demo/authentication/sign-up/sign-up.component'),
        canActivate : [authGuard]
      },

      {
        path: 'auth/signin',
        loadComponent: () => import('./demo/authentication/sign-in/sign-in.component')
      },
    ]
  },
  {
    path: '',
    component: WebsiteComponent,
    children: [
      {
        path: "website/dashboard",
        loadChildren: () =>
          import("./modules/website/dashboard/dashboard.module").then(
            (m) => m.DashboardModule
          ),
          canActivate : [authGuard]
      },
      {
        path: "website/reservation",
        loadChildren: () =>
          import("./modules/website/layout/layout.module").then(
            (m) => m.LayoutModule
          ),
          canActivate : [authGuard]
      },
      {
        path: "website/reservation/addreservation",
        loadChildren: () =>
          import("./modules/website/layoutdetails/layoutdetails.module").then(
            (m) => m.LayoutdetailsModule
          ),
          canActivate : [authGuard]
      },
      {
        path: "website/hotels",
        loadChildren: () =>
          import("./modules/website/itemcontent/itemcontent.module").then(
            (m) => m.ItemcontentModule
          ),
          canActivate : [authGuard]
      },
      {
        path: "website/hotels/hoteldetail",
        loadChildren: () =>
          import("./modules/website/addto-cart/addto-cart.module").then(
            (m) => m.AddtoCartModule
          ),
          canActivate : [authGuard]
      },
      {
        path: "website/usermanagement",
        loadChildren: () =>
          import("./modules/website/aboutus/aboutus.module").then(
            (m) => m.AboutusModule
          ),
          canActivate : [authGuard]
      },
      {
        path: "website/myprofile",
        loadChildren: () =>
          import("./modules/website/outdoorliving/outdoorliving.module").then(
            (m) => m.OutdoorlivingModule
          ),
          canActivate : [authGuard]
      },
      {
        path: "website/register",
        loadChildren: () =>
          import("./modules/website/registration/registration.module").then(
            (m) => m.RegistrationModule
          ),
          canActivate : [authGuard]
      },
   
      {
        path: "website/topnav",
        loadChildren: () =>
          import("./modules/website/top-nav/top-nav.module").then(
            (m) => m.TopNavModule
          ),
          canActivate : [authGuard]
      },
      {
        path: "website/home",
        loadChildren: () =>
          import("./modules/website/homepage/homepage.module").then(
            (m) => m.HomepageModule
          ),
          canActivate : [authGuard]
      },
     
      {
        path: "website/checkout",
        loadChildren: () =>
          import("./modules/website/checkout/checkout.module").then(
            (m) => m.CheckoutModule
          ),
          canActivate : [authGuard]
      },
      {
        path: "website/orderTrack",
        loadChildren: () =>
          import("./modules/website/ordertrack/ordertrack.module").then(
            (m) => m.OrdertrackModule
          ),
          canActivate : [authGuard]
      },
      {
        path: "website/thankyou",
        loadChildren: () =>
          import("./modules/website/thankyou/thankyou.module").then(
            (m) => m.ThankyouModule
          ),
          canActivate : [authGuard]
      },
    
      {
        path: "website/getintouch",
        loadChildren: () =>
          import("./modules/website/getintouch/getintouch.module").then(
            (m) => m.GetintouchModule
          ),
          canActivate : [authGuard]
      },
      {
        path: "website/career",
        loadChildren: () =>
          import("./modules/website/career/career.module").then(
            (m) => m.CareerModule
          ),
          canActivate : [authGuard]
      },
      {
        path: "website/cabinetry",
        loadChildren: () =>
          import("./modules/website/cabinetry/cabinetry.module").then(
            (m) => m.CabinetryModule
          ),
          canActivate : [authGuard]
      },
      {
        path: "website/findinspiration",
        loadChildren: () =>
          import("./modules/website/findinspiration/findinspiration.module").then(
            (m) => m.FindinspirationModule
          ),
          canActivate : [authGuard]
      },
     
    
     
     
      // {
      //   path: "two-step-verification",
      //   loadChildren: () =>
      //     import("./demo/authentication/two-step-verification/two-step-verification.module").then(
      //       (m) => m.TwoStepVerificationModule
      //     ),
      // },
    ]
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
