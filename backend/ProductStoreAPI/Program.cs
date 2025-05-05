using Microsoft.EntityFrameworkCore;
using ProductStoreAPI.Models;
using ProductStoreAPI.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ProductStoreAPI.Hubs;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();


builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    ));


builder.Services.AddSignalR();

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Admin", policy =>
        policy.RequireClaim("IsAdmin", "true"));

    options.AddPolicy("AdminOnly", policy =>
        policy.RequireClaim("IsAdmin", "true"));

    options.AddPolicy("RegisteredUser", policy =>
        policy.RequireAuthenticatedUser());
});


var jwtSettings = builder.Configuration.GetSection("Jwt");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var key = Encoding.UTF8.GetBytes(jwtSettings["Key"] ?? throw new("Missing JWT Key"));

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = jwtSettings["Issuer"] ?? throw new("Missing JWT Issuer"),
            ValidAudience = jwtSettings["Audience"] ?? throw new("Missing JWT Audience"),
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };


        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;

                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };
    });

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}


app.UseCors(x => x
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader()
    .WithOrigins("http://localhost:4200") 
    .AllowCredentials());


app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapHub<OnlineUsersHub>("/hubs/onlineUsers");

app.Run();
