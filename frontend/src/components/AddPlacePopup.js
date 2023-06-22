import React, { useState, useEffect } from 'react';
import PopupWithForm from './PopupWithForm.js';

function AddPlacePopup({ isOpen, onClose, onAddPlace, onLoading }) {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    setName('');
    setLink('');
  }, [isOpen]);

  function handleSubmit(e) {
    e.preventDefault();
    onAddPlace({
      name: name,
      link: link,
    });
  }

  return (
    <PopupWithForm
      name="add-image"
      title="Новое место"
      buttonText={onLoading ? 'Сохранение...' : 'Создать'}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
        <input
          name="name"
          type="text"
          id="title-image"
          className="popup__item popup__item_type_name"
          placeholder="Название"
          required
          minLength="2"
          maxLength="30"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <span className="popup__input-error"></span>
        <input
          name="link"
          type="url"
          id="link-image"
          className="popup__item popup__item_type_about"
          placeholder="Ссылка на картинку"
          required
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <span className="popup__input-error"></span>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
