using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CMSC447_T7.database.Migrations
{
    /// <inheritdoc />
    public partial class RemoveAddressInReceipt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Receipts_Addresses_AddressId",
                table: "Receipts");

            migrationBuilder.DropIndex(
                name: "IX_Receipts_AddressId",
                table: "Receipts");

            migrationBuilder.DropColumn(
                name: "AddressId",
                table: "Receipts");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AddressId",
                table: "Receipts",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Receipts_AddressId",
                table: "Receipts",
                column: "AddressId");

            migrationBuilder.AddForeignKey(
                name: "FK_Receipts_Addresses_AddressId",
                table: "Receipts",
                column: "AddressId",
                principalTable: "Addresses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
