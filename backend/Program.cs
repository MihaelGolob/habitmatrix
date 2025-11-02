using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();
builder.Services.AddIdentityApiEndpoints<IdentityUser>().AddEntityFrameworkStores<HmDbContext>();
builder.Services.AddDbContext<HmDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Debug")));

var app = builder.Build();

if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapGet("/", () => Results.Redirect("/swagger"));

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.MapGroup("api").MapIdentityApi<IdentityUser>();
app.Run();