using CMSC447_T7.database;
using CMSC447_T7.database.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;
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
                new Claim(type: ClaimTypes.Sid, value: user.Id.ToString()),//sid - security id saves user id to cookie
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
        [Authorize] //has a valid cookie to read claims out of cookie to return to user.
        [HttpGet("user")]
        public IActionResult GetUser()
        {
            var userClaims = User.Claims.Select(x => new UserClaim(x.Type, x.Value)).ToList(); //establishing var userClaims to retrieve email from cookie in UI.
            return Ok(userClaims);
        }
        [Authorize] //has a valid cookie to read claims out of cookie to return to user.
        [HttpGet("onboard-seller")]
        public async Task<IActionResult> OnboardSeller([FromQuery]string returnUrl)
        {
            
            var userId = int.Parse(this.User.Claims.ElementAt(1).Value);
            var user = await _databaseContext.Users.FirstOrDefaultAsync(user => user.Id == userId);
            if (user.StripeAccountId == null){
                var email = this.User.Claims.ElementAt(0).Value;
                var accountService = new AccountService(); //create account for user
                var accountOptions = new AccountCreateOptions { //prefills data for stripe
                    Email = email,
                    BusinessType = "individual",
                    BusinessProfile = new AccountBusinessProfileOptions{
                        ProductDescription = userId.ToString()
                    },
                    Type = "express"
                };
                var account = await accountService.CreateAsync(accountOptions); //creates account in stripe
                user.StripeAccountId = account.Id; //sets stripe account Id into user entity
                await _databaseContext.SaveChangesAsync(); //saves stripeaccountid into database
            }


            
            var accountLinkService = new AccountLinkService();
            var options = new AccountLinkCreateOptions {
                Type = "account_onboarding",  // user makes request to a account onboarding
                ReturnUrl = returnUrl,   //redirects to our website url
                RefreshUrl = returnUrl,
                Account = user.StripeAccountId,
            };
            var accountLink = await accountLinkService.CreateAsync(options);
            return Ok(accountLink.Url); //retrieves onboarding link, will redirect to frontend
        }
        [Authorize] //has a valid cookie to read claims out of cookie to return to user.
        [HttpGet("sellerStatus")]
         public async Task<IActionResult> SellerStatus(){
            var userId = int.Parse(this.User.Claims.ElementAt(1).Value); //found authenicated user
            var user = await _databaseContext.Users.FirstOrDefaultAsync(user => user.Id == userId); //checks authenicated user if user in database and returns specific user id row
            if (user.StripeAccountId == null) //no account made
                return Ok(new List<string>(){"No Seller Account Created"});
            var accountService = new AccountService(); //create account for user
            var stripeAccount = await accountService.GetAsync(user.StripeAccountId); //assign stripeaccount with user.stripeaccountId
            return Ok(stripeAccount.Requirements.CurrentlyDue); //returns any requirements for stripe account
         }
    }
}
