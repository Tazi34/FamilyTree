BEGIN TRANSACTION;
GO

CREATE TABLE [Comments] (
    [CommentId] int NOT NULL IDENTITY,
    [Text] nvarchar(max) NULL,
    [Time] datetime2 NOT NULL,
    [UserId] int NULL,
    [PostId] int NULL,
    CONSTRAINT [PK_Comments] PRIMARY KEY ([CommentId]),
    CONSTRAINT [FK_Comments_Posts_PostId] FOREIGN KEY ([PostId]) REFERENCES [Posts] ([PostId]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Comments_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([UserId]) ON DELETE NO ACTION
);
GO

CREATE INDEX [IX_Comments_PostId] ON [Comments] ([PostId]);
GO

CREATE INDEX [IX_Comments_UserId] ON [Comments] ([UserId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20210107152116_AddCommentsMigration', N'5.0.0');
GO

COMMIT;
GO

