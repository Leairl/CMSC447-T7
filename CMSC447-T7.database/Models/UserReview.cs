using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMSC447_T7.database.Models
{
    public class UserReview
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("ReviewedUser")]
        public int UserId { get; set; }
        [ForeignKey("ReviewerUser")]
        public int ReviewerUserId { get; set; }
        public DateTime CreateDate { get; set; }
        [Column(TypeName = "smallint")]
        public int Rating { get; set; }
        [Column(TypeName = "text")]
        public string? Comment { get; set; }

        //Navigation Properties

        public User? ReviewedUser { get; set; }
        public User? ReviewerUser { get; set; }
    }
}