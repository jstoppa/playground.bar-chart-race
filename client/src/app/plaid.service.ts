import { Injectable } from '@angular/core';
import { PlaidConfig } from './plaid-config.model';
import { PlaidLinkHandler } from './plaid-link-handler';

@Injectable({providedIn: 'root'})
export class PlaidApi {

  private loaded: Promise<void>;

  public createPlaid(config: PlaidConfig): Promise<PlaidLinkHandler> {
    return this.loadPlaid().then(() => {
      return new PlaidLinkHandler(config);
    });
  }

  public loadPlaid(): Promise<void> {
    if (!this.loaded) {
      this.loaded = new Promise<void>((resolve, reject) => {
        const script: any = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';
        script.onerror = (e: any) => reject(e);
        if (script.readyState) {
          script.onreadystatechange = () => {
            if (script.readyState === 'loaded' || script.readyState === 'complete') {
              script.onreadystatechange = null;
              resolve();
            }
          };
        } else {
          script.onload = () => {
            resolve();
          };
        }
        document.getElementsByTagName('body')[0].appendChild(script);
      });
    }

    return this.loaded;
  }
}


