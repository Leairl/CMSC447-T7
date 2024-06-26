using CMSC447_T7.backend.Helpers;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.Extensions.DependencyInjection;
using System.Text.Json.Serialization;

// App Settings
var configuration = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile("appsettings.development.json", optional: true, reloadOnChange: true) // optional development
    .Build();

var builder = WebApplication.CreateBuilder(args);


// Add Stripe API key from appsettings.json
var stripeApiKey = configuration["Stripe:ApiKey"]; 
Stripe.StripeConfiguration.ApiKey = stripeApiKey;
// Add services to the container.

builder.Services.AddControllers().AddNewtonsoftJson(options => options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
//Connect to the database
DbHelper.AddDatabase(builder.Services, configuration.GetConnectionString("Default"));

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        builder =>
        {

            //you can configure your custom policy
            builder.AllowAnyOrigin()
                                .AllowAnyHeader()
                                .AllowAnyMethod();
        });
});

//.............
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme) //add authentication cookie after login
    .AddCookie(options =>
    {
        options.Events.OnRedirectToLogin = (context) =>
        {
            context.Response.StatusCode = 401;
            return Task.CompletedTask;
        };
    });

var app = builder.Build();
app.UseCors();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication(); //authentication (checks if user exists) of API calls to backend
app.UseAuthorization(); //authorization (already a user and allowed to make changes - are you allowed to access this page)

app.MapControllers();
DbHelper.CreateOrUpdateDatabase(app);

app.MapFallbackToFile("/index.html");


app.Run();
