using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();
builder.Services.AddIdentityApiEndpoints<UserModel>().AddEntityFrameworkStores<HmDbContext>();
builder.Services.Configure<IdentityOptions>(options => { options.User.RequireUniqueEmail = true; });
builder.Services.AddDbContext<HmDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Debug")));
builder.Services.AddAuthentication(x => {
    x.DefaultAuthenticateScheme = x.DefaultChallengeScheme = x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(x => {
    x.SaveToken = false;
    x.TokenValidationParameters = new TokenValidationParameters {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey =
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["AppSettings:JWTSecret"]!))
    };
});

var app = builder.Build();

if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapGet("/", () => Results.Redirect("/swagger"));

app.UseCors();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapGroup("api");

app.MapPost("api/login", async (UserManager<UserModel> userManager, [FromBody] UserLoginModel userLogin) => {
    var user = await userManager.FindByEmailAsync(userLogin.Email);

    if (user == null || !await userManager.CheckPasswordAsync(user, userLogin.Password))
        return Results.BadRequest(new { message = "Email or password is incorrect" });

    var signKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["AppSettings:JWTSecret"]!));
    var tokenDescriptor = new SecurityTokenDescriptor {
        Subject = new ClaimsIdentity([new Claim("UserID", user.Id)]),
        Expires = DateTime.UtcNow.AddMinutes(10),
        SigningCredentials = new SigningCredentials(signKey, SecurityAlgorithms.HmacSha256)
    };
    var tokenHandler = new JwtSecurityTokenHandler();
    var securityToken = tokenHandler.CreateToken(tokenDescriptor);
    var token = tokenHandler.WriteToken(securityToken);

    return Results.Ok(new { token });
});

app.MapPost("api/register",
    async (UserManager<UserModel> userManager, [FromBody] UserRegistrationModel userRegistration) => {
        var user = new UserModel {
            Email = userRegistration.Email,
            UserName = userRegistration.Email,
            Name = userRegistration.Name
        };
        var result = await userManager.CreateAsync(user, userRegistration.Password);

        return result.Succeeded ? Results.Ok(result) : Results.BadRequest(result);
    }
);

app.Run();