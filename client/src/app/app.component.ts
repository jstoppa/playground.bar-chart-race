import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenizeResult } from '@angular/compiler/src/ml_parser/lexer';
import { Component, HostBinding } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { PlaidErrorMetadata, PlaidErrorObject, PlaidEventMetadata, PlaidSuccessMetadata } from './plaid-config.model';
import { PlaidLinkHandler } from './plaid-link-handler';
import { PlaidApi } from './plaid.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  title = 'appName';
  svg: any;

  constructor(private plaidApi: PlaidApi, private appConfigService: AppConfigService, private http: HttpClient) {
  }

  connectToPlaid() {
    if (AppConfigService?.settings?.apiService) {
      this.http.get(`${AppConfigService.settings.apiService}/api/plaid/token/create`,
        { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), responseType: 'text' }
      ).toPromise().then((accessToken: string) => {
        this.plaidApi
          .createPlaid({
            token: accessToken,
            onSuccess: (publicToken, metadata) => this.onSuccess(publicToken, metadata),
            onExit: (err, metadata) => this.onExit(err, metadata),
            onEvent: (eventName, metadata) => this.onEvent(eventName, metadata),
            onLoad: () => { },
          }).then((plaidHandler) => {
            plaidHandler.open();
          });
      });
    }
  }

  onExit(error: PlaidErrorObject, metadata: PlaidErrorMetadata) {
    // debugger;
  }

  onEvent(eventName: string, metadata: PlaidEventMetadata) {
    // debugger;
  }

  onSuccess(token: string, metadata: PlaidSuccessMetadata) {
    // debugger;
  }
}

