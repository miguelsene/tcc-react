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