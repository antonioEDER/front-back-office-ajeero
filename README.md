# AJEERO - Backoffice (Painel Administrativo)

Painel administrativo web completo para gestão do sistema AJEERO usando Quasar Framework (Vue 3 + JS).

## 🚀 Tecnologias

- **Quasar Framework v2+** (Vue 3 + Composition API)
- **JavaScript**
- **Pinia** (Gerenciamento de estado)
- **Axios** (HTTP Client)
- **Vue Router**
- **Quasar Components** (QTable, QForm, QInput, QSelect, QEditor, etc.)

## 📋 Pré-requisitos

- Node.js 20+ 
- Yarn ou npm
- API Backend rodando (Go/Fiber)

## 🔧 Instalação

1. Clone o repositório
2. Instale as dependências:

```bash
yarn
# ou
npm install
```

3. Configure a URL da API:

Crie um arquivo `.env` na raiz do projeto:

```env
API_BASE_URL=http://localhost:3000/api/v1
```

Ou configure diretamente em `src/utils/constants.js`

## 🏃 Executar em desenvolvimento

```bash
quasar dev
```

O aplicativo estará disponível em `http://localhost:9000` (ou outra porta disponível)

## 🏗️ Build para produção

```bash
quasar build
```

Os arquivos serão gerados na pasta `dist/spa/`

## 📁 Estrutura do Projeto

```
src/
├── boot/              # Arquivos de inicialização
│   ├── axios.js       # Configuração do Axios
│   └── auth.js        # Guards de autenticação
├── components/        # Componentes Vue
│   ├── common/        # Componentes reutilizáveis
│   └── dashboard/     # Componentes do dashboard
├── layouts/           # Layouts da aplicação
│   └── AdminLayout.vue
├── pages/             # Páginas da aplicação
│   ├── auth/          # Autenticação
│   ├── dashboard/     # Dashboard
│   ├── associados/    # Gestão de associados
│   ├── cursos/        # Gestão de cursos
│   ├── eventos/       # Gestão de eventos
│   ├── parceiros/     # Gestão de parceiros
│   ├── noticias/      # Gestão de notícias
│   └── notificacoes/  # Gestão de notificações
├── services/          # Services da API
├── stores/            # Stores Pinia
├── utils/             # Utilitários
│   ├── constants.js   # Constantes
│   ├── formatters.js  # Formatação
│   ├── validators.js  # Validações
│   └── tableHelpers.js # Helpers para tabelas
└── router/            # Configuração de rotas
```

## 🔐 Autenticação

O sistema utiliza JWT para autenticação. O token é armazenado no `localStorage` e enviado automaticamente em todas as requisições.

### Login

- Endpoint: `POST /api/v1/auth/login`
- Body: `{ email, password }`
- Response: `{ access_token, refresh_token, user }`

### Refresh Token

O sistema tenta automaticamente renovar o token quando ele expira usando o `refresh_token`.

## 📝 Funcionalidades Implementadas

### ✅ Completas

- **Autenticação**: Login, logout, refresh token automático
- **Dashboard**: Estatísticas gerais do sistema
- **Associados**: 
  - Lista com paginação, busca e filtros
  - Criar associado (com criação automática de user)
  - Editar associado (sincronização com user)
  - Ativar/Desativar associado
  - Upload de foto
  - Deletar associado

### 🚧 Em Desenvolvimento

- Cursos (CRUD completo)
- Eventos (CRUD completo)
- Parceiros (CRUD completo)
- Notícias (CRUD completo)
- Notificações (CRUD completo)

## 🔌 Integração com API

A aplicação consome a API REST desenvolvida em Go/Fiber. A base URL é configurável através da variável de ambiente `API_BASE_URL` ou diretamente em `src/utils/constants.js`.

### Endpoints Principais

- **Autenticação**: `/api/v1/auth/*`
- **Dashboard**: `/api/v1/admin/dashboard`
- **Associados**: `/api/v1/associados/*` e `/api/v1/admin/associados/*`
- **Cursos**: `/api/v1/courses/*` e `/api/v1/admin/courses/*`
- **Eventos**: `/api/v1/eventos/*` e `/api/v1/admin/eventos/*`
- **Parceiros**: `/api/v1/admin/parceiros/*`
- **Benefícios**: `/api/v1/admin/beneficios/*`
- **Notícias**: `/api/v1/noticias/*` e `/api/v1/admin/noticias/*`
- **Notificações**: `/api/v1/admin/notificacoes/*`

## 🎨 Componentes Reutilizáveis

- **AppHeader**: Cabeçalho com menu de usuário
- **AppSidebar**: Menu lateral de navegação
- **StatusBadge**: Badge de status (Ativo/Inativo)
- **SearchBar**: Barra de busca com debounce
- **ConfirmDialog**: Modal de confirmação
- **StatCard**: Card de estatística para dashboard

## 📦 Stores Pinia

- **auth**: Autenticação e usuário
- **dashboard**: Estatísticas do dashboard
- **associado**: Gestão de associados
- **curso**: Gestão de cursos
- **evento**: Gestão de eventos
- **parceiro**: Gestão de parceiros
- **noticia**: Gestão de notícias
- **notificacao**: Gestão de notificações

## 🛠️ Utilitários

### Formatters

- `formatCPF(cpf)`: Formata CPF (000.000.000-00)
- `formatCEP(cep)`: Formata CEP (00000-000)
- `formatPhone(phone)`: Formata telefone ((00) 00000-0000)
- `formatDate(date)`: Formata data (DD/MM/YYYY)
- `formatDateTime(date)`: Formata data e hora

### Validators

- `validateCPF(cpf)`: Valida CPF
- `validateEmail(email)`: Valida email
- `validatePassword(password)`: Valida senha (mínimo 6 caracteres)
- `validateImageFile(file)`: Valida arquivo de imagem
- `validateYouTubeURL(url)`: Valida URL do YouTube

## 🔒 Segurança

- Todas as rotas (exceto login) requerem autenticação
- Token JWT enviado automaticamente em todas as requisições
- Refresh token automático quando o token expira
- Logout automático em caso de erro 401
- Guards de rota para proteger páginas

## 📱 Responsividade

O layout é responsivo e adaptável a diferentes tamanhos de tela, priorizando desktop mas funcionando em tablets e mobile.

## 🐛 Troubleshooting

### Erro de CORS

Certifique-se de que a API backend está configurada para aceitar requisições do frontend.

### Token expirado

O sistema tenta automaticamente renovar o token. Se falhar, o usuário é redirecionado para o login.

### Erro 401

Verifique se o token está sendo enviado corretamente e se não expirou.

## 📄 Licença

Este projeto é privado e proprietário da AJEERO.

## 👥 Desenvolvimento

Para contribuir com o projeto, siga os padrões estabelecidos:

- Use Composition API do Vue 3
- Siga a estrutura de pastas definida
- Use Pinia para gerenciamento de estado
- Use Quasar Notify para notificações
- Mantenha código limpo e bem documentado

## 📞 Suporte

Para suporte, entre em contato com a equipe de desenvolvimento.
