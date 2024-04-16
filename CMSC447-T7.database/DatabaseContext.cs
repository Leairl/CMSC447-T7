using CMSC447_T7.database.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace CMSC447_T7.database
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) :base(options){
            this.ChangeTracker.LazyLoadingEnabled = false;
        }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<ItemReview> ItemReviews { get; set; }
        public DbSet<ItemTag> ItemTags { get; set; }
        public DbSet<Receipt> Receipts { get; set; }
        public DbSet<ReceiptItem> ReceiptsItems { get; set;}
        public DbSet<User> Users { get; set; }
        public DbSet<UserReview> UserReviews { get; set; } 
    }
}
