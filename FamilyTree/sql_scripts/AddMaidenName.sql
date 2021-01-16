BEGIN TRANSACTION;
GO

DROP TABLE [PreviousSurnames];
GO

ALTER TABLE [Users] ADD [MaidenName] nvarchar(max) NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20210116110520_AddedMaidenName', N'5.0.0');
GO

COMMIT;
GO

