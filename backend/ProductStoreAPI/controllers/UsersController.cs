using Microsoft.AspNetCore.Mvc;
using ProductStoreAPI.Models;
using ProductStoreAPI.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public UsersController(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    // login
    [HttpPost("login")]
    [AllowAnonymous]
    public IActionResult Login([FromBody] LoginModel model)
    {
        var user = _context.Users.FirstOrDefault(u =>
            u.UserName == model.UserName && u.Password == model.Password);

        if (user == null)
            return Unauthorized();

        var token = GenerateJwtToken(user);
        return Ok(new { token });
    }

    // get all users
    [HttpGet]
    [Authorize(Policy = "Admin")]
    public IActionResult GetAll()
    {
        return Ok(_context.Users.ToList());
    }

    // get user by id
    [HttpGet("{id}")]
    [Authorize(Policy = "Admin")]
    public IActionResult GetById(int id)
    {
        var user = _context.Users.Find(id);
        if (user == null)
            return NotFound();

        return Ok(user);
    }

    // del user
    [HttpDelete("{id}")]
    [Authorize(Policy = "Admin")]
    public IActionResult Delete(int id)
    {
        var user = _context.Users.Find(id);
        if (user == null)
            return NotFound();

        _context.Users.Remove(user);
        _context.SaveChanges();
        return NoContent();
    }

    // sing in
    [HttpPost("register")]
    [AllowAnonymous]
    public IActionResult Register(User user)
    {
        _context.Users.Add(user);
        _context.SaveChanges();
        return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
    }

    // update user
    [HttpPut("{id}")]
    [Authorize(Policy = "RegisteredUser")]
    public IActionResult Update(int id, User updatedUser)
    {
        if (!User.HasClaim("IsAdmin", "true") &&
            !User.HasClaim(ClaimTypes.NameIdentifier, id.ToString()))
            return Forbid();

        var user = _context.Users.Find(id);
        if (user == null)
            return NotFound();

        user.UserName = updatedUser.UserName;
        user.Email = updatedUser.Email;
        user.Phone = updatedUser.Phone;

        if (User.HasClaim("IsAdmin", "true"))
        {
            user.IsAdmin = updatedUser.IsAdmin;
        }

        _context.SaveChanges();
        return NoContent();
    }

    private string GenerateJwtToken(User user)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim("IsAdmin", user.IsAdmin.ToString().ToLower())
        };

        var jwtKey = _configuration["Jwt:Key"] ??
            throw new InvalidOperationException("Key not configured");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.Now.AddMinutes(
            Convert.ToDouble(
                _configuration["Jwt:ExpiryInMinutes"] ?? "60"
            )
        );

        var token = new JwtSecurityToken(
            _configuration["Jwt:Issuer"] ?? throw new InvalidOperationException("JWT Issuer not configured"),
            _configuration["Jwt:Audience"] ?? throw new InvalidOperationException("JWT Audience not configured"),
            claims,
            expires: expires,
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public class LoginModel
{
    public required string UserName { get; set; }
    public required string Password { get; set; }
}
