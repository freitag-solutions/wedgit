import { Component, ViewChild, ElementRef } from '@angular/core';
import { MdInput } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  searchPlaceholder = 'wedg.it';
  messages = [];

  @ViewChild('main') main: ElementRef;
  @ViewChild('searchInput') searchInput: MdInput;

  triggerSearch() {
    var msgs = [];
    for (var i=0; i<(this.searchInput.value as string).length; i++)
      msgs.push("a");
    this.messages = msgs;
  }

  ngOnInit() {
  }
}
