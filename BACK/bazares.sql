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