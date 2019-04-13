import { Component, OnInit } from '@angular/core';
import { ActionService } from '../action.service';
import { ShotProfileEnum } from '../shot-profile-enum.enum';
import { SequenceRequest } from '../sequence-request';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {

  public tiles: Tile[] = [];
  public sequence: number[] = [];
  public sequenceMode: string = "";
  public sequenceInterval: string = "";
  public interval: number[] = [];

  constructor(private actionService: ActionService) { }

  ngOnInit() {
    for (var j in ShotProfileEnum) {
      if (typeof ShotProfileEnum[j] === 'number') {
        let tile = new Tile();

        tile.name = j;
        tile.position = <any> ShotProfileEnum[j];

        this.tiles.push(tile);
      }
    }
  }

  public addSequence(position: number): void {
    let newSequence: number[] = [position];

    this.sequence = this.sequence.concat(newSequence);
  }

  public startSequence(): void {
    console.log(`this.sequence:  ${this.sequence}`);
    console.log(`this.sequenceMode:  ${this.sequenceMode}`);
    console.log(`this.sequenceInterval:  ${this.sequenceInterval}`);

    this.actionService.startSequence(this.sequence, Number(this.sequenceMode), Number(this.sequenceInterval)).subscribe();
  }

  public stopSequence(): void {
    this.actionService.stopSequence().subscribe();
  }

  public setSequenceInterval(event: any): void {
  }

  public resetAll(): void {
    this.sequence = [];
    this.sequenceMode = "";
    this.sequenceInterval = "";
  }
}

export class Tile {
  name: string;
  position: number;
}
