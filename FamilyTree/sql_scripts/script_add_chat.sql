BEGIN TRANSACTION;
GO

CREATE TABLE [Chats] (
    [ChatId] int NOT NULL IDENTITY,
    [User1Id] int NOT NULL,
    [User2Id] int NOT NULL,
    [LastMessageTime] datetime2 NOT NULL,
    CONSTRAINT [PK_Chats] PRIMARY KEY ([ChatId])
);
GO

CREATE TABLE [Messages] (
    [MessageId] int NOT NULL IDENTITY,
    [ChatId] int NOT NULL,
    [CreationTime] datetime2 NOT NULL,
    [FromId] int NOT NULL,
    [ToId] int NOT NULL,
    [Text] nvarchar(max) NULL,
    [Sent] bit NOT NULL,
    CONSTRAINT [PK_Messages] PRIMARY KEY ([MessageId]),
    CONSTRAINT [FK_Messages_Chats_ChatId] FOREIGN KEY ([ChatId]) REFERENCES [Chats] ([ChatId]) ON DELETE CASCADE
);
GO

CREATE UNIQUE INDEX [IX_Chats_User1Id_User2Id] ON [Chats] ([User1Id], [User2Id]);
GO

CREATE INDEX [IX_Messages_ChatId] ON [Messages] ([ChatId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20201211174214_AddChat', N'5.0.0');
GO

COMMIT;
GO

