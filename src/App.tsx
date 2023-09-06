import React from 'react'
import classNames from 'classnames'
import { generateId, randomChoice, shuffle } from './utils'
import emojis from './emojis'
import { NUMBER_OF_PAIRS, TRANSITION_TIME } from './constants'
import { Card } from './components/Card'
import { FlipsCounter } from './components/FlipCounter'
import { GameOver } from './components/GameOver'

import type { ICard } from './components/Card'

export function App() {
  const [cards, setCards] = React.useState<ICard[]>([])
  const [isLocked, setIsLocked] = React.useState<boolean>(false)
  const [flipsCount, setFlipsCount] = React.useState<number>(0)
  const [isGameOver, setIsGameOver] = React.useState<boolean>(false)
  const [openedCard, setOpenedCard] = React.useState<ICard | null>(null)
  const [matchedCards] = React.useRef(0)

  const chooseCard = (currentCard: ICard) => {
    const allPairs = 0;
    setFlipsCount(flipsCount + 1)

    if (!openedCard) {
      setOpenedCard(currentCard)
      setCards(cards.map(card => {
        if (card.emoji === currentCard.emoji) return { ...card, isFaceUp: true }
        return card
      }))
    }

    if (openedCard.emoji === currentCard.emoji) {
      setOpenedCard(null)
      setIsLocked(true)
      matchedCards += 1;

      setCards(cards.map(card =>{
        if (card.emoji === currentCard.emoji) return { ...card, isFaceUp: true, isMatched: true }
        return card
      }))     
    }

    await (TRANSITION_TIME)

    if(matchedCards === NUMBER_OF_PAIRS) {
      setIsGameOver(true)
    }

    if (openedCard.emoji !== currentCard.emoji) {
      setOpenedCard(null)
      setIsLocked(true)

      await (TRANSITION_TIME)

      setCards(cards.map(card =>{
        if (card.emoji === currentCard.emoji) return { ...card, isFaceUp: false, isFailure: true }
        return card
      }))     
     }     
    }
  }

  const createCards = () => {
    let tempCards: ICard[] = []

    Array.from(Array(NUMBER_OF_PAIRS)).forEach(() => {
      const newCard: Omit<ICard, 'id'> = {
        emoji: randomChoice(emojis),
        isFaceUp: false,
        isMatched: false,
        isFailure: false
      }
      tempCards = [...tempCards, { ...newCard, id: generateId() }, { ...newCard, id: generateId() }]
    })

    setCards(shuffle(tempCards))
  }

  const handleCardClick = (card: ICard) => () => {
    chooseCard(card)
  }

  const handlePlayAgain = () => {
    setIsGameOver(false)
    setFlipsCount(0)
    createCards()
  }

  React.useEffect(createCards, [])

  return (
    <div className='flex flex-col items-center justify-center gap-5 min-h-screen py-6'>
      <FlipsCounter count={flipsCount} />

      {isGameOver && <GameOver onClick={handlePlayAgain} />}

      <div className={classNames('grid grid-cols-3 lg:grid-cols-4 gap-6', {
        'pointer-events-none': isLocked
      })}>
        {cards.map(card => (
          <Card
            key={card.id}
            {...card}
            onClick={handleCardClick(card)}
          />
        ))}
      </div>
    </div>
  )
}
