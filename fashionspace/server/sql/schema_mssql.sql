-- FashionSpace - Banco de Dados (SQL Server/SSMS)
-- Execute no SSMS. Este script cria o banco, tabelas, índices, triggers e views.

SET NOCOUNT ON;

-- 1) Criar banco de dados se não existir
IF DB_ID(N'FashionSpace') IS NULL
BEGIN
  CREATE DATABASE FashionSpace;
END
GO

USE FashionSpace;
GO

-- 2) Tabelas
-- OBS: Usamos uniqueidentifier (GUID) com DEFAULT NEWID() para chaves

IF OBJECT_ID(N'dbo.users', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.users (
    id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_users PRIMARY KEY DEFAULT NEWID(),
    nome NVARCHAR(150) NOT NULL,
    email NVARCHAR(255) NULL UNIQUE,
    senha_hash NVARCHAR(200) NULL,
    tipoUsuario NVARCHAR(20) NOT NULL CONSTRAINT DF_users_tipoUsuario DEFAULT N'casual',
    fotoPerfilUsuario NVARCHAR(500) NULL,
    dataCadastro DATETIME2(3) NOT NULL CONSTRAINT DF_users_dataCadastro DEFAULT SYSUTCDATETIME()
  );
END
GO

IF OBJECT_ID(N'dbo.bazares', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.bazares (
    id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_bazares PRIMARY KEY DEFAULT NEWID(),
    nome NVARCHAR(200) NOT NULL,
    descricao NVARCHAR(MAX) NULL,
    imagem NVARCHAR(500) NULL,
    categoria NVARCHAR(50) NULL,
    cep NVARCHAR(20) NULL,
    rua NVARCHAR(200) NULL,
    numero NVARCHAR(20) NULL,
    bairro NVARCHAR(120) NULL,
    cidade NVARCHAR(120) NULL,
    telefone NVARCHAR(40) NULL,
    horario NVARCHAR(120) NULL,
    criadoPor UNIQUEIDENTIFIER NULL,
    avaliacao DECIMAL(4,2) NOT NULL CONSTRAINT DF_bazares_avaliacao DEFAULT (0),
    totalAvaliacoes INT NOT NULL CONSTRAINT DF_bazares_totalAval DEFAULT (0),
    createdAt DATETIME2(3) NOT NULL CONSTRAINT DF_bazares_createdAt DEFAULT SYSUTCDATETIME(),
    updatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_bazares_updatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_bazares_users_criadoPor FOREIGN KEY (criadoPor) REFERENCES dbo.users(id) ON DELETE SET NULL
  );
END
GO

IF OBJECT_ID(N'dbo.favorites', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.favorites (
    userId UNIQUEIDENTIFIER NOT NULL,
    bazarId UNIQUEIDENTIFIER NOT NULL,
    createdAt DATETIME2(3) NOT NULL CONSTRAINT DF_favorites_createdAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_favorites PRIMARY KEY (userId, bazarId),
    CONSTRAINT FK_fav_user FOREIGN KEY (userId) REFERENCES dbo.users(id) ON DELETE CASCADE,
    CONSTRAINT FK_fav_bazar FOREIGN KEY (bazarId) REFERENCES dbo.bazares(id) ON DELETE CASCADE
  );
END
GO

IF OBJECT_ID(N'dbo.posts', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.posts (
    id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_posts PRIMARY KEY DEFAULT NEWID(),
    userId UNIQUEIDENTIFIER NOT NULL,
    content NVARCHAR(MAX) NULL,
    image NVARCHAR(500) NULL,
    [timestamp] DATETIME2(3) NOT NULL CONSTRAINT DF_posts_timestamp DEFAULT SYSUTCDATETIME(),
    shares INT NOT NULL CONSTRAINT DF_posts_shares DEFAULT (0),
    CONSTRAINT FK_posts_user FOREIGN KEY (userId) REFERENCES dbo.users(id) ON DELETE CASCADE
  );
END
GO

IF OBJECT_ID(N'dbo.post_likes', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.post_likes (
    postId UNIQUEIDENTIFIER NOT NULL,
    userId UNIQUEIDENTIFIER NOT NULL,
    createdAt DATETIME2(3) NOT NULL CONSTRAINT DF_post_likes_createdAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_post_likes PRIMARY KEY (postId, userId),
    CONSTRAINT FK_post_likes_post FOREIGN KEY (postId) REFERENCES dbo.posts(id) ON DELETE CASCADE,
    -- IMPORTANTE: para evitar múltiplos caminhos em cascata, NÃO usar ON DELETE CASCADE aqui
    CONSTRAINT FK_post_likes_user FOREIGN KEY (userId) REFERENCES dbo.users(id)
  );
END
GO

IF OBJECT_ID(N'dbo.post_comments', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.post_comments (
    id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_post_comments PRIMARY KEY DEFAULT NEWID(),
    postId UNIQUEIDENTIFIER NOT NULL,
    userId UNIQUEIDENTIFIER NULL,
    content NVARCHAR(MAX) NULL,
    [timestamp] DATETIME2(3) NOT NULL CONSTRAINT DF_post_comments_timestamp DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_post_comments_post FOREIGN KEY (postId) REFERENCES dbo.posts(id) ON DELETE CASCADE,
    -- IMPORTANTE: para evitar múltiplos caminhos em cascata, NÃO usar ON DELETE CASCADE aqui
    CONSTRAINT FK_post_comments_user FOREIGN KEY (userId) REFERENCES dbo.users(id)
  );
END
GO

IF OBJECT_ID(N'dbo.reviews', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.reviews (
    id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_reviews PRIMARY KEY DEFAULT NEWID(),
    bazarId UNIQUEIDENTIFIER NOT NULL,
    userId UNIQUEIDENTIFIER NOT NULL,
    stars TINYINT NOT NULL CHECK (stars BETWEEN 1 AND 5),
    content NVARCHAR(MAX) NULL,
    [timestamp] DATETIME2(3) NOT NULL CONSTRAINT DF_reviews_timestamp DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_reviews_bazar FOREIGN KEY (bazarId) REFERENCES dbo.bazares(id) ON DELETE CASCADE,
    CONSTRAINT FK_reviews_user FOREIGN KEY (userId) REFERENCES dbo.users(id) ON DELETE CASCADE
  );
END
GO

IF OBJECT_ID(N'dbo.messages', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.messages (
    id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_messages PRIMARY KEY DEFAULT NEWID(),
    bazarId UNIQUEIDENTIFIER NOT NULL,
    userId UNIQUEIDENTIFIER NULL,
    sender NVARCHAR(50) NOT NULL CONSTRAINT DF_messages_sender DEFAULT N'system',
    content NVARCHAR(MAX) NULL,
    [timestamp] DATETIME2(3) NOT NULL CONSTRAINT DF_messages_timestamp DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_messages_bazar FOREIGN KEY (bazarId) REFERENCES dbo.bazares(id) ON DELETE CASCADE,
    CONSTRAINT FK_messages_user FOREIGN KEY (userId) REFERENCES dbo.users(id) ON DELETE SET NULL
  );
END
GO

-- 3) Índices
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_bazares_categoria' AND object_id = OBJECT_ID('dbo.bazares'))
  CREATE INDEX IX_bazares_categoria ON dbo.bazares(categoria);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_bazares_cidade' AND object_id = OBJECT_ID('dbo.bazares'))
  CREATE INDEX IX_bazares_cidade ON dbo.bazares(cidade);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_bazares_criadoPor' AND object_id = OBJECT_ID('dbo.bazares'))
  CREATE INDEX IX_bazares_criadoPor ON dbo.bazares(criadoPor);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_reviews_bazarId' AND object_id = OBJECT_ID('dbo.reviews'))
  CREATE INDEX IX_reviews_bazarId ON dbo.reviews(bazarId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_reviews_userId' AND object_id = OBJECT_ID('dbo.reviews'))
  CREATE INDEX IX_reviews_userId ON dbo.reviews(userId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_favorites_userId' AND object_id = OBJECT_ID('dbo.favorites'))
  CREATE INDEX IX_favorites_userId ON dbo.favorites(userId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_favorites_bazarId' AND object_id = OBJECT_ID('dbo.favorites'))
  CREATE INDEX IX_favorites_bazarId ON dbo.favorites(bazarId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_posts_userId' AND object_id = OBJECT_ID('dbo.posts'))
  CREATE INDEX IX_posts_userId ON dbo.posts(userId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_post_comments_postId' AND object_id = OBJECT_ID('dbo.post_comments'))
  CREATE INDEX IX_post_comments_postId ON dbo.post_comments(postId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_post_likes_postId' AND object_id = OBJECT_ID('dbo.post_likes'))
  CREATE INDEX IX_post_likes_postId ON dbo.post_likes(postId);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_messages_bazarId' AND object_id = OBJECT_ID('dbo.messages'))
  CREATE INDEX IX_messages_bazarId ON dbo.messages(bazarId);
GO

-- 4) Triggers
-- Atualiza updatedAt a cada update em bazares
IF OBJECT_ID(N'dbo.trg_bazares_set_updatedAt', N'TR') IS NOT NULL
  DROP TRIGGER dbo.trg_bazares_set_updatedAt;
GO
CREATE TRIGGER dbo.trg_bazares_set_updatedAt
ON dbo.bazares
AFTER UPDATE
AS
BEGIN
  SET NOCOUNT ON;
  UPDATE b
    SET updatedAt = SYSUTCDATETIME()
  FROM dbo.bazares b
  INNER JOIN inserted i ON b.id = i.id;
END;
GO

-- Recalcula avaliacao e totalAvaliacoes após INSERT em reviews
IF OBJECT_ID(N'dbo.trg_reviews_ai', N'TR') IS NOT NULL
  DROP TRIGGER dbo.trg_reviews_ai;
GO
CREATE TRIGGER dbo.trg_reviews_ai
ON dbo.reviews
AFTER INSERT
AS
BEGIN
  SET NOCOUNT ON;
  ;WITH impacted AS (
    SELECT DISTINCT bazarId FROM inserted
  ), stats AS (
    SELECT r.bazarId, AVG(CAST(r.stars AS DECIMAL(10,4))) AS avgStars, COUNT(*) AS total
    FROM dbo.reviews r
    INNER JOIN impacted x ON x.bazarId = r.bazarId
    GROUP BY r.bazarId
  )
  UPDATE b
    SET b.avaliacao = s.avgStars,
        b.totalAvaliacoes = s.total
  FROM dbo.bazares b
  INNER JOIN stats s ON s.bazarId = b.id;
END;
GO

-- Recalcula após UPDATE em reviews (considera OLD e NEW)
IF OBJECT_ID(N'dbo.trg_reviews_au', N'TR') IS NOT NULL
  DROP TRIGGER dbo.trg_reviews_au;
GO
CREATE TRIGGER dbo.trg_reviews_au
ON dbo.reviews
AFTER UPDATE
AS
BEGIN
  SET NOCOUNT ON;
  ;WITH impacted AS (
    SELECT bazarId FROM inserted
    UNION
    SELECT bazarId FROM deleted
  ), stats AS (
    SELECT r.bazarId, AVG(CAST(r.stars AS DECIMAL(10,4))) AS avgStars, COUNT(*) AS total
    FROM dbo.reviews r
    INNER JOIN impacted x ON x.bazarId = r.bazarId
    GROUP BY r.bazarId
  )
  UPDATE b
    SET b.avaliacao = ISNULL(s.avgStars, 0),
        b.totalAvaliacoes = ISNULL(s.total, 0)
  FROM dbo.bazares b
  LEFT JOIN stats s ON s.bazarId = b.id
  WHERE b.id IN (SELECT bazarId FROM impacted);
END;
GO

-- Recalcula após DELETE em reviews
IF OBJECT_ID(N'dbo.trg_reviews_ad', N'TR') IS NOT NULL
  DROP TRIGGER dbo.trg_reviews_ad;
GO
CREATE TRIGGER dbo.trg_reviews_ad
ON dbo.reviews
AFTER DELETE
AS
BEGIN
  SET NOCOUNT ON;
  ;WITH impacted AS (
    SELECT DISTINCT bazarId FROM deleted
  ), stats AS (
    SELECT r.bazarId, AVG(CAST(r.stars AS DECIMAL(10,4))) AS avgStars, COUNT(*) AS total
    FROM dbo.reviews r
    INNER JOIN impacted x ON x.bazarId = r.bazarId
    GROUP BY r.bazarId
  )
  UPDATE b
    SET b.avaliacao = ISNULL(s.avgStars, 0),
        b.totalAvaliacoes = ISNULL(s.total, 0)
  FROM dbo.bazares b
  LEFT JOIN stats s ON s.bazarId = b.id
  WHERE b.id IN (SELECT bazarId FROM impacted);
END;
GO

-- Limpeza e anonimização após DELETE em users
IF OBJECT_ID(N'dbo.trg_users_ad_cleanup', N'TR') IS NOT NULL
  DROP TRIGGER dbo.trg_users_ad_cleanup;
GO
CREATE TRIGGER dbo.trg_users_ad_cleanup
ON dbo.users
AFTER DELETE
AS
BEGIN
  SET NOCOUNT ON;
  -- Remover likes do usuário deletado (evita múltiplos caminhos em cascata via FK)
  DELETE pl
  FROM dbo.post_likes pl
  INNER JOIN deleted d ON d.id = pl.userId;

  -- Anonimizar comentários do usuário deletado (setar userId NULL)
  UPDATE pc
    SET userId = NULL
  FROM dbo.post_comments pc
  INNER JOIN deleted d ON d.id = pc.userId;

  -- Observação: posts do usuário são removidos via FK_posts_user ON DELETE CASCADE
  -- e consequentemente post_likes/post_comments ligados a esses posts são removidos via postId CASCADE.
END;
GO

-- 5) Views
IF OBJECT_ID(N'dbo.v_posts_with_counts', N'V') IS NOT NULL
  DROP VIEW dbo.v_posts_with_counts;
GO
CREATE VIEW dbo.v_posts_with_counts
AS
SELECT
  p.id,
  p.userId,
  p.content,
  p.image,
  p.[timestamp],
  p.shares,
  (SELECT COUNT(*) FROM dbo.post_likes pl WHERE pl.postId = p.id) AS likesCount,
  (SELECT COUNT(*) FROM dbo.post_comments pc WHERE pc.postId = p.id) AS commentsCount
FROM dbo.posts p;
GO

IF OBJECT_ID(N'dbo.v_bazares_stats', N'V') IS NOT NULL
  DROP VIEW dbo.v_bazares_stats;
GO
CREATE VIEW dbo.v_bazares_stats
AS
SELECT
  b.id,
  b.nome,
  b.descricao,
  b.imagem,
  b.categoria,
  b.cep,
  b.rua,
  b.numero,
  b.bairro,
  b.cidade,
  b.telefone,
  b.horario,
  b.criadoPor,
  b.avaliacao,
  b.totalAvaliacoes,
  b.createdAt,
  b.updatedAt,
  (SELECT COUNT(*) FROM dbo.favorites f WHERE f.bazarId = b.id) AS totalFavoritos
FROM dbo.bazares b;
GO

-- 6) Seeds (opcional - exemplo) - descomente para inserir dados
-- INSERT INTO dbo.users (nome, email, senha_hash, tipoUsuario) VALUES (N'Admin Demo', N'admin@demo.com', N'$2a$10$8qRZ1D7KJ3H0F1Lr0u5d6ODXo4Jqf5c6jXqjv9w1sV9rW2o2fEw9e', N'dono');
-- DECLARE @userId UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.users WHERE email = N'admin@demo.com');
-- INSERT INTO dbo.bazares (nome, descricao, categoria, cidade, criadoPor) VALUES (N'Bazar Demo', N'Demo desc', N'Vintage', N'São Paulo, SP', @userId);
