export interface Heroe {
  id?:              string; // opcional
  superhero:        string;
  publisher:        Publisher;
  alter_ego:        string;
  first_appearance: string;
  characters:       string;
  alt_img?:         string; // opcional https://...
}

export enum Publisher {
DCComics = "DC Comics",
MarvelComics = "Marvel Comics"
}
