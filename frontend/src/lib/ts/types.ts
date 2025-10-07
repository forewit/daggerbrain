export type State = {
   
};

export type Character = {
    uid: string;
    name: string;
    image: string;
    description: string;
    deck: Deck;
}

// list of cards (as image src urls)
export type Deck = {
    urls: string[];
}
