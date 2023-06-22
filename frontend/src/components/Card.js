import React, { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const currentUser = useContext(CurrentUserContext);
  const isOwn = card.owner === currentUser._id;
  const isLiked = card.likes.some((i) => i === currentUser._id);
  const cardDeleteButtonClassName = (
    `elements__delete-btn ${isOwn ? '' : 'elements__delete-btn_state_hidden'}`
  )
  const cardLikeButtonClassName = (
    `elements__like-btn ${isLiked ? 'elements__like-btn_active' : ''}`
  )

  function handleClick() {
    onCardClick(card);
  }
  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }

  return (
    <li className="elements__card">
      <button
        className={cardDeleteButtonClassName}
        onClick={handleDeleteClick}
      >
      </button>
      <div className="elements__image-container">
        <img
          src={card.link}
          className="elements__image"
          alt={card.name}
          onClick={handleClick}
        />
      </div>
      <div className="elements__title-wrapper">
        <h2 className="elements__title">{card.name}</h2>
        <div className="elements__like-wrapper">
          <button
            type="button"
            className={cardLikeButtonClassName}
            onClick={handleLikeClick}
          >
          </button>
          <span className="elements__like-count">{card.likes.length}</span>
        </div>
      </div>
    </li>
  );
}

export default Card;
