import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StatusResponse } from './status-response';
import { PlayModeRequest }  from './play-mode-request';
import { PlayModeResponse } from './play-mode-response';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ActionService {

  private host: string;
  private statusEndpoint: string = `/status`;
  private sequenceEndpoint: string = `/sequence`;
  private configEndpoint: string = `/config`;
  private setSpeedEndpoint: string = `/set_speed`;
  private setPlayModeEndpoint: string = `/set_play_mode`;
  private formatFileSystemEndpoint: string = `/format_file_system`;
  private playModeDumpEndpoint: string = `/playmodedump`;
  private retainerUpEndpoint: string = `/retainer_up`;
  private retainerDownEndpoint: string = `/retainer_down`;
  private switchForwardEndpoint: string = `/switch_forward`;
  private switchBackwardEndpoint: string = `/switch_backward`;

  constructor(private http: HttpClient) { }

  public getStatus(): Observable<StatusResponse> {
    return this.http.get<StatusResponse>(`${this.host}${this.statusEndpoint}`);
  }

  public setPlayMode(playMode: number): Observable<PlayModeResponse> {
    let playModeRequest = new PlayModeRequest();
    playModeRequest.PlayMode = playMode;

    return this.http.post<PlayModeResponse>(`${this.host}${this.setPlayModeEndpoint}`, playModeRequest, httpOptions);
  }

  public getPlayModeDump(): Observable<PlayModeResponse> {
    return this.http.get<PlayModeResponse>(`${this.host}${this.playModeDumpEndpoint}`);
  }

  public setHost(host: string): void {
    this.host = host;
  }
}
