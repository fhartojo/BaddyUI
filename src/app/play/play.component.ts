import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ActionService } from '../action.service';
import { ShotProfileEnum } from '../shot-profile-enum.enum';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit, OnDestroy, AfterViewInit {

  public tiles: Tile[] = [];
  public modeSelections: string[] = ['Once', 'Continuous', 'Random'];
  public intervalSelections: string[] = ['0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5'];
  public sequence: number[] = [];
  public playForm = new FormGroup({
    strokes: new FormControl({value: '', disabled: true}, [Validators.required]),
    mode: new FormControl('', [Validators.required]),
    interval: new FormControl('', [Validators.required])
  });

  constructor(
    private actionService: ActionService
    , private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    for (var j in ShotProfileEnum) {
      if (typeof ShotProfileEnum[j] === 'number') {
        let tile = new Tile();

        tile.name = j;
        tile.position = <any> ShotProfileEnum[j];

        this.tiles.push(tile);
      }
    }

    if (sessionStorage) {
      if (sessionStorage.length > 0) {
        this.playForm.get("mode").setValue(Number(sessionStorage.getItem("mode")));
        this.playForm.get("interval").setValue(Number(sessionStorage.getItem("interval")));
        this.sequence = JSON.parse(sessionStorage.getItem("strokes"));
        this.playForm.get("strokes").setValue(this.sequence);
      }
    }
  }

  ngOnDestroy() {
    if (sessionStorage) {
      sessionStorage.setItem("mode", this.playForm.get("mode").value);
      sessionStorage.setItem("interval", this.playForm.get("interval").value);
      sessionStorage.setItem("strokes", JSON.stringify(this.sequence));
    }
  }

  ngAfterViewInit() {
  }

  public addSequence(position: number): void {
    let newSequence: number[] = [position];

    this.sequence = this.sequence.concat(newSequence);
    this.playForm.get("strokes").setValue(this.sequence);
  }

  public startSequence(): void {
    let mode = Number(this.playForm.get("mode").value);
    let interval = Number(this.playForm.get("interval").value);

    console.log(`sequence:  ${this.sequence}`);
    console.log(`mode:  ${mode}`);
    console.log(`interval:  ${interval}`);

    this.actionService.startSequence(this.sequence, mode, interval).subscribe({
      complete: () => this.showResponse('Sequence start successfully sent')
    });
  }

  public stopSequence(): void {
    let isRunning: boolean = true;

    this.actionService.stopSequence().subscribe({
      next: statusResponse => isRunning = statusResponse.Running
      , complete: () => this.showResponse(isRunning ? 'Sequence failed to terminate' : 'Sequence successfully terminated')
    });
  }

  public resetAll(): void {
    this.sequence = [];
    this.playForm.get("strokes").setValue("");
    this.playForm.get("mode").setValue("");
    this.playForm.get("interval").setValue("");
  }

  public isHostSet(): boolean {
    return (this.actionService.getHost() !== "");
  }

  public isStrokesSet(): boolean {
    return (this.sequence.length > 0);
  }

  private showResponse(message: string): void {
    this.snackBar.open(message, '', {
      duration: 2000
    });
  }
}

export class Tile {
  name: string;
  position: number;
}
