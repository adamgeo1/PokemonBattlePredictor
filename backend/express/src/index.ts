import express from 'express';
import cors from 'cors';
import pokemonRouter from "./routes/pokemonRouter";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use('/api', pokemonRouter)

app.get('/api/hello', (_req, res) => {
  res.json({ message: 'Hello from Express!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
