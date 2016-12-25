import { Component, ViewChild, ViewChildren, ElementRef, QueryList, ChangeDetectorRef } from '@angular/core';
import { MdInput, MdListItem } from '@angular/material';
import { WedgeItem } from '../models/WedgeItem';
import { Subject } from '@reactivex/rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  searchPlaceholder = 'wedg.it';
  searchResults: WedgeItem[] = [];
  index = -1;
  working = false;

  @ViewChild('main') main: ElementRef;
  @ViewChild('searchInput') searchInput: MdInput;
  @ViewChildren('result') resultsList: QueryList<MdListItem>;

  constructor(private ref: ChangeDetectorRef) {

  }

  triggerSearch() {
    this.working = true;
    this.searchResults = [];
    
    let query = this.searchInput.value;
    var results = new Subject<WedgeItem>();
    results
      .bufferTime(100) // see: https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators
      .filter(wedgeItems => wedgeItems.length > 0)
      .subscribe(
        wedgeItems => {
          console.debug("Received WedgeItems", wedgeItems);
          this.searchResults = this.searchResults.concat(wedgeItems);
          this.ref.detectChanges();
        },
        () => {
          this.working = false; 
          this.ref.detectChanges();
        },
        () => {
          this.working = false; 
          this.ref.detectChanges();
        });

    (window as any).app.triggerSearch(query, results);
  }
  triggerAction() {
    if (this.index < 0 || this.index >= this.searchResults.length) {
      return;
    }

    var searchResult = this.searchResults[this.index];
    (window as any).app.triggerAction(searchResult.wedge, searchResult.uri);
  }

  up(event: Event) {
    event.preventDefault();

    this.index--;
    if (this.index < -1) {
      this.index = -1;
    }
    this.selectIndex(this.index);
  }
  down(event: Event) {
    event.preventDefault();
    
    this.index++;
    if (this.index >= this.resultsList.length) {
      this.index = this.resultsList.length - 1;
    }
    this.selectIndex(this.index);
  }
  selectIndex(index: number) {
    if (index < 0) {
      index = -1;
    } else if (index >= this.resultsList.length) {
      index = this.resultsList.length - 1;
    }

    this.resultsList.forEach(function (item: MdListItem, i: number) {
      if (i == index) {
        item._hasFocus = true;
      } else {
        item._hasFocus = false;
      }
    });

    if (index < 0) {
      this.searchInput.focus();
    }
  }
  selectElement(event: Event){
    var self = this;
    this.resultsList.forEach(function (item: MdListItem, i: number) {
      if (((item as any)._element as ElementRef).nativeElement == event.srcElement) {
        self.index = i;
        self.selectIndex(self.index);
      }
    });
  }

  minimize() {
    (window as any).app.minimize();
  }

  ngOnInit() {
  }
}
