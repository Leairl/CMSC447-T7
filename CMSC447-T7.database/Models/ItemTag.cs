using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMSC447_T7.database.Models
{
    public class ItemTag
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("Item")]
        public int ItemId { get; set; }
        [Column(TypeName = "varchar(100)")]
        public string? Tag { get; set; }

        //Navigation Properties
        public Item? Item { get; set; }
    }
}