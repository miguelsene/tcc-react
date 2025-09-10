# FashionSpace 🛍️

Uma plataforma completa para conectar usuários aos melhores bazares de moda, desenvolvida com React, CSS e JavaScript usando Vite.

## 🚀 Funcionalidades

### 🔐 Sistema de Autenticação
- Login e cadastro de usuários
- Validação de dados
- Persistência no localStorage
- Proteção de rotas

### 🏠 Página Inicial
- Hero section com call-to-actions
- Grid de bazares (padrão + criados pelo usuário)
- Sistema de favoritos
- Navegação para detalhes dos bazares

### ➕ Gerenciamento de Bazares
- **Adicionar Bazar**: Formulário completo com upload de imagem
- **Editar Bazar**: Atualização de informações
- **Detalhes do Bazar**: Visualização completa com ações
- **7 Categorias**: Luxo, Sebo, Vintage, Outlet, Artesanal, Infantil, Fitness

### ❤️ Sistema de Favoritos
- Adicionar/remover favoritos
- Página dedicada aos favoritos
- Contador de favoritos

### 👤 Perfil do Usuário
- Informações do usuário
- Estatísticas (bazares criados, favoritos)
- Gerenciamento dos bazares próprios
- Logout

### 💬 Sistema de Chat
- Chat em tempo real simulado
- 10 respostas automáticas
- Interface moderna
- Persistência de mensagens

### 🎨 Interface e UX
- **Modo escuro/claro** com toggle
- **Design responsivo** para mobile e desktop
- **Animações e transições** suaves
- **Estados vazios** informativos
- **Feedback visual** para ações

### 🔧 Funcionalidades Extras
- **Google Maps** integração (direções)
- **Web Share API** (compartilhamento)
- **Upload de imagens**
- **Validação de formulários**
- **Armazenamento local** (localStorage)

## 📦 Instalação

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Passos para instalação

1. **Clone ou baixe o projeto**
```bash
cd fashionspace
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute o projeto**
```bash
npm run dev
```

4. **Acesse no navegador**
```
http://localhost:5173
```

## 🏗️ Estrutura do Projeto

```
fashionspace/
├── src/
│   ├── components/
│   │   └── common/
│   │       ├── Sidebar.jsx
│   │       ├── Sidebar.css
│   │       ├── Topbar.jsx
│   │       └── Topbar.css
│   ├── pages/
│   │   ├── Login/
│   │   ├── Home/
│   │   ├── AddBazar/
│   │   ├── BazarDetails/
│   │   ├── EditBazar/
│   │   ├── Favorites/
│   │   ├── Profile/
│   │   └── Chat/
│   ├── data/
│   │   └── bazares.js
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── public/
├── package.json
└── README.md
```

## 📱 Páginas e Rotas

- `/` - Página inicial
- `/login` - Login/Cadastro (redirecionamento automático)
- `/adicionar-bazar` - Criar novo bazar
- `/bazar-detalhes/:id` - Detalhes do bazar
- `/editar-bazar/:id` - Editar bazar
- `/favoritos` - Bazares favoritados
- `/perfil` - Perfil do usuário
- `/chat-bazar/:id` - Chat com o bazar

## 🎯 Como Usar

### 1. **Primeiro Acesso**
- Cadastre-se com nome, email e senha
- Ou faça login se já tiver conta

### 2. **Explorar Bazares**
- Veja os 3 bazares padrão na página inicial
- Adicione aos favoritos clicando no coração
- Clique em "Ver Detalhes" para mais informações

### 3. **Criar Seu Bazar**
- Clique em "Criar Bazar" na página inicial
- Preencha todas as informações obrigatórias
- Faça upload de uma imagem (opcional)
- Escolha uma das 7 categorias disponíveis

### 4. **Gerenciar Bazares**
- Acesse seu perfil para ver bazares criados
- Edite ou exclua seus bazares
- Veja estatísticas de favoritos

### 5. **Chat com Bazares**
- Clique em "Chat" em qualquer bazar
- Envie mensagens e receba respostas automáticas
- Mensagens são salvas localmente

### 6. **Personalização**
- Use o toggle no topo para alternar entre modo claro/escuro
- Tema é salvo automaticamente

## 💾 Armazenamento de Dados

Todos os dados são armazenados localmente no navegador:

- `fashionspace_user` - Usuário logado
- `fashionspace_users` - Lista de usuários cadastrados
- `fashionspace_bazares` - Bazares criados pelos usuários
- `fashionspace_favoritos` - IDs dos bazares favoritados
- `fashionspace_theme` - Tema selecionado (claro/escuro)
- `chat_[bazarId]` - Mensagens do chat por bazar

## 🎨 Categorias de Bazares

1. **Bazar de Luxo** - Peças premium e exclusivas
2. **Sebo** - Livros, discos e itens vintage
3. **Vintage** - Roupas e acessórios retrô
4. **Outlet** - Marcas com preços especiais
5. **Artesanal** - Peças feitas à mão
6. **Infantil** - Roupas e acessórios para crianças
7. **Fitness** - Roupas esportivas e academia

## 🔧 Scripts Disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza build de produção
- `npm run lint` - Executa linter

## 🌟 Recursos Técnicos

- **React 19** com Hooks
- **React Router** para navegação
- **CSS Variables** para temas
- **LocalStorage** para persistência
- **Responsive Design** com CSS Grid/Flexbox
- **File Upload** com FileReader API
- **Web Share API** para compartilhamento
- **Google Maps** integração

## 📱 Responsividade

O site é totalmente responsivo e funciona perfeitamente em:
- 📱 **Mobile** (320px+)
- 📱 **Tablet** (768px+)
- 💻 **Desktop** (1024px+)

## 🎯 Próximas Funcionalidades

- [ ] Sistema de avaliações
- [ ] Filtros avançados
- [ ] Mapa interativo
- [ ] Notificações push
- [ ] Sistema de mensagens real
- [ ] Integração com redes sociais

---

**FashionSpace** - Conectando você aos melhores bazares de moda! 🛍️✨