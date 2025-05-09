import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'



function App() {
  const [count, setCount] = useState(0)

  const [helloText, setHelloText] = useState('');

  const [pokemon, setPokemon] = useState("");

  const getHello = async () => {
      fetch('/api/hello').then(res => res.json()).then(data => {
          setHelloText(data.message)
      })
  }

  const sendPokemonName = async (pokemonName: string = "") => {
    fetch('api/sendPokemon', 
      {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name : pokemonName
        }
        )}
    )
    .then(res => res.json())
    .then(data => {
        console.log(data, "was received on the server")
        return true;
    }
    )
    return false;
  }

  const getPokemon = async (pokemonName?: string | null) => {
    
    if (pokemonName === null || pokemonName === undefined || pokemonName === "") {
      console.log("please enter a valid pokemon name");
      return;
    }

    var result = sendPokemonName(pokemonName ? pokemonName : "bulbasaur");
    if (!result){
      console.log("failed to send pokemon name to server");
      console.log("Exiting getting pokemon");
      return;
    }
      
    console.log("fetching pokemon");
    fetch('/api/getPokemon').then(res => res.json()).then(data => {
        setPokemon(data.name)
    })
    .catch(err => {
      console.error(err);
      setPokemon("Error fetching pokemon data");
    });
        
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
      <div className="card flex flex-col items-center justify-center">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
          <button onClick={() => getHello()}>getHello()</button>
        <div>
          <input type="text" placeholder="Enter Pokemon name" id="pokemonName"/>
          <button onClick={() => getPokemon(document.getElementById("pokemonName")?.value)}>get Pokemon info</button>
        </div>
        
        <p>The pokemon is {pokemon}</p>
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
