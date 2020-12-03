Build started...
Build succeeded.
IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [Posts] (
    [PostId] int NOT NULL IDENTITY,
    [UserId] int NOT NULL,
    [CreationTime] datetime2 NOT NULL,
    [Title] nvarchar(max) NULL,
    [Text] nvarchar(max) NULL,
    [PictureUrl] nvarchar(max) NULL,
    CONSTRAINT [PK_Posts] PRIMARY KEY ([PostId])
);
GO

CREATE TABLE [Trees] (
    [TreeId] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NULL,
    [IsPrivate] bit NOT NULL,
    CONSTRAINT [PK_Trees] PRIMARY KEY ([TreeId])
);
GO

CREATE TABLE [Users] (
    [UserId] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NULL,
    [Surname] nvarchar(max) NULL,
    [Email] nvarchar(max) NULL,
    [PasswordHash] nvarchar(max) NULL,
    [Role] nvarchar(max) NULL,
    [Birthday] datetime2 NOT NULL,
    [PictureUrl] nvarchar(max) NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY ([UserId])
);
GO

CREATE TABLE [Nodes] (
    [NodeId] int NOT NULL IDENTITY,
    [UserId] int NOT NULL,
    [TreeId] int NOT NULL,
    [Birthday] datetime2 NOT NULL,
    [Description] nvarchar(max) NULL,
    [Name] nvarchar(max) NULL,
    [Surname] nvarchar(max) NULL,
    [PictureUrl] nvarchar(max) NULL,
    [FatherId] int NOT NULL,
    [MotherId] int NOT NULL,
    CONSTRAINT [PK_Nodes] PRIMARY KEY ([NodeId]),
    CONSTRAINT [FK_Nodes_Trees_TreeId] FOREIGN KEY ([TreeId]) REFERENCES [Trees] ([TreeId]) ON DELETE CASCADE
);
GO

CREATE TABLE [PreviousSurnames] (
    [PreviousSurnameId] int NOT NULL IDENTITY,
    [UserId] int NOT NULL,
    [Surname] nvarchar(max) NULL,
    CONSTRAINT [PK_PreviousSurnames] PRIMARY KEY ([PreviousSurnameId]),
    CONSTRAINT [FK_PreviousSurnames_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([UserId]) ON DELETE CASCADE
);
GO

CREATE TABLE [Children] (
    [ChildId] int NOT NULL IDENTITY,
    [NodeId] int NOT NULL,
    [ChildPointer] int NOT NULL,
    CONSTRAINT [PK_Children] PRIMARY KEY ([ChildId]),
    CONSTRAINT [FK_Children_Nodes_NodeId] FOREIGN KEY ([NodeId]) REFERENCES [Nodes] ([NodeId]) ON DELETE CASCADE
);
GO

CREATE INDEX [IX_Children_NodeId] ON [Children] ([NodeId]);
GO

CREATE INDEX [IX_Nodes_TreeId] ON [Nodes] ([TreeId]);
GO

CREATE INDEX [IX_PreviousSurnames_UserId] ON [PreviousSurnames] ([UserId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20201203145256_InitialMigration', N'5.0.0');
GO

COMMIT;
GO


