using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMSC447_T7.database.Models
{
    public class Receipt
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        public DateTime CreateDate { get; set; }

        // Navigation Properties
        public User? User { get; set; }
        public ICollection<ReceiptItem>? ReceiptItems { get; set; }
    }
}