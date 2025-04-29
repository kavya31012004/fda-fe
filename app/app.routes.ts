import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { RestaurantListComponent } from './restaurant-list/restaurant-list.component';
import { MenuComponent } from './menu/menu.component';
import { AdminRestaurantComponent } from './admin-restaurant/admin-restaurant.component';
import { CartComponent } from './cart/cart.component';
import { OrdersComponent } from './orders/orders.component';
import { RestaurantCRUDComponent } from './restaurant-crud/restaurant-crud.component';
import { RegisterComponent } from './auth/register/register.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { CreateDeliveryComponent } from './create-delivery/create-delivery.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';

export const routes: Routes = [

    {path:'',redirectTo: '/home',pathMatch:'full'},
    
    {path: 'home',component: HomeComponent,title: 'Home'},
   {path: 'home/login',component: LoginComponent},
    {path: 'home/register',component: RegisterComponent},
    {path: 'profile',component: ProfileComponent},
   
    {path: 'cart', component:CartComponent },
    {path: 'orders', component:OrdersComponent },
    {path:'admin-restaurant',component:AdminRestaurantComponent},
    {path:'restaurant-crud',component:RestaurantCRUDComponent},
    {path:'restaurants',component:RestaurantListComponent},

   
    { path: 'restaurants/menu/:id', component: MenuComponent },
    { path: 'restaurants', component: RestaurantListComponent },
    { path: 'home/login/admin-restaurant', component: AdminRestaurantComponent },

    { path: 'deliveries', component: DeliveryComponent },
    { path: 'create-delivery', component: CreateDeliveryComponent },
    { path: 'change-password', component: ChangepasswordComponent },


    //{ path: 'login', component: LoginComponent },  // 🔹 Fix: Direct login route
    //{ path: 'register', component: RegisterComponent },
   

];
