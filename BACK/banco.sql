-- Criar banco de dados FashionSpace
CREATE DATABASE FashionSpace;
GO

-- Usar o banco criado
USE FashionSpace;
GO

-- Criar tabela de usuários
CREATE TABLE usuarios (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nome NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) NOT NULL UNIQUE,
    senha NVARCHAR(255) NOT NULL,
    tipo_usuario NVARCHAR(20) DEFAULT 'casual' CHECK (tipo_usuario IN ('casual', 'dono', 'guest')),
    data_cadastro DATETIME DEFAULT GETDATE()
);
GO

-- Inserir alguns usuários de exemplo
INSERT INTO usuarios (nome, email, senha, tipo_usuario) VALUES
('João Silva', 'joao@email.com', '123456', 'casual'),
('Maria Santos', 'maria@email.com', '123456', 'dono'),
('Pedro Costa', 'pedro@email.com', '123456', 'casual');
GO
-- CRUD para usuários

-- 1. CREATE - Cadastrar novo usuário
INSERT INTO usuarios (nome, email, senha, tipo_usuario) 
VALUES ('Nome do Usuario', 'email@exemplo.com', 'senha123', 'casual');

-- 2. READ - Buscar todos os usuários
SELECT * FROM usuarios;

-- 3. READ - Buscar usuário por email (para login)
SELECT * FROM usuarios WHERE email = 'joao@email.com';

-- 4. READ - Verificar login
SELECT * FROM usuarios WHERE email = 'joao@email.com' AND senha = '123456';

-- 5. UPDATE - Atualizar dados do usuário
UPDATE usuarios 
SET nome = 'Novo Nome', tipo_usuario = 'dono' 
WHERE id = 1;

-- 6. DELETE - Deletar usuário
DELETE FROM usuarios WHERE id = 1;

-- 7. Verificar se email já existe (para cadastro)
SELECT COUNT(*) as existe FROM usuarios WHERE email = 'teste@email.com';
-- Script para criar tabela de bazares
USE FashionSpace;
GO

-- Criar tabela de bazares
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

-- Inserir dados de exemplo baseados no frontend
INSERT INTO bazares (nome, descricao, imagem, categoria, cep, rua, numero, bairro, cidade, telefone, horario, avaliacao, total_avaliacoes, usuario_id) VALUES
('Bazar da Moda Vintage', 'Peças únicas e autênticas dos anos 70, 80 e 90. Encontre tesouros vintage com história e estilo.', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500', 'Vintage', '01310-100', 'Rua Augusta', '1234', 'Consolação', 'São Paulo, SP', '(11) 99999-1234', 'Seg-Sex: 9h-18h, Sáb: 9h-15h', 4.8, 127, 2),
('Outlet Independente', 'Marcas independentes com preços especiais. Apoie designers locais e encontre peças exclusivas.', 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500', 'Outlet', '22071-900', 'Rua Visconde de Pirajá', '567', 'Ipanema', 'Rio de Janeiro, RJ', '(21) 98888-5678', 'Seg-Dom: 10h-20h', 4.5, 89, 2),
('Feira de Artesãos', 'Peças artesanais únicas feitas à mão. Bolsas, acessórios e roupas com identidade brasileira.', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500', 'Artesanal', '40070-110', 'Largo do Pelourinho', '89', 'Pelourinho', 'Salvador, BA', '(71) 97777-9012', 'Ter-Dom: 8h-17h', 4.9, 203, 2),
('Luxo Fashion Store', 'Peças de luxo e alta costura. Marcas internacionais e nacionais renomadas.', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500', 'Bazar de Luxo', '04094-050', 'Rua Oscar Freire', '1200', 'Jardins', 'São Paulo, SP', '(11) 95555-0001', 'Seg-Sáb: 10h-20h', 4.7, 156, 2),
('Kids Fashion', 'Roupas infantis modernas e confortáveis. Do recém-nascido ao adolescente.', 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=500', 'Infantil', '80010-000', 'Rua XV de Novembro', '789', 'Centro', 'Curitiba, PR', '(41) 93333-0003', 'Seg-Sáb: 9h-19h', 4.4, 92, 2);
GO

-- Verificar se os dados foram inseridos
SELECT * FROM bazares;
GO
-- Criação da tabela bazares_favoritos
CREATE TABLE bazares_favoritos (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    bazar_id BIGINT NOT NULL,
    data_favorito DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    CONSTRAINT FK_favoritos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    CONSTRAINT FK_favoritos_bazar FOREIGN KEY (bazar_id) REFERENCES bazares(id),
    CONSTRAINT UK_favoritos_usuario_bazar UNIQUE (usuario_id, bazar_id)
);

-- Índices para melhor performance
CREATE INDEX IX_favoritos_usuario ON bazares_favoritos(usuario_id);
CREATE INDEX IX_favoritos_bazar ON bazares_favoritos(bazar_id);
USE FashionSpace;

-- Remover tabela se existir
IF EXISTS (SELECT * FROM sysobjects WHERE name='mensagens' AND xtype='U')
    DROP TABLE mensagens;

-- Criar tabela de mensagens
CREATE TABLE mensagens (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    remetente_id BIGINT NOT NULL,
    destinatario_id BIGINT NOT NULL,
    bazar_id VARCHAR(50) NOT NULL,
    conteudo TEXT NOT NULL,
    data_envio DATETIME2 NOT NULL DEFAULT GETDATE(),
    lida BIT NOT NULL DEFAULT 0,
    ativa BIT NOT NULL DEFAULT 1,
    
    FOREIGN KEY (remetente_id) REFERENCES usuarios(id),
    FOREIGN KEY (destinatario_id) REFERENCES usuarios(id)
);

-- Índices
CREATE INDEX IX_mensagens_remetente ON mensagens(remetente_id);
CREATE INDEX IX_mensagens_destinatario ON mensagens(destinatario_id);
CREATE INDEX IX_mensagens_bazar ON mensagens(bazar_id);
CREATE INDEX IX_mensagens_data_envio ON mensagens(data_envio);

-- Procedure para limpeza automática
CREATE OR ALTER PROCEDURE LimparMensagensAntigas
AS
BEGIN
    DELETE FROM mensagens WHERE data_envio < DATEADD(day, -7, GETDATE());
END;

-- Job para executar limpeza diariamente
IF NOT EXISTS (SELECT * FROM msdb.dbo.sysjobs WHERE name = 'LimpezaMensagens')
BEGIN
    EXEC msdb.dbo.sp_add_job
        @job_name = 'LimpezaMensagens',
        @enabled = 1;
    
    EXEC msdb.dbo.sp_add_jobstep
        @job_name = 'LimpezaMensagens',
        @step_name = 'Executar Limpeza',
        @command = 'EXEC LimparMensagensAntigas';
    
    EXEC msdb.dbo.sp_add_schedule
        @schedule_name = 'Diario',
        @freq_type = 4,
        @freq_interval = 1,
        @active_start_time = 020000;
    
    EXEC msdb.dbo.sp_attach_schedule
        @job_name = 'LimpezaMensagens',
        @schedule_name = 'Diario';
    
    EXEC msdb.dbo.sp_add_jobserver
        @job_name = 'LimpezaMensagens';
END;