import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppBarChartRaceComponent } from './app-bar-chart-race.component';
import { AppConfigService } from './app-config.service';
import { HttpClientModule } from '@angular/common/http';

export function initializeApp(appConfigService: AppConfigService) {
  return (): Promise<any> => {
    return appConfigService.load();
  };
}

@NgModule({
  declarations: [
    AppComponent,
    AppBarChartRaceComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: initializeApp, deps:  [AppConfigService], multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
