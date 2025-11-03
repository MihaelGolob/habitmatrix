using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace backend.Models;

public class UserModel : IdentityUser {
    [PersonalData]
    [Column(TypeName = "varchar(100)")]
    public string Name { get; set; } = "";
}