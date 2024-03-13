using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMSC447_T7.database.Models
{
    public class ItemReview
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        [ForeignKey("Item")]
        public int ItemId { get; set; }
        public DateTime CreateDate { get; set; }
        [Column(TypeName = "smallint")]
        public int Rating { get; set; }
        [Column(TypeName = "text")]
        public string? Comment { get; set; }

        //Navigation Properties
        public User? User { get; set; }
        public Item? Item { get; set; }
    }
}

