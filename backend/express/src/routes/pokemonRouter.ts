import { Router } from 'express';
import axios from 'axios';
import { Pokemon } from '../services/Pokemon';

const router = Router();

router.get('/pokemon/:name', async (req, res) => {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${req.params.name}`);
    const poke = new Pokemon(response.data);
    res.json({
      id: poke.id,
      name: poke.name,
      sprite: poke.sprite,
      types: poke.types,
      baseStats: poke.baseStats,
      abilities: poke.abilities,
      hiddenAbilities: poke.hiddenAbilities,
      moves: poke.moves.slice(0, 10), // too many moves to send all
      summary: poke.describe(),
    });
  } catch (err) {
    res.status(404).json({ error: `Pokémon not found: ${err}` });

  }
});

export default router;
