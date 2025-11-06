using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Api;

public class HabitController(HmDbContext _context) : ControllerBase {
    public class HabitCreateModel {
        public string Name { get; set; } = string.Empty;
        public string ColorHex { get; set; } = "#FFFF00";
    }

    [HttpPost("AddHabit")]
    public async Task<IActionResult> AddHabit(string userId, [FromBody] HabitCreateModel habit) {
        if (string.IsNullOrWhiteSpace(habit.Name))
            return BadRequest("Name is required.");

        var exists = await _context.Habits.AnyAsync(h =>
            h.UserId == userId && h.Name.Trim().ToLower() == habit.Name.Trim().ToLower());
        if (exists)
            return Conflict("A habit with this name already exists.");

        var entity = new HabitModel {
            UserId = userId,
            Name = habit.Name,
            ColorHex = string.IsNullOrWhiteSpace(habit.ColorHex) ? "#000000" : habit.ColorHex
        };

        _context.Habits.Add(entity);

        try {
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetHabitById), new { userId, habitId = entity.Id }, null);
        }
        catch (DbUpdateException) {
            return BadRequest();
        }
    }

    [HttpPut("UpdateHabit")]
    public async Task<IActionResult> UpdateHabit(string userId, int habitId, [FromBody] HabitCreateModel habit) {
        var u = _context.AppUsers.Include(userModel => userModel.Habits).SingleOrDefault(u => u.Id == userId);
        if (u == null) return NotFound();
        var h = u.Habits.SingleOrDefault(h => h.Id == habitId);
        if (h == null) return NotFound();

        var exists = await _context.Habits.AnyAsync(hm =>
            hm.UserId == userId && hm.Name.Trim().ToLower() == habit.Name.Trim().ToLower() && hm.Id != habitId);

        if (exists) return Conflict("A habit with this name already exists.");

        h.ColorHex = habit.ColorHex;
        h.Name = habit.Name;
        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpGet("GetHabit")]
    public async Task<IActionResult> GetHabitById(string userId, int habitId) {
        var h = await _context.Habits.SingleOrDefaultAsync(x => x.Id == habitId && x.UserId == userId);
        return h is null ? NotFound() : Ok(h);
    }

    [HttpGet("GetAllHabits")]
    public async Task<IActionResult> GetAllHabits(string userId) {
        var h = await _context.Habits.ToListAsync();
        return Ok(h);
    }

    [HttpDelete("DeleteHabit")]
    public async Task<IActionResult> DeleteHabit(string userId, int habitId) {
        var h = _context.Habits.FirstOrDefault(h => h.Id == habitId && h.UserId == userId);
        if (h == null) return NotFound();

        _context.Habits.Remove(h);
        await _context.SaveChangesAsync();
        return Ok();
    }
}