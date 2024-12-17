import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors, { CorsOptions } from 'cors';
import { authVotingRouter } from './router/auth-voting.router';
import { validateApiKey } from './security/api_key';
import { voteRouter } from './router/vote.router';
import loginAdminRouter from './router/auth-admin.router';
import companyRouter from './router/company.router';
import categoryRouter from './router/category.router';
import associateCategoryCompanyRouter from './router/association-category-company.router';
import { dictionaryRouter } from './router/dictionary.router';
import { reportsRouter } from './router/reports.router';
import { userAdminRouter } from './router/user-admin.router';

const app: Application = express();

app.use(bodyParser.json({ limit: '200mb' }));

const corsOptions: CorsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(validateApiKey);

//routes
app.use('/api', authVotingRouter);
app.use('/api', voteRouter);
app.use('/api', loginAdminRouter);
app.use('/api', companyRouter);
app.use('/api', categoryRouter);
app.use('/api', associateCategoryCompanyRouter);
app.use('/api', dictionaryRouter);
app.use('/api', reportsRouter);
app.use('/api', userAdminRouter);

export { app };
