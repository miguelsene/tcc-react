# Banco de Dados FashionSpace

## Como usar no SSMS:

### 1. Criar o banco:
- Abra o SQL Server Management Studio (SSMS)
- Conecte no seu servidor local
- Abra o arquivo `criar_banco.sql`
- Execute o script (F5)

### 2. Testar o CRUD:
- Abra o arquivo `crud_usuarios.sql`
- Execute os comandos um por vez para testar

## Estrutura da tabela usuarios:
- **id**: Chave primária (auto incremento)
- **nome**: Nome completo do usuário
- **email**: Email único do usuário
- **senha**: Senha do usuário
- **tipo_usuario**: 'casual', 'dono' ou 'guest'
- **data_cadastro**: Data de criação automática

## Comandos principais:
- **INSERT**: Cadastrar usuário
- **SELECT**: Buscar usuários
- **UPDATE**: Atualizar dados
- **DELETE**: Remover usuário