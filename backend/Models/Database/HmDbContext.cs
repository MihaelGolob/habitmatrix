using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend.Models;

public class HmDbContext(DbContextOptions<HmDbContext> options) : IdentityDbContext(options) {
    public DbSet<UserModel> AppUsers { get; set; }

    protected override void OnModelCreating(ModelBuilder builder) {
        base.OnModelCreating(builder);

        // todo add habit models
    }
}