using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMSC447_T7.database.Models
{
    public class Address
    {
        [Key]
        public int Id { get; set; }
        [Column(TypeName = "varchar(50)")]
        public string? City { get; set; }
        [Column(TypeName = "varchar(100)")]
        public string? Street1 { get; set; }
        [Column(TypeName = "varchar(100)")]
        public string? Street2 { get; set; }
        [Column(TypeName = "varchar(50)")]
        public string? State { get; set; }
        [Column(TypeName = "varchar(20)")]
        public string? Zip { get; set; }

        // Navigation Properties

        [InverseProperty("BillingAddress")]
        public User? BillingAddressUser { get; set; }
        [InverseProperty("ShippingAddress")]
        public User? ShippingAddressUser { get; set; }
    }
}
