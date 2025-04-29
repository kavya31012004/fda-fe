import { Component, inject, OnInit, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, FormGroup, ReactiveFormsModule, Validators }from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthApiService } from '../../services/authapi.service';
import { ToastManagerService } from '../../services/toastr.service';
import { ValidationService } from '../../services/validation.service';
import { FooterComponent } from '../../footer/footer.component';
import { MatDialog } from '@angular/material/dialog';
import { PopupDialogComponent } from '../popup-dialog.component';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    FooterComponent,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  authService: AuthApiService = inject(AuthApiService);
  route = inject(Router);
  isLoading = signal(false);
  toastManagerService = inject(ToastManagerService);
  validationService = inject(ValidationService);
  dialog = inject(MatDialog);
  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        this.validationService.noWhiteSpaceMinLengthValidator(8)
      ]
    })
  });
  ngOnInit(): void {
    const loginMsg = this.toastManagerService.redirectToLogInMessage();
    if (loginMsg !== '') {
      this.dialog.open(PopupDialogComponent, {
        data: {
          title: 'Login',
          message: loginMsg
        }
      });
      this.toastManagerService.resetRedirectToLoginMessage();
    }
    const logoutMsg = this.toastManagerService.logOutMessage();
    if (logoutMsg !== '') {
      this.dialog.open(PopupDialogComponent, {
        data: {
          title: 'Logout',
          message: logoutMsg
        }
      });
      this.toastManagerService.resetLogOutMessage();
    }
  }
  get isEmailInvalid() {
    return this.form.controls.email.touched && this.form.controls.email.invalid;
  }
  get isPasswordInvalid() {
    return this.form.controls.password.touched &&
this.form.controls.password.invalid;
  }
  async onSubmit() {
    if (this.form.valid) {
      this.isLoading.set(true);
      const body = {
        email: this.form.controls.email.value!,
        password: this.form.controls.password.value!
      };
      try {
        const data = await this.authService.logInUser(body);
        const email = this.form.controls.email.value!;
        localStorage.setItem('userEmail', email);
        const role = await this.authService.getRoleFromDatabase(email);
        console.log(`Role retrieved: ${role}`);
        this.authService.handleLogIn(data.jwtToken);
        this.form.reset();
      } catch (err: any) {
        this.dialog.open(PopupDialogComponent, {
          data: {
            title: 'Login Failed',
            message: err.error?.message || 'Something went wrong,please try again later.'
          }
        });
      } finally {
        this.isLoading.set(false);
      }
    } else {
      this.dialog.open(PopupDialogComponent, {
        data: {
          title: 'Form Error',
          message: 'Please fill in all required fields correctly.'
        }
      });
    }
  }
}