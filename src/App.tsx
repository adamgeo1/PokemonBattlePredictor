import {useState} from 'react'
import './App.css'
import type {Pokemon} from "../backend/express/src/services/Pokemon.ts";
import TeamTable from "./components/TeamTable.tsx"
import axios from "axios";



function App() {
  const [input, setInput] = useState('')
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [pokemonTeam, setPokemonTeam] = useState<Pokemon[] | []>([])
  const [error, setError] = useState('');

  //TODO add way to remove pokemon from team

  const addMonToTeam = (newMon: Pokemon ) => {
      if (pokemonTeam.length >= 6) {
          setError(`Team is full!`)
      }
      else {
          setPokemonTeam((prev) => [...prev, newMon])
      }

  };

  const handleAdd = async () => {
      const mon = await fetchPokemon();
      if (mon) {
          addMonToTeam(mon)
      }
  }

  const fetchPokemon = async () => {
      try {
          setError('');
          setPokemon(null);
          const res = await axios.get(`api/pokemon/${input.toLowerCase()}`);
          setPokemon(res.data);
          return res.data
      } catch (err) {
          setError(`Pokemon not found: ${err}`)
          return null
      }
  }

  return (
    <>
      <h1 className={"text-red-500"}>Pokemon Battle Predictor</h1>
      <div className="card">
        <input
            type="text"
            placeholder="Enter a Pokemon name"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ fontSize: '1rem', padding: '0.5rem', width: '250px' }}
        />
        <button
            onClick={handleAdd}
            style={{ marginLeft: '1rem', padding: '0.5rem 1rem', fontSize: '1rem' }}
        >
            Search
        </button>
          {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
          <h2 style={{ fontWeight: 'bold' }}>Your Team:</h2>
          <TeamTable team={pokemonTeam}/>
      </div>
    </>
  )
}

export default App
