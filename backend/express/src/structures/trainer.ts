interface TrainerData {
    "name" : string,
    "title" : string,
    "pokemon" : string[],
    "location" : string,
    "game" : string,
}

class Trainer {
    name: string;
    title: string;
    pokemon: string[];
    location: string;
    game: string;

    constructor(data: TrainerData){
        this.name = data.name;
        this.title = data.title;
        this.pokemon = data.pokemon;
        this.location = data.location;
        this.game = data.game;
    }
}


export default Trainer;
// This interface defines the structure of a Trainer object.