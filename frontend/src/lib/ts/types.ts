export type State = {
   
};

export type Character = {
    uid: string;
    name: string;
    image: string;
    deck: Deck;
}

// list of cards (as image src urls)
export type Deck = {
    Ancestry: string[];
    Community: string[];
    Subclass: string[];
    Domain: string[];
}
