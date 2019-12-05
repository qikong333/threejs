import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-layer',
  templateUrl: './layer.component.html',
  styleUrls: ['./layer.component.scss']
})
export class LayerComponent implements OnInit {
  @Input() items;
  constructor() { }

  ngOnInit() {
  }

}
