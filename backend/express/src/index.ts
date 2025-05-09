import express from 'express';
import cors from 'cors';
import { getPokemon } from './pokemon';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/hello', (_req, res) => {
  res.json({ message: 'Hello from Express!' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});  


let pokemonToSearch: string = 'pikachu';

// This endpoint receives a Pokemon name from the client and stores it in a variable
// To be moved into pokemon.ts or a separate file in the future
app.post('/api/sendPokemon', (_req, res) => {
    pokemonToSearch = _req.body.name;
    res.json({ status: 'Pokemon received!', data: _req.body });
})

app.get('/api/getPokemon', (_req, res) => {
    getPokemon(pokemonToSearch).then(data => {
        res.json({ name: data.name});
    }).catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch Pokemon' });
    });
})
