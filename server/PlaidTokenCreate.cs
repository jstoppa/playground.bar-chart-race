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
    public static class PlaidTokenCreate
    {
        [FunctionName("PlaidTokenCreate")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "plaid/token/create")] HttpRequest req,
            ILogger log,
            ExecutionContext context)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            string countryCode = req.Query["countryCode"];

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
                $"https://{apiConfig.EnvUrl}/link/token/create");

            countryCode = string.IsNullOrEmpty(countryCode) ? "GB" : countryCode;
            
            var content = $@"{{
                ""client_id"": ""{apiConfig.ClientId}"",
                ""secret"": ""{apiConfig.Secret}"",
                ""client_name"": ""Insert Client name here"",
                ""country_codes"": [""{countryCode}""],
                ""language"": ""en"",
                ""user"": {{
                    ""client_user_id"": ""unique_user_id""
                }},
                ""products"": [""auth""]
            }}";

            httpRequestMessage.Content = new StringContent(content, Encoding.UTF8, "application/json");
            
            var result = await httpClient.SendAsync(httpRequestMessage);

            var response = JsonConvert.DeserializeObject<PlaidApiTokenResponse>(await result.Content.ReadAsStringAsync());

            return new OkObjectResult(response.link_token);
        }
    }
}
