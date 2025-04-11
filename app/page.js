'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import { Cinzel_Decorative } from 'next/font/google';
import clsx from 'clsx';

const cinzel = Cinzel_Decorative({
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
});

const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];

const createDeck = () => {
  const deck = [];
  for (const suit of suits) {
    for (const value of values) {
      const isFaceCard = ['jack', 'queen', 'king'].includes(value);
      const filename = isFaceCard
        ? `${value}_of_${suit}2.png`
        : `${value}_of_${suit}.png`;
      deck.push(filename);
    }
  }
  return deck;
};

export default function Home() {
  const [deck, setDeck] = useState([]);
  const [drawnCards, setDrawnCards] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [cardInMotion, setCardInMotion] = useState(null);

  useEffect(() => {
    setDeck(createDeck());
  }, []);

  const drawCard = () => {
    if (deck.length === 0 || drawing) return;

    const index = Math.floor(Math.random() * deck.length);
    const selectedCard = deck[index];

    setCardInMotion(selectedCard);
    setDrawing(true);

    setTimeout(() => {
      setCardInMotion(null);
      setDrawing(false);
      setDeck(prev => prev.filter((_, i) => i !== index));
      setDrawnCards(prev => [...prev, selectedCard]);
    }, 1000); // sync with animation duration
  };

  const shuffleDeck = () => {
    setIsShuffling(true);
    setTimeout(() => {
      setDeck(createDeck());
      setDrawnCards([]);
      setCardInMotion(null);
      setDrawing(false);
      setIsShuffling(false);
    }, 800);
  };

  return (
    <main className={styles.container}>
      <h1 className={`${styles.title} ${cinzel.className}`}>Random Card Simulator</h1>

      <div className={styles.cardArea}>
        {/* Face-down deck on the left */}
        {deck.length > 0 && (
          <div className={clsx(styles.deckContainer, isShuffling && styles.shuffling)}>
            <Image
              src="/cards/back.png"
              alt="Deck"
              width={200}
              height={300}
              className={styles.deckImage}
            />
            <p className={styles.counter}>{deck.length} cards left</p>
          </div>
        )}

        {/* Card in motion */}
        {cardInMotion && (
          <div className={styles.movingCard}>
            <div className={styles.cardFlip}>
              <Image
                src="/cards/back.png"
                alt="Back of card"
                width={200}
                height={300}
                className={styles.cardBack}
              />
              <Image
                src={`/cards/${cardInMotion}`}
                alt="Drawn card"
                width={200}
                height={300}
                className={styles.cardFront}
              />
            </div>
          </div>
        )}

        {/* Face-up pile on the right */}
        <div className={styles.pileContainer}>
          {drawnCards.map((card, index) => (
            <Image
              key={index}
              src={`/cards/${card}`}
              alt={`Drawn card ${index + 1}`}
              width={200}
              height={300}
              className={styles.pileCard}
              style={{
                top: `${index * 2}px`,
                left: `${index * 2}px`,
                zIndex: index,
              }}
            />
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className={styles.buttons}>
        <button className={styles.btn} onClick={drawCard} disabled={drawing}>Draw Card</button>
        <button className={styles.btn} onClick={shuffleDeck} disabled={isShuffling}>Shuffle</button>
      </div>
    </main>
  );
}