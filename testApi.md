# FashionSpace API

**Base URL:** `http://localhost:8080/api`

## USUÁRIOS

### Listar usuários
GET http://localhost:8080/api/usuario

### Criar usuário
POST http://localhost:8080/api/usuario

### Buscar por ID
GET http://localhost:8080/api/usuario/1

### Atualizar usuário
PUT http://localhost:8080/api/usuario/1

### Excluir usuário
DELETE http://localhost:8080/api/usuario/1

### Login
POST http://localhost:8080/api/usuario/login

## BAZARES

### Listar bazares
GET http://localhost:8080/api/bazar

### Criar bazar
POST http://localhost:8080/api/bazar

### Buscar bazar por ID
GET http://localhost:8080/api/bazar/1

### Atualizar bazar
PUT http://localhost:8080/api/bazar/1

### Excluir bazar
DELETE http://localhost:8080/api/bazar/1

### Bazares por usuário
GET http://localhost:8080/api/bazar/usuario/1

## MENSAGENS

### Listar mensagens
GET http://localhost:8080/api/mensagens

### Enviar mensagem
POST http://localhost:8080/api/mensagens

### Conversa usuário-bazar
GET http://localhost:8080/api/mensagens/conversa/1/default-1

### Mensagens recebidas
GET http://localhost:8080/api/mensagens/recebidas/1

### Mensagens enviadas
GET http://localhost:8080/api/mensagens/enviadas/1

### Contar não lidas
GET http://localhost:8080/api/mensagens/nao-lidas/1

### Marcar como lida
PUT http://localhost:8080/api/mensagens/marcar-lida/1

### Marcar conversa como lida
PUT http://localhost:8080/api/mensagens/marcar-conversa-lida/1/default-1

### Todas conversas
GET http://localhost:8080/api/mensagens/conversas/1

### Conversas dono
GET http://localhost:8080/api/mensagens/conversas-dono/1

### Mensagens do bazar
GET http://localhost:8080/api/mensagens/bazar/default-1
