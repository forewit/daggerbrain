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
    heritage: Card[]
    domain: Card[]
    class: Card[]
}

export type CardType = 'heritage' | 'domain' | 'class'

export type Card = {
    name: string
    image_url: string
}