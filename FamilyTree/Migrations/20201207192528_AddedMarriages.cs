using Microsoft.EntityFrameworkCore.Migrations;

namespace FamilyTree.Migrations
{
    public partial class AddedMarriages : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Sex",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Sex",
                table: "Nodes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "X",
                table: "Nodes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Y",
                table: "Nodes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "NodeNodeMarriage",
                columns: table => new
                {
                    Partner1Id = table.Column<int>(type: "int", nullable: false),
                    Partner2Id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NodeNodeMarriage", x => new { x.Partner1Id, x.Partner2Id });
                    table.ForeignKey(
                        name: "FK_NodeNodeMarriage_Nodes_Partner1Id",
                        column: x => x.Partner1Id,
                        principalTable: "Nodes",
                        principalColumn: "NodeId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_NodeNodeMarriage_Nodes_Partner2Id",
                        column: x => x.Partner2Id,
                        principalTable: "Nodes",
                        principalColumn: "NodeId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_NodeNodeMarriage_Partner2Id",
                table: "NodeNodeMarriage",
                column: "Partner2Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NodeNodeMarriage");

            migrationBuilder.DropColumn(
                name: "Sex",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Sex",
                table: "Nodes");

            migrationBuilder.DropColumn(
                name: "X",
                table: "Nodes");

            migrationBuilder.DropColumn(
                name: "Y",
                table: "Nodes");
        }
    }
}
