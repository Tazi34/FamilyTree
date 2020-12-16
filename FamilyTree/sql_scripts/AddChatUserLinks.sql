BEGIN TRANSACTION;
GO

CREATE INDEX [IX_Chats_User2Id] ON [Chats] ([User2Id]);
GO

ALTER TABLE [Chats] ADD CONSTRAINT [FK_Chats_Users_User1Id] FOREIGN KEY ([User1Id]) REFERENCES [Users] ([UserId]) ON DELETE CASCADE;
GO

ALTER TABLE [Chats] ADD CONSTRAINT [FK_Chats_Users_User2Id] FOREIGN KEY ([User2Id]) REFERENCES [Users] ([UserId]) ON DELETE NO ACTION;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20201216120443_AddedChatUserLinks', N'5.0.0');
GO

COMMIT;
GO

