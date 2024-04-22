using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMSC447_T7.database.Models
{
    public class ReceiptItem
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("Item")]
        public int ItemId { get; set; }
        [ForeignKey("Receipt")]
        public int ReceiptId { get; set; }


        // Navigation Properties
        public Item? Item { get; set; }
        public Receipt? Receipt { get; set; }
    }
}