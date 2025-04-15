# Pesquisa Back

`pesquisa_back` é uma API desenvolvida em Node.js para gerenciar pesquisas de opinião realizadas por uma associação comercial, visando identificar os melhores do ano. A aplicação integra-se com o WhatsApp para enviar convites de votação aos participantes.

## ✨ Funcionalidades

- Autenticação de usuários e administradores via tokens.
- Envio de mensagens via WhatsApp para participantes da pesquisa.
- Gerenciamento de categorias e candidatos à votação.
- Registro e contagem de votos.
- Painel administrativo para acompanhamento dos resultados.

## ⚙️ Variáveis de Ambiente

Certifique-se de configurar as seguintes variáveis de ambiente antes de executar a aplicação:

- `X_API_KEY`: Chave para conexão com o frontend.
- `SECRET_KEY_VOTING`: Chave secreta para geração de tokens de votação.
- `SECRET_KEY_ADMIN`: Chave secreta para geração de tokens administrativos.
- `DATABASE_URL`: URL de conexão com o banco de dados.
- `PGHOST`: Host do banco de dados PostgreSQL.
- `PGUSER`: Usuário do banco de dados PostgreSQL.
- `PGPASSWORD`: Senha do banco de dados PostgreSQL.
- `PGDATABASE`: Nome do banco de dados PostgreSQL.
- `PGPORT`: Porta do banco de dados PostgreSQL.
- `WHATSAPP_X_API_KEY`: Chave da API de integração com o WhatsApp.
- `WHATSAPP_API_URL`: URL da API de integração com o WhatsApp.
- `WHATSAPP_SESSION`: Identificador da sessão do WhatsApp.

## 🚀 Instalação

1.Clone o repositório

   ```bash
   git clone https://github.com/misereitor/pesquisa_back.git
   ```

2.Acesse o diretório do projeto

   ```bash
   cd pesquisa_back
   ```

3.Instale as dependências

   ```bash
   npm install
   ```

4.Configure as variáveis de ambiente conforme descrito acima

5.Inicie a aplicação

   ```bash
   npm start
   ```

## 📦 Endpoints Principais
A seguir, alguns dos endpoints disponíveis na AP:

 `POST /auth/vote`: Autentica um participante para votaçã.
 `POST /auth/admin`: Autentica um administrado.
 `GET /categories`: Lista todas as categorias disponíveis para votaçã.
 `POST /vote`: Registra o voto de um participante
 `GET /results`: Retorna os resultados parciais da votação (acesso restrito.

## 📬 Integração com WhatsAp

A aplicação utiliza a API do WhatsApp para enviar mensagens aos participantes, convidando-os a votrar. Certifique-se de que as variáveis de ambiente relacionadas ao WhatsApp estejam corretamente configuradas para garantir o funcionamento dessa funcionalidae.

## 🛠️ Contribuiço

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## 📄 Liceça

Este projeto está licenciado sob a [MIT License](LICESE).
