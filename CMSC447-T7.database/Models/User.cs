
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMSC447_T7.database.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        [Column(TypeName = "varchar(30)")]
        public string? Username { get; set; }
        [Column(TypeName = "varchar(100)")]
        public string? PasswordHash { get; set; }
        [Column(TypeName = "varchar(50)")]
        public string? Email { get; set; }
        [ForeignKey("ShippingAddress")]
        public int ShippingAddressId { get; set; }
        [ForeignKey("BillingAddress")]
        public int BillingAddressId { get; set; }
        
        //Navigation Properties
        public Address? ShippingAddress { get; set; }
        public Address? BillingAddress { get; set; }
        [InverseProperty("ReviewerUser")]
        public ICollection<UserReview>? CreatedReviews { get; set; }
        [InverseProperty("ReviewedUser")]
        public ICollection<UserReview>? UserReviews { get; set; }
        public ICollection<ItemReview>? ItemReviews { get; set; }
        public ICollection<Receipt>? Receipts { get; set; }
        public ICollection<Item>? Items {  get; set; }
    }
}
