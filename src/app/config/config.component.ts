import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActionService } from '../action.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit, OnDestroy {

  public hostForm = new FormGroup({
    host: new FormControl('')
  });

  constructor(private actionService: ActionService) { }

  ngOnInit() {
  }

  ngOnDestroy() {

  }
  public setHost(): void {
    let host: string = this.hostForm.get("host").value.trim();

    this.actionService.setHost(host);
  }
}
