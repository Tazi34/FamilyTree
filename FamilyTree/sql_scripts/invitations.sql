BEGIN TRANSACTION;
GO

CREATE TABLE [Invitations] (
    [InvitationId] int NOT NULL IDENTITY,
    [TreeId] int NOT NULL,
    [HostId] int NOT NULL,
    [AskedUserId] int NOT NULL,
    CONSTRAINT [PK_Invitations] PRIMARY KEY ([InvitationId]),
    CONSTRAINT [FK_Invitations_Trees_TreeId] FOREIGN KEY ([TreeId]) REFERENCES [Trees] ([TreeId]) ON DELETE CASCADE,
    CONSTRAINT [FK_Invitations_Users_AskedUserId] FOREIGN KEY ([AskedUserId]) REFERENCES [Users] ([UserId]) ON DELETE CASCADE,
    CONSTRAINT [FK_Invitations_Users_HostId] FOREIGN KEY ([HostId]) REFERENCES [Users] ([UserId]) ON DELETE NO ACTION
);
GO

CREATE INDEX [IX_Invitations_AskedUserId] ON [Invitations] ([AskedUserId]);
GO

CREATE INDEX [IX_Invitations_HostId] ON [Invitations] ([HostId]);
GO

CREATE INDEX [IX_Invitations_TreeId] ON [Invitations] ([TreeId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20210102234104_invitations', N'5.0.0');
GO

COMMIT;
GO

