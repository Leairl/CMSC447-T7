using CMSC447_T7.database;
using CMSC447_T7.database.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata.Ecma335;
using System.Security.Claims;
namespace CMSC447_T7.backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly DatabaseContext _databaseContext;
        public ItemController(DatabaseContext databaseContext) //constructor requires databasecontext variable name - (object / instance of that class that has been created) for DatabaseContext (type) - class name
        {
            _databaseContext = databaseContext;
        }
        /// <summary>
        /// verify login user
        /// </summary>
        /// <param name="userObject"></param>
        /// <returns></returns>

        [HttpGet("")]
        public async Task<ActionResult> getItemAsync(int? itemId) //actionresult shows an http request response
        {
            if (itemId == null)
            {
                return BadRequest();
            }
            var item = await _databaseContext.Items.Include(item => item.User).Include(item => item.Reviews).Include(item => item.Tags).FirstOrDefaultAsync(item => item.Id == itemId);
            //makes a request to check if there is a matching item to the item displayed in user profile or home page
            //.include(foreign keys associated with item).
            if (item == null)
                return NotFound(new { Message = "Item Not Found!" });
            return Ok(
               item);
        }
        [Authorize]
        [HttpPost("")]
        public async Task<ActionResult> postItemAsync(Item item) //actionresult shows an http request response
        {
            if (item == null)
            {
                return BadRequest();
            }
            await _databaseContext.Items.AddAsync(item); //add item to database
            item.CreateDate = DateTime.Now; //set date
            item.UserId = int.Parse(this.User.Claims.ElementAt(1).Value); //user claims grabs id for userid, parse to convert string to int of id. 
            //Takes claims from user controller for securityid
            await _databaseContext.SaveChangesAsync(); //save item to database
            return Ok();

        }
        [HttpGet("all")]
        public async Task<ActionResult> GetAll()
        {
            return Ok(await _databaseContext.Items.Select(item => item.Id).ToListAsync()); //takes items from databasecontext and selects all ids associated to items
        }
    }
}
