using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Net.Http;
using Microsoft.Extensions.Configuration;
using System.Text;

namespace My.Functions
{
    public static class PlaidTokenExchange
    {
        [FunctionName("PlaidTokenExchange")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "plaid/token/exchange")] HttpRequest req,
            ILogger log,
            ExecutionContext context)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            var bodyRaw = await new StreamReader(req.Body).ReadToEndAsync();

            var body = JsonConvert.DeserializeObject<PlaidApiTokenExchangeRequest>(bodyRaw);

            var config = new ConfigurationBuilder()
                .SetBasePath(context.FunctionAppDirectory)
                .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
                .AddJsonFile("secret.settings.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables()
                .Build();
            
            var apiConfig = new PlaidApiConfig();
            config.Bind(nameof(PlaidApiConfig), apiConfig);

            var httpClient = new HttpClient();
            var httpRequestMessage = new HttpRequestMessage(HttpMethod.Post,
                $"https://{apiConfig.EnvUrl}/item/public_token/exchange");

            
            var content = $@"{{
                ""client_id"": ""{apiConfig.ClientId}"",
                ""secret"": ""{apiConfig.Secret}"",
                ""public_token"": ""{body.public_token}""
            }}";
            
            httpRequestMessage.Content = new StringContent(content, Encoding.UTF8, "application/json");
            
            var result = await httpClient.SendAsync(httpRequestMessage);

            var response = JsonConvert.DeserializeObject<PlaidApiTokenExchangeResponse>(await result.Content.ReadAsStringAsync());

            return new OkObjectResult(response.access_token);
        }
    }
}
