import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { FormControl } from '@angular/forms';

export interface Column {
  title: string;
  field: string;
  style?: string;
  includeInSearch?: boolean;
  sortable?: boolean;
}

export interface DataItem {
  id: string | number;
  [key: string]: any;
}

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
})
export class DataTableComponent implements OnInit, OnChanges {
  @Input() data!: { id: string | number; [key: string]: any }[];
  @Input() displayData!: { id: string | number; [key: string]: any }[];
  @Input() columns!: Column[];
  @Input() paging: { enabled: boolean; size?: number } = { enabled: false };

  @Output() rowSelected = new EventEmitter<DataItem | null>();

  currentSort: {
    field: string;
    order: number;
  } = {} as {
    field: string;
    order: number;
  };

  searchField = new FormControl('');
  currentPage = 1;

  selectedRow: DataItem | null = null;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('data' in changes && changes['data']?.currentValue) {
      this.getFirstPage();
    }
  }

  sortAscending(column: string) {
    this.displayData.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return a[column].toLowerCase() < b[column].toLowerCase() ? -1 : 1;
      }
      return valueA - valueB;
    });
    this.currentSort = {
      field: column,
      order: 1,
    };
  }

  sortDescending(column: string) {
    this.displayData.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return a[column].toLowerCase() < b[column].toLowerCase() ? 1 : -1;
      }
      return valueB - valueA;
    });
    this.currentSort = {
      field: column,
      order: -1,
    };
  }

  onSortByColumn(column: string) {
    if (this.currentSort.field !== column) {
      this.sortAscending(column);
    } else {
      if (this.currentSort.order > 0) {
        this.sortDescending(column);
      } else {
        this.sortAscending(column);
      }
    }
  }

  onSearch() {
    if (!this.searchField.value || this.searchField.value.length < 3) {
      return;
    }
    const searchColumns = this.columns.filter(
      (column) => column.includeInSearch
    );
    this.displayData = this.data.filter((row) =>
      searchColumns.some((column) =>
        row[column.field]
          .toLowerCase()
          .includes(this.searchField.value?.toLowerCase())
      )
    );
    this.currentPage = 1;
    if (this.paging.size && this.displayData.length <= this.paging.size) {
      this.paging.enabled = false;
    }
  }

  clearSearch() {
    this.searchField.reset();
    this.paging.enabled = true;
    this.getFirstPage();
  }

  clearSort() {
    this.currentSort = {} as { field: string; order: number };
    this.getFirstPage();
  }

  getFirstPage() {
    if (this.paging.enabled && this.paging.size) {
      this.displayData = this.data.slice(0, this.paging.size);
      this.currentPage = 1;
      return;
    }
    this.displayData = JSON.parse(JSON.stringify(this.data));
  }

  getPage(next?: boolean) {
    if (this.paging.enabled && this.paging.size) {
      if (
        (!next && this.currentPage === 1) ||
        (next && this.data.length <= this.paging.size * this.currentPage)
      ) {
        return;
      }
      this.currentPage = this.currentPage + (next ? 1 : -1);

      const startIndex = this.paging.size * (this.currentPage - 1);
      const endIndex =
        this.paging.size * (this.currentPage - 1) + this.paging.size;

      console.debug('Slice indices: ', startIndex, endIndex);

      this.displayData = this.data.slice(startIndex, endIndex);
      if (this.currentSort.order === 1) {
        this.sortAscending(this.currentSort.field);
        return;
      }
      if (this.currentSort.order === -1) {
        this.sortDescending(this.currentSort.field);
      }
    }
  }

  onRowSelect(row: { id: string | number; [key: string]: any }) {
    if (this.selectedRow && this.selectedRow.id === row.id) {
      this.selectedRow = null;
      this.rowSelected.emit(null);
      return;
    }
    this.selectedRow = row;
    this.rowSelected.emit(row);
  }
}
