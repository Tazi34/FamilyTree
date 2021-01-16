using Microsoft.EntityFrameworkCore.Migrations;

namespace FamilyTree.Migrations
{
    public partial class AddedMaidenName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PreviousSurnames");

            migrationBuilder.AddColumn<string>(
                name: "MaidenName",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaidenName",
                table: "Users");

            migrationBuilder.CreateTable(
                name: "PreviousSurnames",
                columns: table => new
                {
                    PreviousSurnameId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Surname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PreviousSurnames", x => x.PreviousSurnameId);
                    table.ForeignKey(
                        name: "FK_PreviousSurnames_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PreviousSurnames_UserId",
                table: "PreviousSurnames",
                column: "UserId");
        }
    }
}
