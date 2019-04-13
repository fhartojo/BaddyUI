import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StatusResponse } from './status-response';
import { PlayModeRequest }  from './play-mode-request';
import { PlayModeResponse } from './play-mode-response';
import { SequenceRequest } from './sequence-request';
import { SetSpeedRequest } from './set-speed-request';
import { SetSpeedResponse } from './set-speed-response';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
};

@Injectable({
  providedIn: 'root'
})
export class ActionService {

  private host: string = "";
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
    return this.http.get<StatusResponse>(`http://${this.host}${this.statusEndpoint}`);
  }

  public setPlayMode(playMode: number): Observable<PlayModeResponse> {
    let playModeRequest = new PlayModeRequest();
    playModeRequest.PlayMode = playMode;

    return this.http.post<PlayModeResponse>(`http://${this.host}${this.setPlayModeEndpoint}`, JSON.stringify(playModeRequest), httpOptions);
  }

  public getPlayModeDump(): Observable<PlayModeResponse> {
    return this.http.get<PlayModeResponse>(`http://${this.host}${this.playModeDumpEndpoint}`);
  }

  public startSequence(sequence: number[], mode: number, interval: number): Observable<any> {
    let sequenceRequest = new SequenceRequest();

    sequenceRequest.Type = "SEQ";
    sequenceRequest.Strokes = [...sequence];
    sequenceRequest.Speeds = [];

    for (var i = 0; i < sequence.length; i++) {
      sequenceRequest.Speeds[i] = interval;
    }

    sequenceRequest.LoopMode = mode;

    return this.http.post<any>(`http://${this.host}${this.sequenceEndpoint}`, JSON.stringify(sequenceRequest), httpOptions);
  }

  public stopSequence(): Observable<StatusResponse> {
    let sequenceRequest = new SequenceRequest();

    sequenceRequest.Type = "ABT";
    sequenceRequest.Strokes = [];
    sequenceRequest.Speeds = [];
    sequenceRequest.LoopMode = 0;

    return this.http.post<StatusResponse>(`http://${this.host}${this.sequenceEndpoint}`, JSON.stringify(sequenceRequest), httpOptions);
  }

  public setSpeed(speeds: number[], playMode: number): Observable<SetSpeedResponse> {
    let setSpeedRequest = new SetSpeedRequest();

    setSpeedRequest.PlayMode = playMode;
    setSpeedRequest.Speeds = [...speeds];

    return this.http.post<SetSpeedResponse>(`http://${this.host}${this.setSpeedEndpoint}`, JSON.stringify(setSpeedRequest), httpOptions);
  }

  public setHost(host: string): void {
    this.host = host;
  }

  public getHost(): string {
    return this.host;
  }
}
