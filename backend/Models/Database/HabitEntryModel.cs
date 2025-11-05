using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class HabitEntryModel {
    [Key] public int Id { get; set; }
    [Required] public int HabitId { get; set; }
    [Required] [Column(TypeName = "date")] public DateTime Date { get; set; }

    public HabitModel? Habit { get; set; }
}