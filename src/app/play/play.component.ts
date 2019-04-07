import { Component, OnInit } from '@angular/core';
import { ActionService } from '../action.service';
import { ShotProfileEnum } from '../shot-profile-enum.enum';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {

  public tiles: Tile[] = [];

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

}

export class Tile {
  name: string;
  position: number;
}
