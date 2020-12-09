BEGIN TRANSACTION;
GO

ALTER TABLE [Users] ADD [Sex] nvarchar(max) NULL;
GO

ALTER TABLE [Nodes] ADD [Sex] nvarchar(max) NULL;
GO

ALTER TABLE [Nodes] ADD [X] int NOT NULL DEFAULT 0;
GO

ALTER TABLE [Nodes] ADD [Y] int NOT NULL DEFAULT 0;
GO

CREATE TABLE [NodeNodeMarriage] (
    [Partner1Id] int NOT NULL,
    [Partner2Id] int NOT NULL,
    CONSTRAINT [PK_NodeNodeMarriage] PRIMARY KEY ([Partner1Id], [Partner2Id]),
    CONSTRAINT [FK_NodeNodeMarriage_Nodes_Partner1Id] FOREIGN KEY ([Partner1Id]) REFERENCES [Nodes] ([NodeId]) ON DELETE CASCADE,
    CONSTRAINT [FK_NodeNodeMarriage_Nodes_Partner2Id] FOREIGN KEY ([Partner2Id]) REFERENCES [Nodes] ([NodeId]) ON DELETE NO ACTION
);
GO

CREATE INDEX [IX_NodeNodeMarriage_Partner2Id] ON [NodeNodeMarriage] ([Partner2Id]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20201207192528_AddedMarriages', N'5.0.0');
GO

COMMIT;
GO

