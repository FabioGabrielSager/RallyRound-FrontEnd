import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass} from "@angular/common";

@Component({
  selector: 'rr-search-results-list',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './search-results-list.component.html',
  styleUrl: './search-results-list.component.css'
})
export class SearchResultsListComponent {
  @Input() resultsList: string[] = [];
  @Output() onSelectedResult = new EventEmitter();

  onClickSearchResult($event: any) {
    this.onSelectedResult.emit($event);
  }
}
