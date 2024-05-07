﻿using CMSC447_T7.database;
using CMSC447_T7.database.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;
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
        [HttpGet("")]
        public async Task<ActionResult<Receipt>> GetReceipt(int receiptId)
        {
            var receipt = await _databaseContext.Receipts
                .Include(r => r.ReceiptItems)
                .ThenInclude(ri => ri.Item)
                .FirstOrDefaultAsync(r => r.Id == receiptId);

            if (receipt == null)
            {
                return NotFound(new { Message = "Receipt Not Found!" });
            }

            return Ok(receipt);
        }

        [HttpPost("create/{userId}")]
        public async Task<ActionResult<Receipt>> CreateReceipt(int userId)
        {
            try {
                var newReceipt = new Receipt { };
                await _databaseContext.Receipts.AddAsync(newReceipt); //add item to database
                newReceipt.UserId = userId;
                newReceipt.CreateDate = DateTime.Now;


                await _databaseContext.SaveChangesAsync(); //save item to database
                return Ok(newReceipt);

            } 
            
            catch (Exception ex) 
            {
                return NotFound(new { Message = "Receipt Not Found!" });
            }


        }

        // POST: api/user/receipt/{id}/add
        [HttpPost("add/{receiptId}/{itemId}")]
        public async Task<ActionResult<Receipt>> AddItemToReceipt(int receiptId, int itemId)
        {
            var receipt = await _databaseContext.Receipts
                .Include(r => r.ReceiptItems)
                .FirstOrDefaultAsync(r => r.Id == receiptId);

            if (receipt == null)
            {
                return NotFound(new { Message = "Receipt Not Found!" });
            }

            var item = await _databaseContext.Items.FindAsync(itemId);

            if (item == null)
            {
                return NotFound(new { Message = "Item Not Found!" });
            }

            // Check if the item is already associated with the receipt
            var existingReceiptItem = receipt.ReceiptItems.FirstOrDefault(ri => ri.ItemId == itemId);
            if (existingReceiptItem != null)
            {
                return Conflict(new { Message = "Item is already in the receipt!" });
            }


            var receiptItem = new ReceiptItem
            {
                ItemId = itemId,
                ReceiptId = receiptId
            };

            _databaseContext.ReceiptsItems.Add(receiptItem);
            receipt.ReceiptItems.Add(receiptItem);

            await _databaseContext.SaveChangesAsync();

            return Ok(receipt);
        }

        // DELETE: api/user/receipt/{receiptId}/item/{itemId}
        [HttpDelete("remove/{receiptId}/{itemId}")]
        public async Task<ActionResult<Receipt>> RemoveItemFromReceipt(int receiptId, int itemId)
        {
            var receipt = await _databaseContext.Receipts
                .Include(r => r.ReceiptItems)
                .FirstOrDefaultAsync(r => r.Id == receiptId);

            if (receipt == null)
            {
                return NotFound(new { Message = "Receipt Not Found!" });
            }

            var itemToRemove = receipt.ReceiptItems.FirstOrDefault(i => i.Id == itemId);
            if (itemToRemove == null)
            {
                return NotFound(new { Message = "Item Not Found!" });
            }

            receipt.ReceiptItems.Remove(itemToRemove);
            await _databaseContext.SaveChangesAsync();

            return Ok(receipt);
        }

        // POST: api/user/receipt/{id}/checkout
        [HttpPost("stripe/{receiptId}")]
        public async Task<ActionResult<string>> CheckoutReceipt(int receiptId)
        {
            var receipt = await _databaseContext.Receipts
                .Include(r => r.ReceiptItems)
                .ThenInclude(ri => ri.Item)
                .ThenInclude(i => i.User)
                .FirstOrDefaultAsync(r => r.Id == receiptId);

            if (receipt == null)
            {
                return NotFound(new { Message = "Receipt Not Found!" });
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
             var stripeAccount = receipt.ReceiptItems.First().Item.User.StripeAccountId;

            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = lineItems,
                PaymentIntentData = new SessionPaymentIntentDataOptions
                {
                    TransferData = new SessionPaymentIntentDataTransferDataOptions
                    {
                        Amount = lineItems.Sum(i => i.PriceData.UnitAmount),
                        Destination = stripeAccount
                    }
                },
                Mode = "payment",
                SuccessUrl = "http://18.188.248.179/home",
                CancelUrl = "http://18.188.248.179/home"
            };
            var service = new SessionService();
            var session = await service.CreateAsync(options);
            return Ok(session.Url);
        }


        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Receipt>>> GetReceiptsByUserId(int userId)
        {
            var receipts = await _databaseContext.Receipts
                .Where(r => r.UserId == userId)
                .ToListAsync();

            if (receipts == null || !receipts.Any())
            {
                return NotFound(new { Message = "No receipts found for the user!" });
            }

            return Ok(receipts);
        }

    }
}
