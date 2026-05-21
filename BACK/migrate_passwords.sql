-- Script para criptografar senhas existentes com BCrypt
-- IMPORTANTE: Execute isso ANTES de reiniciar o servidor com o novo código

-- Nota: SQL Server não tem BCrypt nativo. Use Java para isso.
-- Opção 1: Exportar senhas, criptografar em Java, reimportar
-- Opção 2: Limpar senhas e forçar reset

-- Opção rápida: Limpar usuários existentes (se em desenvolvimento)
DELETE FROM usuarios;

-- OU se quiser manter usuários, execute isso em Java/Python:
-- FOR EACH usuario IN usuarios:
--     usuario.senha = bcrypt_encode(usuario.senha)
--     UPDATE usuarios SET senha = usuario.senha WHERE id = usuario.id
