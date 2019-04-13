import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActionService } from '../action.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { PlayModeRequest } from '../play-mode-request';
import { PlayModeResponse } from '../play-mode-response';
import { ShotProfile } from '../shot-profile';
import { ShotProfileEnum } from '../shot-profile-enum.enum';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('host') hostElement: ElementRef;
  public hostForm = new FormGroup({
    host: new FormControl('')
  });

  private currentPlayMode: PlayModeResponse;
  private shotProfiles: ShotProfile[] = [];
  public playModeSelection: string;
  public dataSource = new MatTableDataSource<ShotProfile>();
  public displayedColumns: string[] = ['type', 'leftMotorSpeed', 'rightMotorSpeed'];

  constructor(private actionService: ActionService) { }

  ngOnInit() {
    let savedHost = this.actionService.getHost();

    if (savedHost !== "") {
      this.hostForm.get("host").setValue(savedHost);
      this.getPlayModeDump();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.hostElement.nativeElement.focus();
    }, 0);
  }

  ngOnDestroy() {
  }

  public setHost(): void {
    let host: string = this.hostForm.get("host").value.trim();

    if (host !== "") {
      this.actionService.setHost(host);
    }
  }

  public setPlayMode(event: any): void {
    console.log(`this.playModeSelection:  ${this.playModeSelection}`);

    this.actionService.setPlayMode(Number(this.playModeSelection)).subscribe({
      next: playModeResponse => this.currentPlayMode = playModeResponse
      , complete: () => this.processCurrentPlayMode()
    });
  }

  public getPlayModeDump(): void {
    this.actionService.getPlayModeDump().subscribe({
      next: playModeResponse => this.currentPlayMode = playModeResponse
      , complete: () => this.processCurrentPlayMode()
    });
  }

  private processCurrentPlayMode(): void {
    let i = 0;

    for (var j in ShotProfileEnum) {
      if (typeof ShotProfileEnum[j] === 'number') {
        let shotProfile = new ShotProfile();

        shotProfile.type = j;
        shotProfile.leftMotorSpeed = this.currentPlayMode.CurrentSpeeds[i];
        shotProfile.rightMotorSpeed = this.currentPlayMode.CurrentSpeeds[i + 1];

        this.shotProfiles.push(shotProfile);

        i += 2;
      }
    }

    this.dataSource.data = this.shotProfiles;
    this.playModeSelection = String(this.currentPlayMode.PlayMode);
  }

  public editMotorSpeed(shotProfile: ShotProfile): void {
    console.log(shotProfile);
  }
}
