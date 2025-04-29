import { Component, inject, signal } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { AuthApiService } from '../../services/authapi.service';
import { ToastManagerService } from '../../services/toastr.service';
import { ValidationService } from '../../services/validation.service';
import { FooterComponent } from '../../footer/footer.component';
import { PopupDialogComponent } from '../popup-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule, MatProgressSpinnerModule, MatSelectModule,RouterLink,FooterComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  isLoading = signal(false);
  authService = inject(AuthApiService);
  toastr = inject(ToastrService);
  toastManagerService = inject(ToastManagerService);
  validationService = inject(ValidationService);
  route = inject(Router);
  dialog = inject(MatDialog);

  form = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required, Validators.minLength(2),Validators.pattern('^[a-zA-Z ]+$'), this.validationService.noWhiteSpaceMinLengthValidator(2)]
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(8), Validators.maxLength(20), this.validationService.noWhiteSpaceMinLengthValidator(8)]
    }),
    role: new FormControl('', {
      validators: [Validators.required]
    }),
    phone: new FormControl('', {
      validators: [Validators.required, Validators.pattern("\\d{10}")]
    }),
    address: new FormControl('',{
      validators:[Validators.required]
    })
  })

  get isNameInvalid(){
    return this.form.controls.name.touched && this.form.controls.name.invalid;
  }
  get isEmailInvalid(){
    return this.form.controls.email.touched && this.form.controls.email.invalid;
  }
  get isPasswordInvalid(){
    return this.form.controls.password.touched && this.form.controls.password.invalid;
  }
  get isRoleInvalid(){
    return this.form.controls.role.touched && this.form.controls.role.invalid;
  }
  get isPhoneInvalid(){
    return this.form.controls.phone.touched && this.form.controls.phone.invalid;
  }
  get isAddressInvalid(){
    return this.form.controls.address.touched && this.form.controls.address.invalid;
  }

  // Submit registration form
  async onSubmit(){
    if(this.form.valid){
      this.isLoading.set(true);

      const registerData: any = {//RegisterData = {
        name: this.form.controls.name.value!,
        email: this.form.controls.email.value!,
        password: this.form.controls.password.value!,
        role: this.form.controls.role.value!,
        phone: this.form.controls.phone.value!,
        address: this.form.controls.address.value!,
      }

      try {
        const res = await this.authService.registerUser(registerData);
   
        this.dialog.open(PopupDialogComponent, {
          data: {
            title: 'Registration Successful',
            message: `Hi ${res.name}, please login with your credentials.`,
          },
        });
   
        this.route.navigate(['/home/login']);
      } catch (err: any) {
        let errorMsg = 'Something went wrong, please try again later';
   
        // Check for specific backend error message
        if (err.error?.message) {
          if (err.error.message.includes('Email id already registered')) {
            errorMsg = 'Email address already exists.';
          } else if (err.error.message.includes('Phone number already registered')) {
            errorMsg = 'Phone number already exists.';
          }
        }
   
        this.dialog.open(PopupDialogComponent, {
          data: {
            title: 'Registration Failed',
            message: errorMsg,
          },
        });
      } finally {
        this.isLoading.set(false);
      }
    }
   
  }
}