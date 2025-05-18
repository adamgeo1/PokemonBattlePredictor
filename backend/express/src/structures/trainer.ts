interface TrainerData {
    "name" : string,
    "title" : string,
    "pokemon" : string[],
    "location" : string,
    "game" : string,
    "image" : string,
}

class Trainer {
    name: string;
    title: string;
    pokemon: string[];
    location: string;
    game: string;
    image: string;

    constructor(data: TrainerData){
        this.name = data.name;
        this.title = data.title;
        this.pokemon = data.pokemon;
        this.location = data.location;
        this.game = data.game;
        this.image = data.image;
    }
}


export default Trainer;
// This interface defines the structure of a Trainer object.