import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RestaurantService } from '../../../services/restaurant.service';
import { Restaurant } from '../../../models/interfaces';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  selector: 'app-admin-restaurants',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoaderComponent],
  templateUrl: './admin-restaurants.component.html',
  styleUrl: './admin-restaurants.component.css'
})
export class AdminRestaurantsComponent implements OnInit {
  restaurants: Restaurant[] = [];
  isLoading = true;
  showForm = false;
  restaurantForm: FormGroup;
  isEditing = false;
  editingId: number | null = null;
  formProcessing = false;

  private fb = inject(FormBuilder);
  private restaurantService = inject(RestaurantService);

  constructor() {
    this.restaurantForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      imageUrl: [''],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.loadRestaurants();
  }

  loadRestaurants() {
    this.isLoading = true;
    this.restaurantService.getRestaurants().subscribe({
      next: (data) => {
        this.restaurants = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  editRestaurant(r: Restaurant) {
    this.isEditing = true;
    this.editingId = r.restaurantId;
    this.restaurantForm.patchValue(r);
    this.showForm = true;
  }

  onSubmit() {
    if (this.restaurantForm.invalid) return;

    this.formProcessing = true;
    if (this.isEditing && this.editingId) {
      this.restaurantService.updateRestaurant(this.editingId, this.restaurantForm.value).subscribe({
        next: () => {
          this.loadRestaurants();
          this.resetForm();
        },
        error: (err) => {
          console.error(err);
          this.formProcessing = false;
        }
      });
    } else {
      this.restaurantService.createRestaurant(this.restaurantForm.value).subscribe({
        next: () => {
          this.loadRestaurants();
          this.resetForm();
        },
        error: (err) => {
          console.error(err);
          this.formProcessing = false;
        }
      });
    }
  }

  deleteRestaurant(id: number) {
    if(confirm('Are you sure you want to deactivate/delete this restaurant?')) {
      this.restaurantService.deleteRestaurant(id).subscribe({
        next: () => this.loadRestaurants(),
        error: (err) => console.error(err)
      });
    }
  }

  resetForm() {
    this.restaurantForm.reset({ isActive: true });
    this.isEditing = false;
    this.editingId = null;
    this.showForm = false;
    this.formProcessing = false;
  }
}
