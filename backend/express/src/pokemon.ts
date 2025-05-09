
// caching the pokemon data to avoid multiple requests to the API
let cache: {[key: string] : any} = {};

const getPokemon = async (pokemonName: string) => {
    let cacheKey: string = `${pokemonName}`;
    if (cache.hasOwnProperty(cacheKey)) {
        console.log('Cache hit for:', cacheKey);
        return cache[cacheKey];
    }

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    const data = await response.json();
    cache[cacheKey] = data; // Cache the response
    return data;
}

export { getPokemon };