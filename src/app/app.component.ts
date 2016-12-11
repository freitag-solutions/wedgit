import { Component, ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { MdInput, MdListItem } from '@angular/material';
import { IWedgeItem } from '../models/IWedgeItem';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  searchPlaceholder = 'wedg.it';
  searchResults: IWedgeItem[] = [];
  index = -1;

  @ViewChild('main') main: ElementRef;
  @ViewChild('searchInput') searchInput: MdInput;
  @ViewChildren('result') resultsList: QueryList<MdListItem>;

  triggerSearch() {
    var query = this.searchInput.value;
    this.searchResults = (window as any).app.triggerSearch(query);
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
