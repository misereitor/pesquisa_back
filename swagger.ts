import swaggerAutogen from 'swagger-autogen';
import path from 'path';

const endpointsFiles = [
  path.join(__dirname, './src/router/auth-voting.router'),
  path.join(__dirname, './src/router/vote.router'),
  path.join(__dirname, './src/router/auth-admin.router'),
  path.join(__dirname, './src/router/company.router'),
  path.join(__dirname, './src/router/category.router'),
  path.join(__dirname, './src/router/association-category-company.router'),
  path.join(__dirname, './src/router/reports.router'),
  path.join(__dirname, './src/router/user-admin.router'),
  path.join(__dirname, './src/router/user-vote.router')
];

const outputFile = './swagger-output.json';
const doc = {
  info: {
    title: 'Minha API de Votação (Autogen)',
    version: '1.0.0',
    description: 'Documentação gerada automaticamente.'
  },
  // tags: [
  //   {
  //     name: 'Autenticação votantes',
  //     description: 'Endpoints relacionados à autenticação de votantes.'
  //   },
  //   { name: 'Votação', description: 'Endpoints relacionados à votação.' },
  //   {
  //     name: 'Autenticação admin',
  //     description: 'Endpoints de autenticação admin.'
  //   },
  //   { name: 'Empresas', description: 'Endpoints relacionados às empresas.' },
  //   {
  //     name: 'Categorias',
  //     description: 'Endpoints relacionados às categorias.'
  //   },
  //   {
  //     name: 'Associação Categoria-Empresa',
  //     description:
  //       'Endpoints relacionados à associação entre categorias e empresas.'
  //   },
  //   {
  //     name: 'Relatórios',
  //     description: 'Endpoints relacionados aos relatórios.'
  //   },
  //   {
  //     name: 'Usuários Admin',
  //     description: 'Endpoints relacionados aos usuários admin.'
  //   },
  //   {
  //     name: 'Usuários Votantes',
  //     description: 'Endpoints relacionados aos usuários votantes.'
  //   }
  // ],
  securityDefinitions: {
    apiKeyAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'x-api-key'
    }
  }
};

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc).then(
  () => {
    console.log('Swagger JSON gerado com sucesso em swagger-output.json!');
  }
);
