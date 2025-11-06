using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Api;

public class HabitEntryController(HmDbContext _context) : ControllerBase {
    [HttpPost("AddHabitEntry")]
    public async Task<IActionResult> AddHabitEntry(string userId, int habitId) {
        var user = _context.AppUsers.Include(userModel => userModel.Habits).SingleOrDefault(u => u.Id == userId);
        if (user == null) return NotFound();
        var habit = user.Habits.SingleOrDefault(h => h.Id == habitId);
        if (habit == null) return NotFound();

        var entry = new HabitEntryModel {
            HabitId = habitId,
            Date = DateTime.UtcNow.Date
        };

        _context.HabitEntries.Add(entry);
        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpGet("GetAllHabitEntriesById")]
    public async Task<IActionResult> GetAllHabitEntries(string userId, int habitId) {
        var user = _context.AppUsers.Include(userModel => userModel.Habits).SingleOrDefault(u => u.Id == userId);
        if (user == null) return NotFound();
        var habit = user.Habits.SingleOrDefault(h => h.Id == habitId);
        if (habit == null) return NotFound();

        var entries = await _context.HabitEntries.AsNoTracking()
            .Where(e => e.HabitId == habitId && e.Habit!.UserId == userId).OrderByDescending(e => e.Date).ToListAsync();

        return Ok(entries);
    }

    [HttpDelete("DeleteHabitEntry")]
    public async Task<IActionResult> DeleteHabitEntry(int habitEntryId) {
        var he = _context.HabitEntries.SingleOrDefault(h => h.Id == habitEntryId);
        if (he == null) return NotFound();

        _context.HabitEntries.Remove(he);
        await _context.SaveChangesAsync();
        return Ok();
    }
}