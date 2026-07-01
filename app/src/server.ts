import express from 'express';
import { routes } from '@/routes';
import cors from 'cors';
import { validateErrors } from '@/middlewares';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(validateErrors);

app.listen(port, () => {
  console.log(`Task Manager is running on port ${port}`);
});
