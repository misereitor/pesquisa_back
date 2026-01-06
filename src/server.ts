import { app } from './app';
import { env } from './config/env';

const port = env.PORT;

app.listen(port, (): void => {
  console.log(`Server is running at http://localhost:${port}`);
});
