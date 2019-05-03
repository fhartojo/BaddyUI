import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActionService } from '../action.service';
import { StatusResponse } from '../status-response';
import { ShotProfileEnum } from '../shot-profile-enum.enum';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  constructor(private actionService: ActionService) { }

  private shotStats: ShotStat[] = [];
  public statusResponse: StatusResponse;
  public dataSource = new MatTableDataSource<ShotStat>();
  public displayedColumns: string[] = ['type', 'count'];

  ngOnInit() {
    this.actionService.getStatus().subscribe({
      next: response => this.statusResponse = response
      , complete: () => {
        this.shotStats = [];

        for (var j in ShotProfileEnum) {
          if (typeof ShotProfileEnum[j] === 'number') {
            let stat = new ShotStat();
    
            stat.type = j;
            stat.count = this.statusResponse.Stats[<any> ShotProfileEnum[j] - 1];
    
            this.shotStats.push(stat);
          }
        }

        this.dataSource.data = [...this.shotStats];
      }
    });
  }
}

export class ShotStat {
  type: string;
  count: number;
}
