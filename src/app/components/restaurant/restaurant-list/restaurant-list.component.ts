import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantService } from '../../../services/restaurant.service';
import { Restaurant } from '../../../models/interfaces';
import { RestaurantCardComponent } from '../restaurant-card/restaurant-card.component';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  selector: 'app-restaurant-list',
  standalone: true,
  imports: [CommonModule, RestaurantCardComponent, LoaderComponent],
  templateUrl: './restaurant-list.component.html',
  styleUrl: './restaurant-list.component.css'
})
export class RestaurantListComponent implements OnInit {
  restaurants: Restaurant[] = [];
  filteredRestaurants: Restaurant[] = [];
  isLoading = true;
  searchTerm = '';

  private restaurantService = inject(RestaurantService);

  ngOnInit(): void {
    this.loadRestaurants();
  }

  loadRestaurants() {
    this.restaurantService.getRestaurants().subscribe({
      next: (data) => {
        this.restaurants = data;
        this.filteredRestaurants = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading restaurants', err);
        this.isLoading = false;
      }
    });
  }

  onSearch(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    this.filteredRestaurants = this.restaurants.filter(r => 
      r.name.toLowerCase().includes(this.searchTerm) || 
      r.address.toLowerCase().includes(this.searchTerm)
    );
  }
}
