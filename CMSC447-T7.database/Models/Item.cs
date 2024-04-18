using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMSC447_T7.database.Models
{
    public class Item
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        [Column(TypeName = "varchar(100)")]
        public string? Name { get; set; }
        [Precision(precision: 10, scale: 2)]
        public double Price { get; set; }
        public DateTime CreateDate { get; set; }
        [Column(TypeName = "smallint")]
        public int Quantity { get; set; }
        [Column(TypeName = "text")]
        public string? Description { get; set; }
        [Column(TypeName = "text")]
        public string? ImageURL { get; set; }

        //Navigation Properties
        public User? User { get; set; }
        public ICollection<ItemReview>? Reviews { get; set; }
        public ICollection<ItemTag>? Tags { get; set; }
        public ICollection<ReceiptItem>? ReceiptItems { get; set; }
    }
}
