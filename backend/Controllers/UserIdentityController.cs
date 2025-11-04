using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace backend.Api;

public class UserIdentityController(UserManager<UserModel> userManager, IOptions<HmSettings> hmSettings)
    : ControllerBase {
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserRegistrationModel userRegistration) {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var user = new UserModel {
            Email = userRegistration.Email,
            UserName = userRegistration.Email,
            Name = userRegistration.Name
        };

        var result = await userManager.CreateAsync(user, userRegistration.Password);

        if (result.Succeeded)
            return Ok(result);

        foreach (var error in result.Errors)
            ModelState.AddModelError(error.Code, error.Description);

        return ValidationProblem(ModelState);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserLoginModel userLogin) {
        var user = await userManager.FindByEmailAsync(userLogin.Email);

        if (user == null || !await userManager.CheckPasswordAsync(user, userLogin.Password))
            return BadRequest(new { message = "Email or password is incorrect" });

        var signKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(hmSettings.Value.JwtSecret));
        var tokenDescriptor = new SecurityTokenDescriptor {
            Subject = new ClaimsIdentity([new Claim("UserID", user.Id)]),
            Expires = DateTime.UtcNow.AddMinutes(10),
            SigningCredentials = new SigningCredentials(signKey, SecurityAlgorithms.HmacSha256)
        };
        var tokenHandler = new JwtSecurityTokenHandler();
        var securityToken = tokenHandler.CreateToken(tokenDescriptor);
        var token = tokenHandler.WriteToken(securityToken);

        return Ok(new { token });
    }

    public class UserLoginModel {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class UserRegistrationModel {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}