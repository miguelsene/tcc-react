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