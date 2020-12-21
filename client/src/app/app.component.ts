import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { Country } from './app.models';
import { EventName, PlaidErrorMetadata, PlaidErrorObject, PlaidEventMetadata, PlaidSuccessMetadata, ViewName } from './plaid-config.model';
import { PlaidApi } from './plaid.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  countries = [
    { code: 'US', name: 'United States' } as Country,
    { code: 'GB', name: 'United Kingdom' } as Country
  ];
  selectedCountry = 'GB';
  accessToken = '';
  eventName: EventName;
  metadata: PlaidEventMetadata;

  constructor(private plaidApi: PlaidApi, private appConfigService: AppConfigService, private http: HttpClient) {
  }



  connectToPlaid() {
    if (AppConfigService?.settings?.apiService) {
      this.http.get(`${AppConfigService.settings.apiService}/api/plaid/token/create?countryCode=${this.selectedCountry}`,
        { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), responseType: 'text' }
      ).toPromise().then((linkToken: string) => {
        this.plaidApi
          .createPlaid({
            token: linkToken,
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

  onEvent(eventName: EventName, metadata: PlaidEventMetadata) {
    this.eventName = eventName;
    this.metadata = metadata;
    
    if (eventName === EventName.TRANSITION_VIEW && this.metadata.view_name === ViewName.CONNECTED && this.accessToken) {
      this.http.post(`${AppConfigService.settings.apiService}/api/plaid/identity/get`,
        `{ "access_token": "${this.accessToken}" }`,
        { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), responseType: 'text' },
      ).toPromise().then((accessToken: string) => {
        debugger;
      });

    }
  }

  onSuccess(token: string, metadata: PlaidSuccessMetadata) {
    if (AppConfigService?.settings?.apiService) {
      this.http.post(`${AppConfigService.settings.apiService}/api/plaid/token/exchange`,
        `{ "public_token": "${token}" }`,
        { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), responseType: 'text' },
      ).toPromise().then((accessToken: string) => {
        this.accessToken = accessToken;
      });
    }
  }
}

