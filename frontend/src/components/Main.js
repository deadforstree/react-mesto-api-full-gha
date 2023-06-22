import React, { useContext } from 'react';
import EditButton from '../images/buttonEdit.svg';
import plus from '../images/botton_plus.svg';
import Card from './Card.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Main({ cards, onEditProfile, onAddPlace, onEditAvatar, onCardClick, onCardLike, onCardDelete }) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <main className="main">
      <section className="profile">
        <button className="profile__avatar-edit" onClick={onEditAvatar}>
          <img src={currentUser.avatar} alt="Аватар профиля" className="profile__avatar" />
          <img src={EditButton} alt="Редактировать аватар" className="profile__edit-avatar" />
        </button>
        <div className="profile__info">
          <h1 className="profile__name">{currentUser.name}</h1>
          <button
            type="button"
            className="profile__edit-button"
            aria-label="Кнопка редактировать"
            onClick={onEditProfile}
          >
            <img src={EditButton} alt="Редактировать профиль" className="profile__edit-btn" />
          </button>
          <p className="profile__activities">{currentUser.about}</p>
        </div>
        <button
          type="button"
          className="profile__add-button"
          aria-label="Кнопка добавления картинки"
          onClick={onAddPlace}
        >
          <img src={plus} alt="Кнопка добавления картинки" className="profile__add-btn" />
        </button>
      </section>
      <section arial-label="Фотогарелея пользователя" className="elements-container">
        <ul className="elements">
          {cards.map((card, i) => (
            <Card
              card={card}
              key={card._id}
              onCardClick={onCardClick}
              onCardLike={onCardLike}
              onCardDelete={onCardDelete}
            />
          ))}
        </ul>
      </section>
    </main>
  );
}
export default Main;
