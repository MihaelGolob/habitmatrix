using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class HabitModel {
    [Key] public int Id { get; set; }

    [Required] [MaxLength(100)] public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(7)]
    [Column(TypeName = "varchar(7)")]
    public string ColorHex { get; set; } = "#FF0000";

    [Required] public string UserId { get; set; } = string.Empty;

    public UserModel? User { get; set; }
    public ICollection<HabitEntryModel> Entries { get; set; } = new List<HabitEntryModel>();
}