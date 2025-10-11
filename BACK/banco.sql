------------------------------------------------------
-- BANCO DE DADOS: FashionSpace
------------------------------------------------------
IF DB_ID('FashionSpace') IS NULL
    CREATE DATABASE FashionSpace;
GO
USE FashionSpace;
GO

------------------------------------------------------
-- TABELA: usuarios
------------------------------------------------------
IF OBJECT_ID('usuarios', 'U') IS NOT NULL DROP TABLE usuarios;
GO
CREATE TABLE usuarios (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nome NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) NOT NULL UNIQUE,
    senha NVARCHAR(255) NOT NULL,
    tipo_usuario NVARCHAR(20) DEFAULT 'casual' 
        CHECK (tipo_usuario IN ('casual', 'dono', 'guest')),
    data_cadastro DATETIME DEFAULT GETDATE()
);
GO

-- Inserir usuários de exemplo
INSERT INTO usuarios (nome, email, senha, tipo_usuario) VALUES
('João Silva', 'joao@email.com', '123456', 'casual'),
('Maria Santos', 'maria@email.com', '123456', 'dono'),
('Pedro Costa', 'pedro@email.com', '123456', 'casual');
GO

-- SELECTS
SELECT * FROM usuarios;
SELECT nome, email, tipo_usuario FROM usuarios WHERE tipo_usuario = 'dono';
GO

------------------------------------------------------
-- TABELA: bazares
------------------------------------------------------
IF OBJECT_ID('bazares', 'U') IS NOT NULL DROP TABLE bazares;
GO
CREATE TABLE bazares (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nome NVARCHAR(255) NOT NULL,
    descricao NVARCHAR(MAX),
    imagem NVARCHAR(500),
    categoria NVARCHAR(50) NOT NULL,
    cep NVARCHAR(10),
    rua NVARCHAR(255),
    numero NVARCHAR(10),
    bairro NVARCHAR(100),
    cidade NVARCHAR(100),
    telefone NVARCHAR(20),
    horario NVARCHAR(255),
    avaliacao DECIMAL(3,2) DEFAULT 0.0,
    total_avaliacoes INT DEFAULT 0,
    usuario_id INT,
    data_cadastro DATETIME DEFAULT GETDATE(),
    ativo BIT DEFAULT 1,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
GO

-- Inserir bazares de exemplo
INSERT INTO bazares 
(nome, descricao, imagem, categoria, cep, rua, numero, bairro, cidade, telefone, horario, avaliacao, total_avaliacoes, usuario_id) 
VALUES
('Bazar da Moda Vintage', 'Peças únicas e autênticas dos anos 70, 80 e 90.', 
'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500', 'Vintage', '01310-100', 
'Rua Augusta', '1234', 'Consolação', 'São Paulo, SP', '(11) 99999-1234', 'Seg-Sex: 9h-18h, Sáb: 9h-15h', 4.8, 127, 2),
('Outlet Independente', 'Marcas independentes com preços especiais.', 
'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500', 'Outlet', '22071-900', 
'Rua Visconde de Pirajá', '567', 'Ipanema', 'Rio de Janeiro, RJ', '(21) 98888-5678', 'Seg-Dom: 10h-20h', 4.5, 89, 2);
GO

-- SELECTS
SELECT * FROM bazares;
SELECT b.id, b.nome, b.categoria, u.nome AS dono
FROM bazares b
JOIN usuarios u ON b.usuario_id = u.id;
GO

------------------------------------------------------
-- TABELA: bazares_favoritos
------------------------------------------------------
IF OBJECT_ID('bazares_favoritos', 'U') IS NOT NULL DROP TABLE bazares_favoritos;
GO
CREATE TABLE bazares_favoritos (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    usuario_id INT NOT NULL,
    bazar_id INT NOT NULL,
    data_favorito DATETIME2 NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_favoritos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    CONSTRAINT FK_favoritos_bazar FOREIGN KEY (bazar_id) REFERENCES bazares(id),
    CONSTRAINT UK_favoritos_usuario_bazar UNIQUE (usuario_id, bazar_id)
);
GO

CREATE INDEX IX_favoritos_usuario ON bazares_favoritos(usuario_id);
CREATE INDEX IX_favoritos_bazar ON bazares_favoritos(bazar_id);
GO

-- Inserir favoritos de exemplo
INSERT INTO bazares_favoritos (usuario_id, bazar_id) VALUES (1, 1), (1, 2), (3, 1);
GO

-- SELECTS
SELECT * FROM bazares_favoritos;
SELECT 
    f.id,
    u.nome AS usuario,
    b.nome AS bazar,
    f.data_favorito
FROM bazares_favoritos f
JOIN usuarios u ON f.usuario_id = u.id
JOIN bazares b ON f.bazar_id = b.id;
GO

------------------------------------------------------
-- TABELA: mensagens
------------------------------------------------------
IF OBJECT_ID('mensagens', 'U') IS NOT NULL DROP TABLE mensagens;
GO
CREATE TABLE mensagens (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    remetente_id INT NOT NULL,
    destinatario_id INT NOT NULL,
    bazar_id INT NOT NULL,
    conteudo NVARCHAR(MAX) NOT NULL,
    data_envio DATETIME2 NOT NULL DEFAULT GETDATE(),
    lida BIT NOT NULL DEFAULT 0,
    ativa BIT NOT NULL DEFAULT 1,

    FOREIGN KEY (remetente_id) REFERENCES usuarios(id),
    FOREIGN KEY (destinatario_id) REFERENCES usuarios(id),
    FOREIGN KEY (bazar_id) REFERENCES bazares(id)
);
GO

CREATE INDEX IX_mensagens_remetente ON mensagens(remetente_id);
CREATE INDEX IX_mensagens_destinatario ON mensagens(destinatario_id);
CREATE INDEX IX_mensagens_bazar ON mensagens(bazar_id);
CREATE INDEX IX_mensagens_data_envio ON mensagens(data_envio);
GO

-- Inserir mensagens de exemplo
INSERT INTO mensagens (remetente_id, destinatario_id, bazar_id, conteudo)
VALUES 
(1, 2, 1, 'Olá, ainda tem essa peça disponível?'),
(2, 1, 1, 'Sim! Está disponível, quer que eu reserve?'),
(3, 2, 2, 'Adorei o bazar! Quando será o próximo evento?');
GO

-- SELECTS
SELECT * FROM mensagens;
SELECT 
    m.id,
    u1.nome AS remetente,
    u2.nome AS destinatario,
    b.nome AS bazar,
    m.conteudo,
    m.data_envio,
    m.lida
FROM mensagens m
JOIN usuarios u1 ON m.remetente_id = u1.id
JOIN usuarios u2 ON m.destinatario_id = u2.id
JOIN bazares b ON m.bazar_id = b.id;
GO

------------------------------------------------------
-- PROCEDURE: limpeza de mensagens antigas
------------------------------------------------------
IF OBJECT_ID('LimparMensagensAntigas', 'P') IS NOT NULL 
    DROP PROCEDURE LimparMensagensAntigas;
GO
CREATE PROCEDURE LimparMensagensAntigas
AS
BEGIN
    DELETE FROM mensagens WHERE data_envio < DATEADD(DAY, -7, GETDATE());
END;
GO

-- Testar execução da procedure (opcional)
-- EXEC LimparMensagensAntigas;
