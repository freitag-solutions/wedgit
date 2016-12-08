import { Component, ViewChild, ElementRef } from '@angular/core';
import { MdInput } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  searchPlaceholder = 'wedg.it';
  searchResults = [];

  @ViewChild('main') main: ElementRef;
  @ViewChild('searchInput') searchInput: MdInput;

  triggerSearch() {
    var results = [];
    for (var i=0; i<(this.searchInput.value as string).length; i++)
      results.push("a");
    this.searchResults = results;
  }

  ngOnInit() {
  }
}
