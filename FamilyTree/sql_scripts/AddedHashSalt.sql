BEGIN TRANSACTION;
GO

ALTER TABLE [Users] ADD [Salt] nvarchar(max) NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20201216164238_PasswordHashSalt', N'5.0.0');
GO

COMMIT;
GO

