import { Component, OnInit } from '@angular/core';
import {ModelContentComponent} from "./model.content.component";

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})
export class ContentComponent implements OnInit {
  sections: Map<string,Array<string>>;
  data:number[]=[1,2,3]

  constructor() {
    this.sections =new ModelContentComponent().data;
  }

  ngOnInit() {}

}
