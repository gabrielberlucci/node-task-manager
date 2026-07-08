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
  console.log(
    `You can access the Task Manager by clicking the link(or copy to open in your browser) -> http://localhost:3000`,
  );
});
