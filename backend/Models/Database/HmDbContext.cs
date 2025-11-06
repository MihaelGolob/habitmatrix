using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend.Models;

public class HmDbContext(DbContextOptions<HmDbContext> options) : IdentityDbContext(options) {
    public DbSet<UserModel> AppUsers { get; set; }
    public DbSet<HabitModel> Habits { get; set; }
    public DbSet<HabitEntryModel> HabitEntries { get; set; }

    protected override void OnModelCreating(ModelBuilder builder) {
        base.OnModelCreating(builder);

        builder.Entity<HabitModel>(entity => {
            entity.ToTable("Habits");
            entity.Property(h => h.Name).IsRequired().HasMaxLength(100);
            entity.Property(h => h.ColorHex).IsRequired().HasMaxLength(7).IsUnicode(false);
            entity.HasOne(h => h.User).WithMany(u => u.Habits).HasForeignKey(h => h.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(h => new { h.UserId, h.Name }).IsUnique();
        });

        builder.Entity<HabitEntryModel>(entity => {
            entity.ToTable("HabitEntries");
            entity.Property(e => e.Date).IsRequired().HasColumnType("date");
            entity.HasOne(e => e.Habit).WithMany(h => h.Entries).HasForeignKey(e => e.HabitId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => new { e.HabitId, e.Date }).IsUnique();
        });
    }
}