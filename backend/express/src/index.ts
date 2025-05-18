import express from 'express';
import cors from 'cors';
import { getPokemon } from './pokemon';
import { getPagePokemon, getPageBattles } from './scrape';
import Trainer from './structures/trainer';

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

let battleToFind: string = "https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Colosseum/Part_2";
const testPage = "https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Emerald/Part_2";

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

app.get('/api/scrape', async (_req, res) => {
    let output: string[] = [];
    await getPagePokemon('https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Colosseum/Part_2')
    .then(data => {
        output = data;
    });

    res.json({ 
        message: 'Scraping completed!',
        data: output
     });
})

app.post('/api/sendTrainer', (_req, res) => {
  battleToFind = _req.body.battle;
  res.json({status: "Trainer received", data: _req.body});
})

app.get('/api/findTrainers', async (_req, res) => {
  let output: Trainer[] = [];
  await getPageBattles(testPage)
  .then(data => {
    output = data;
  })
  

  res.json({
    message : "complete",
    data: output,
  })
});