import React from 'react';

function ImagePopup({ card, onClose }) {
  const image = card ? card.link : '';
  const name = card ? card.name : '';

  return (
    <div className={`popup popup_type_image-place ${card ? 'popup_opened' : ''}`}>
      <div className="popup__image-container">
      <figure className="popup__figure">
        <img
          className="popup__image-full"
          src={image}
          alt={name}
        />
        <figcaption className="popup__image-tittle">{name}</figcaption>
      </figure>
      <button
        type="button"
        className="popup__close"
        aria-label="Кнопка закрытия картинки"
        onClick={onClose}
      ></button>
    </div>
    </div >
  );
}
export default ImagePopup;