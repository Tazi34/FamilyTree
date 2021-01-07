BEGIN TRANSACTION;
GO

CREATE INDEX [IX_Posts_UserId] ON [Posts] ([UserId]);
GO

ALTER TABLE [Posts] ADD CONSTRAINT [FK_Posts_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([UserId]) ON DELETE CASCADE;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20210107210553_UserInPostFix', N'5.0.0');
GO

COMMIT;
GO

