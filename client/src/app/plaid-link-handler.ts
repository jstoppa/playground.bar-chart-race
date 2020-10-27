import { PlaidConfig } from './plaid-config.model';

declare let Plaid: any;

export class PlaidLinkHandler {

  private plaidLink: any;

  constructor(config: PlaidConfig) {
    this.plaidLink = Plaid.create(config);
  }

  public open(institution?: string): void {
    this.plaidLink.open(institution);
  }

  public exit(): void {
    this.plaidLink.exit();
  }
}
