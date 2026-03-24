import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RestaurantService } from '../../../services/restaurant.service';
import { Restaurant, MenuItem } from '../../../models/interfaces';
import { MenuItemCardComponent } from '../menu-item-card/menu-item-card.component';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  selector: 'app-menu-page',
  standalone: true,
  imports: [CommonModule, MenuItemCardComponent, LoaderComponent, RouterLink],
  templateUrl: './menu-page.component.html',
  styleUrl: './menu-page.component.css'
})
export class MenuPageComponent implements OnInit {
  restaurantId: number = 0;
  restaurant: Restaurant | null = null;
  menuItems: MenuItem[] = [];
  categories: string[] = [];
  selectedCategory: string = 'All';
  isLoading = true;

  private route = inject(ActivatedRoute);
  private restaurantService = inject(RestaurantService);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.restaurantId = +idParam;
      this.loadData();
    }
  }

  loadData() {
    this.restaurantService.getRestaurantById(this.restaurantId).subscribe({
      next: (res) => {
        this.restaurant = res;
      },
      error: (err) => console.error(err)
    });

    this.restaurantService.getMenuByRestaurant(this.restaurantId).subscribe({
      next: (menu) => {
        this.menuItems = menu;
        // Extract unique categories
        this.categories = ['All', ...new Set(menu.map(item => item.category))];
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  get filteredMenu() {
    if (this.selectedCategory === 'All') {
      return this.menuItems;
    }
    return this.menuItems.filter(item => item.category === this.selectedCategory);
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }
}
