import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { Column, DataItem } from './data-table/data-table.component';

interface ApiResponse {
  products: Product[];
}

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  columns: Column[] = [
    { title: 'ID', field: 'id' },
    {
      title: 'Title',
      field: 'title',
      style: 'text-align: left',
      includeInSearch: true,
      sortable: true,
    },
    {
      title: 'Description',
      field: 'description',
      style: 'text-align: left',
      includeInSearch: true,
      sortable: true,
    },
    { title: 'Price', field: 'price', sortable: true },
    { title: 'Discount %', field: 'discountPercentage' },
    { title: 'Rating', field: 'rating', sortable: true },
  ];

  rowData: Product[] = [];

  selectedRow: DataItem | null = null;

  ngOnInit(): void {
    fetch('https://dummyjson.com/products')
      .then((response) => response.json())
      .then((response: ApiResponse) => {
        console.debug(response);
        this.rowData = response.products;
      });
  }

  onSelectedRowChange(row: DataItem | null) {
    this.selectedRow = row;
  }
}
