import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RestaurantService } from '../../../services/restaurant.service';
import { MenuItem, Restaurant } from '../../../models/interfaces';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  selector: 'app-admin-menu',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoaderComponent],
  templateUrl: './admin-menu.component.html',
  styleUrl: './admin-menu.component.css'
})
export class AdminMenuComponent implements OnInit {
  restaurantId: number = 0;
  restaurant: Restaurant | null = null;
  menuItems: MenuItem[] = [];
  
  isLoading = true;
  showForm = false;
  menuForm: FormGroup;
  isEditing = false;
  editingId: number | null = null;
  formProcessing = false;

  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private restaurantService = inject(RestaurantService);

  constructor() {
    this.menuForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('restaurantId');
    if (idParam) {
      this.restaurantId = +idParam;
      this.loadData();
    }
  }

  loadData() {
    this.isLoading = true;
    this.restaurantService.getRestaurantById(this.restaurantId).subscribe({
      next: (res) => this.restaurant = res,
      error: (err) => console.error(err)
    });

    this.restaurantService.getMenuByRestaurant(this.restaurantId).subscribe({
      next: (data) => {
        this.menuItems = data;
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
    if (!this.showForm) this.resetForm();
  }

  editItem(item: MenuItem) {
    this.isEditing = true;
    this.editingId = item.itemId;
    this.menuForm.patchValue({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category
    });
    this.showForm = true;
  }

  onSubmit() {
    if (this.menuForm.invalid) return;

    this.formProcessing = true;
    const formData = { ...this.menuForm.value, restaurantId: this.restaurantId };

    if (this.isEditing && this.editingId) {
      this.restaurantService.updateMenuItem(this.editingId, formData).subscribe({
        next: () => {
          this.loadData();
          this.resetForm();
        },
        error: (err) => {
          console.error(err);
          this.formProcessing = false;
        }
      });
    } else {
      this.restaurantService.createMenuItem(formData).subscribe({
        next: () => {
          this.loadData();
          this.resetForm();
        },
        error: (err) => {
          console.error(err);
          this.formProcessing = false;
        }
      });
    }
  }

  toggleAvailability(id: number) {
    this.restaurantService.toggleMenuItemAvailability(id).subscribe({
      next: () => this.loadData(),
      error: (err) => console.error(err)
    });
  }

  resetForm() {
    this.menuForm.reset({ price: 0 });
    this.isEditing = false;
    this.editingId = null;
    this.showForm = false;
    this.formProcessing = false;
  }
}
