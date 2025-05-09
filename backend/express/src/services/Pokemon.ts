interface RawPokemon {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  sprites: { front_default: string | null };
  stats: { base_stat: number; stat: { name: string } }[];
  abilities: { ability: { name: string }; is_hidden: boolean }[];
  moves: { move: { name: string } }[];
}

export class Pokemon {
  id: number;
  name: string;
  types: string[];
  sprite: string;
  baseStats: Record<string, number>;
  abilities: string[];
  hiddenAbilities: string[];
  moves: string[];

  constructor(raw: RawPokemon) {
    this.id = raw.id;
    this.name = raw.name;
    this.types = raw.types.map(t => t.type.name);
    this.sprite = raw.sprites.front_default ?? "";
    this.baseStats = {};
    for (const stat of raw.stats) {
      this.baseStats[stat.stat.name] = stat.base_stat;
    }
    this.abilities = raw.abilities
      .filter(a => !a.is_hidden)
      .map(a => a.ability.name);
    this.hiddenAbilities = raw.abilities
      .filter(a => a.is_hidden)
      .map(a => a.ability.name);
    this.moves = raw.moves.map(m => m.move.name);
  }

  describe(): string {
    return `${this.name} is a ${this.types.join('/')} type Pokémon with base stats: ${JSON.stringify(this.baseStats)}.`;
  }
}