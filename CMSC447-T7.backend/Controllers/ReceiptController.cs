using CMSC447_T7.database;
using CMSC447_T7.database.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe.Checkout;
namespace CMSC447_T7.backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReceiptController : ControllerBase
    {
        private readonly DatabaseContext _databaseContext;
        public ReceiptController(DatabaseContext databaseContext) //constructor requires databasecontext variable name for DatabaseContext (type)
        {
            _databaseContext = databaseContext;
        }

        // GET: api/user/receipt/{id}
        [HttpGet("receipt/{id}")]
        public async Task<ActionResult<Receipt>> GetReceipt(int id)
        {
            var receipt = await _databaseContext.Receipts
                .Include(r => r.ReceiptItems)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (receipt == null)
            {
                return NotFound();
            }

            return receipt;
        }

        [HttpPost("receipt/{id}")]
        public async Task<ActionResult<Receipt>> CreateReceipt(Receipt receipt)
        {
            if (receipt == null)
            {
                return BadRequest();
            }
            await _databaseContext.Receipts.AddAsync(receipt); //add item to database
            receipt.UserId = int.Parse(this.User.Claims.ElementAt(1).Value); //get user ID 
            await _databaseContext.SaveChangesAsync(); //save item to database
            return Ok();

        }

        // POST: api/user/receipt/{id}/add
        [HttpPost("receipt/{id}/add")]
        public async Task<ActionResult<Receipt>> AddItemToReceipt(int id, ReceiptItem item)
        {
            var receipt = await _databaseContext.Receipts
                .Include(r => r.ReceiptItems)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (receipt == null)
            {
                return NotFound();
            }

            receipt.ReceiptItems.Add(item);
            await _databaseContext.SaveChangesAsync();

            return Ok(receipt);
        }

        // DELETE: api/user/receipt/{receiptId}/item/{itemId}
        [HttpDelete("receipt/{receiptId}/remove")]
        public async Task<ActionResult<Receipt>> RemoveItemFromReceipt(int receiptId, int itemId)
        {
            var receipt = await _databaseContext.Receipts
                .Include(r => r.ReceiptItems)
                .FirstOrDefaultAsync(r => r.Id == receiptId);

            if (receipt == null)
            {
                return NotFound();
            }

            var itemToRemove = receipt.ReceiptItems.FirstOrDefault(i => i.Id == itemId);
            if (itemToRemove == null)
            {
                return NotFound();
            }

            receipt.ReceiptItems.Remove(itemToRemove);
            await _databaseContext.SaveChangesAsync();

            return Ok(receipt);
        }

                // POST: api/user/receipt/{id}/checkout
        [HttpPost("receipt/{id}/checkout")]
        public async Task<ActionResult<string>> CheckoutReceipt(int id)
        {
            var receipt = await _databaseContext.Receipts
                .Include(r => r.ReceiptItems)
                .ThenInclude(ri => ri.Item)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (receipt == null)
            {
                return NotFound();
            }

            var lineItems = receipt.ReceiptItems.Select(ri => new SessionLineItemOptions
            {
                PriceData = new SessionLineItemPriceDataOptions
                {
                    Currency = "usd",
                    ProductData = new SessionLineItemPriceDataProductDataOptions
                    {
                        Name = ri.Item.Name
                    },
                    UnitAmount = (long)(ri.Item.Price * 100), // Convert price to cents for stripe
                },
                Quantity = ri.Item.Quantity
            }).ToList();

            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = lineItems,
                Mode = "payment",
                SuccessUrl = "https://localhost:4200/success",
                CancelUrl = "https://localhost:4200/cancel"
            };

            var service = new SessionService();
            var session = await service.CreateAsync(options);

            return session.Id;
        }
    }
}
