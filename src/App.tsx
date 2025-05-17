import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


const getPage = async ()=> {
  const response = await fetch('/api/scrape', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  console.log(data);
}

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

  const findBattles = async () => {
    const response = await fetch('/api/findTrainers', {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    console.log("The trainers on the page are:\n", data);
  }

  return (
    <>
      <div>
      </div>
      <h1 className={"text-red-500"}>Vite + React</h1>
      <div className="card flex flex-col items-center justify-center">
        <div>
          <input type="text" placeholder="Enter Pokemon name" id="pokemonName"/>
          <button onClick={() => getPokemon(document.getElementById("pokemonName")?.value)}>get Pokemon info</button>
        </div>
        <button onClick={() => getPage()}>scrape Pokemon</button>
        <button onClick={() => findBattles()}>Find Battles</button>
        
        <p>The pokemon is {pokemon}</p>
      </div>
    </>
  )
}

export default App
