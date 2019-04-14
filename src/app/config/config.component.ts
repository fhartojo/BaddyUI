import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { ActionService } from '../action.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { PlayModeRequest } from '../play-mode-request';
import { PlayModeResponse } from '../play-mode-response';
import { ShotProfile } from '../shot-profile';
import { ShotProfileEnum } from '../shot-profile-enum.enum';
import { MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SetSpeedResponse } from '../set-speed-response';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('host') hostElement: ElementRef;
  public hostForm = new FormGroup({
    host: new FormControl('', [Validators.required])
  });
  public setupModeForm = new FormGroup({
    playMode: new FormControl('')
  });

  public setupModeSelections: string[] = ['On a tripod', 'On the floor'];
  private currentPlayMode: PlayModeResponse;
  private shotProfiles: ShotProfile[] = [];
  public dataSource = new MatTableDataSource<ShotProfile>();
  public displayedColumns: string[] = ['type', 'leftMotorSpeed', 'rightMotorSpeed'];

  constructor(
    private actionService: ActionService
    , private snackBar: MatSnackBar
    , public dialog: MatDialog
  ) { }

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
    let playModeSelection = Number(this.setupModeForm.get("playMode").value);

    this.actionService.setPlayMode(playModeSelection).subscribe({
      next: playModeResponse => this.currentPlayMode = playModeResponse
      , complete: () => {
        this.processCurrentPlayMode();
        this.showResponse('Setup mode successfully changed');
      }
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

    this.shotProfiles = [];

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

    this.dataSource.data = [...this.shotProfiles];
    this.setupModeForm.get("playMode").setValue(this.currentPlayMode.PlayMode);
  }

  public editMotorSpeed(shotProfile: ShotProfile): void {
    const dialogRef = this.dialog.open(EditMotorSpeedDialog, {
      width: '250px'
      , data: {type: shotProfile.type, leftMotorSpeed: shotProfile.leftMotorSpeed, rightMotorSpeed: shotProfile.rightMotorSpeed}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        shotProfile = result;
        let speeds: number[] = [];

        for (var i = 0; i < this.shotProfiles.length; i++) {
          if (shotProfile.type === this.shotProfiles[i].type) {
            this.shotProfiles[i].leftMotorSpeed = Number(shotProfile.leftMotorSpeed);
            this.shotProfiles[i].rightMotorSpeed = Number(shotProfile.rightMotorSpeed);
          }

          speeds[i * 2] = this.shotProfiles[i].leftMotorSpeed;
          speeds[i * 2 + 1] = this.shotProfiles[i].rightMotorSpeed;
        }

        let setSpeedResponse: SetSpeedResponse;
        this.actionService.setSpeed(speeds, this.currentPlayMode.PlayMode).subscribe({
          next: response => setSpeedResponse = response
          , complete: () => {
            if (setSpeedResponse.status === "success") {
              this.showResponse(`Update for ${shotProfile.type} saved`);

              this.dataSource.data = [...this.shotProfiles];
            } else {
              this.showResponse(`Update for ${shotProfile.type} failed`);
            }
          }
        });
      }
    });
  }

  public isHostSet(): boolean {
    return (this.actionService.getHost() !== "");
  }

  private showResponse(message: string): void {
    this.snackBar.open(message, '', {
      duration: 2000
    });
  }
}

@Component({
  selector: 'edit-motor-speed-dialog',
  templateUrl: 'edit-motor-speed-dialog.html'
})
export class EditMotorSpeedDialog {

  constructor(
    public dialogRef: MatDialogRef<EditMotorSpeedDialog>
    , @Inject(MAT_DIALOG_DATA) public data: ShotProfile
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }
}
