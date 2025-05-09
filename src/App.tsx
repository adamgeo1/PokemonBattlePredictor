import {useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import type {Pokemon} from "../backend/express/src/services/Pokemon.ts";
import axios from "axios";



function App() {
  const [count, setCount] = useState(0)

  const [helloText, setHelloText] = useState('');
  const [input, setInput] = useState('')
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [error, setError] = useState('');

  const fetchPokemon = async () => {
      try {
          setError('');
          setPokemon(null);
          const res = await axios.get(`api/pokemon/${input.toLowerCase()}`);
          setPokemon(res.data);
      } catch (err) {
          setError(`Pokemon not found: ${err}`)
      }
  }

  const getHello = async () => {
      fetch('/api/hello').then(res => res.json()).then(data => {
          setHelloText(data.message)
      })
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className={"text-red-500"}>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={() => getHello()}>
            getHello()
        </button>
        <input
            type="text"
            placeholder="Enter a Pokemon name"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ fontSize: '1rem', padding: '0.5rem', width: '250px' }}
        />
        <button
            onClick={fetchPokemon}
            style={{ marginLeft: '1rem', padding: '0.5rem 1rem', fontSize: '1rem' }}
        >
            Search
        </button>
          {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
          {pokemon && (
            <div style={{ marginTop: '2rem' }}>
            <h2>{pokemon.name}</h2>
              <img src={pokemon.sprite} alt={pokemon.name} />
              <p>Types: {pokemon.types.join(', ')}</p>
              <p>Abilities: {pokemon.abilities.join(', ')}</p>
              <p><strong>Base Stats:</strong></p>
              <ul>
                {Object.entries(pokemon.baseStats).map(([stat, value]) => (
                <li key={stat}>{stat}: {value}</li>
            ))}
          </ul>
        </div>
      )}
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      <h2>Hello: {helloText}</h2>
    </>
  )
}

export default App
