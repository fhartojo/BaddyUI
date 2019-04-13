import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StatusResponse } from './status-response';
import { PlayModeRequest }  from './play-mode-request';
import { PlayModeResponse } from './play-mode-response';
import { SequenceRequest } from './sequence-request';

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

    console.log(JSON.stringify(playModeRequest));

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
    sequenceRequest.Strokes = [0];
    sequenceRequest.Speeds = [0];
    sequenceRequest.LoopMode = 0;

    console.log(sequenceRequest);

    return this.http.post<StatusResponse>(`http://${this.host}${this.sequenceEndpoint}`, JSON.stringify(sequenceRequest), httpOptions);
  }

  public setHost(host: string): void {
    this.host = host;
  }

  public getHost(): string {
    return this.host;
  }
}
