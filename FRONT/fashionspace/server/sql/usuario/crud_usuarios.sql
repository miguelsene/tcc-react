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