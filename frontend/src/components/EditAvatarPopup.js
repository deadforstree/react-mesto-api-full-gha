import React, { useRef } from 'react';
import PopupWithForm from './PopupWithForm.js';

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar, onLoading }) {
  const avatarRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  }

  return (
    <PopupWithForm
      name="refresh"
      title="Обновить аватар"
      buttonText={onLoading ? 'Сохранение...' : 'Сохранить'}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <input
        name="avatar"
        id="link-avatar"
        type="url"
        className="popup__item popup__item_type_link-avatar"
        placeholder="Ссылка на картинку"
        required
        ref={avatarRef}
      />
      <span className="popup__input-error"></span>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
