public class PlaidApiConfig
{
  public string EnvUrl { get; set; }
  public string ClientId { get; set; }
  public string Secret { get; set; }
} 

public class PlaidApiTokenResponse {
  public string expiration { get; set; }
  public string link_token { get; set; }
  public string request_id { get; set; }
}

public class PlaidApiTokenExchangeRequest {
  public string public_token { get; set; }
}
public class PlaidApiTokenExchangeResponse {
  public string access_token { get; set; }
  public string item_id { get; set; }
  public string request_id { get; set; }
}

public class PlaidApiTransactionsRequest {
  public string from { get; set; }
  public string to { get; set; }
  public string access_token { get; set; }
}

public class PlaidApiTransactionsResponse {
  
}
