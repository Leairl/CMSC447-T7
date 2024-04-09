using CMSC447_T7.database;
using CMSC447_T7.database.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
namespace CMSC447_T7.backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly DatabaseContext _databaseContext;
        public UserController(DatabaseContext databaseContext) //constructor requires databasecontext variable name for DatabaseContext (type)
        {
            _databaseContext = databaseContext;
        }
        /// <summary>
        /// verify login user
        /// </summary>
        /// <param name="userObject"></param>
        /// <returns></returns>
        [HttpPost("authentication")] 
        public async Task<IActionResult> Authentication([FromBody] User userObject) //background completion on task for verification (users can all log in at same time)
        {
            if(userObject == null)
            {
                return BadRequest();
            }

            var user = await _databaseContext.Users.FirstOrDefaultAsync(user => user.Email == userObject.Email && user.PasswordHash == userObject.PasswordHash);
                //waits for data to be checked asynchrously - both users simutaneously logging in do not interfere with each other
                //makes a request to check if there is a matching email and password
            if(user == null)
                return NotFound(new { Message = "User Not Found!" });
            var claims = new List<Claim>
            {
                new Claim(type: ClaimTypes.Email, value: user.Email),
            };
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(identity),
                new AuthenticationProperties
                {
                    IsPersistent = true,
                    AllowRefresh = true,
                    ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(10),
                });
            return Ok(new
            {
                Message = "Login Success"
            });
        }
        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] User userObject) 
        { 
            if (userObject == null)
                return BadRequest();
            if (string.IsNullOrEmpty(userObject.Email))
                return BadRequest();
            if (string.IsNullOrEmpty(userObject.PasswordHash))
                return BadRequest();
            await _databaseContext.Users.AddAsync(userObject); //userObject is adding user into table database
            await _databaseContext.SaveChangesAsync(); //save changes in database
            return Ok(new
            {
                Message = "User Registered"
            });
        }

        [Authorize]
        [HttpGet("signout")]
        public async Task SignOutAsync()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme); //clear cookie/token when logging out
        }
        [Authorize]
        [HttpGet("user")]
        public IActionResult GetUser()
        {
            var userClaims = User.Claims.Select(x => new UserClaim(x.Type, x.Value)).ToList();
            return Ok(userClaims);
        }
    }
}
