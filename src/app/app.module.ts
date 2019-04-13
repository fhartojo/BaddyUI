import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfigComponent } from './config/config.component';
import { EditMotorSpeedDialog } from './config/config.component';
import { PlayComponent } from './play/play.component';
import { StatusComponent } from './status/status.component';
import 'hammerjs';

@NgModule({
  declarations: [
    AppComponent,
    ConfigComponent,
    EditMotorSpeedDialog,
    PlayComponent,
    StatusComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatTabsModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatGridListModule,
    MatRippleModule,
    MatSelectModule,
    MatRadioModule,
    MatSnackBarModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    EditMotorSpeedDialog
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
