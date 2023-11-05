import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataTableComponent } from './data-table/data-table.component';
import { AgGridModule } from 'ag-grid-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomCellComponent } from './custom-cell/custom-cell.component';

@NgModule({
  declarations: [AppComponent, DataTableComponent, CustomCellComponent],
  imports: [BrowserModule, AppRoutingModule, AgGridModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
