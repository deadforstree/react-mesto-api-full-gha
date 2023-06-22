import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import PopupWithForm from './PopupWithForm.js';
import ImagePopup from './ImagePopup.js';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js';
import Register from './Register.js';
import Login from './Login.js';
import InfoTooltip from './InfoTooltip.js';
import ProtectedRouteElement from './ProtectedRoute.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { api } from '../utils/Api.js';
import { auth } from '../utils/auth';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);

  const [isEditProfilePopupOnLoading, setIsEditProfilePopupOnLoading] = useState(false);
  const [isAddPlacePopupOnLoading, setIsAddPlacePopupOnLoading] = useState(false);
  const [isEditAvatarPopupOnLoading, setIsEditAvatarPopupOnLoading] = useState(false);

  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);

  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  
  const [isOpenInfoTooltip, setIsOpenInfoTooltip] = useState(false);
  const [responseInfo, setResponseInfo] = useState(false);

  const navigate = useNavigate();

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }
  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsOpenInfoTooltip(false);
    setSelectedCard(null);
  }

  useEffect(() => {
    loggedIn &&
      Promise.all([api.getUserInfo(), api.getInitialCards()])
        .then(([userData, cards]) => {
          setCurrentUser(userData);
          setCards(cards);
        })
        .catch((err) => {
          console.log(err);
        });
  }, [loggedIn]);

  const isOpen =
    isEditAvatarPopupOpen || isEditProfilePopupOpen || isAddPlacePopupOpen || selectedCard || isOpenInfoTooltip;

  useEffect(() => {
    function closeByEscape(evt) {
      if (evt.key === 'Escape') {
        closeAllPopups();
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', closeByEscape);
      return () => {
        document.removeEventListener('keydown', closeByEscape);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const jwt = localStorage.getItem('token');
    if (jwt) {
      auth
        .checkToken()
        .then((data) => {
          setUserEmail(data.email);
          setLoggedIn(true);
          navigate('/main', { replace: true });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [navigate]);

  function handleRegister({ password, email }) {
    auth
      .register(email, password)
      .then(() => {
        setResponseInfo(true);
        setIsOpenInfoTooltip(true);
        navigate('/sign-in', { replace: true });
      })
      .catch((err) => {
        setResponseInfo(false);
        setIsOpenInfoTooltip(true);
        console.error(err);
      })
      .finally(() => {
        setIsOpenInfoTooltip(true);
      });
  }

  function handleLogin(formData) {
    const { email, password } = formData;
    auth
      .login(email, password)
      .then((data) => {
        if (data.token) {
          setUserEmail('');
          setLoggedIn(false);
          navigate('/main', { replace: true });
        }
      })
      .catch((err) => {
        setIsOpenInfoTooltip(true);
        setResponseInfo(false);
        console.error(err);
      });
  }


  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i === currentUser._id);
    api
      .changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((state) => state.map((item) => (item._id === card._id ? newCard : item)));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((item) => item._id !== card._id));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateUser(inputs) {
    setIsEditProfilePopupOnLoading(true);
    api
      .setUserInfo(inputs)
      .then((res) => {
        setCurrentUser(res.data);
      })
      .then(() => {
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsEditProfilePopupOnLoading(false);
      });
  }

  function handleUpdateAvatar(inputs) {
    setIsEditAvatarPopupOnLoading(true);
    api
      .setUserAvatar(inputs)
      .then((avatar) => {
        setCurrentUser(avatar.data);
      })
      .then(() => {
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsEditAvatarPopupOnLoading(false);
      });
  }

  function handleAddPlaceSubmit(card) {
    setIsAddPlacePopupOnLoading(true);
    api
      .addUserCard(card)
      .then((data) => {
        setCards([data, ...cards]);
      })
      .then(() => {
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsAddPlacePopupOnLoading(false);
      });
  }

  function handleSignOut() {
    localStorage.removeItem('token');
    setUserEmail('');
    navigate('/sign-up', { replace: true });
    setLoggedIn(false);
  }

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <Header loggedIn={loggedIn} userEmail={userEmail} onSignOut={handleSignOut} />
        <Routes>
          <Route path="/" element={loggedIn ? <Navigate to="/main" replace /> : <Navigate to="/sign-in" replace />} />
          <Route
            path="/main"
            element={
              <ProtectedRouteElement
                component={Main}
                loggedIn={loggedIn}
                cards={cards}
                onEditAvatar={handleEditAvatarClick}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
              />
            }
          />
          <Route path="/sign-up" element={<Register onRegister={handleRegister} />} />
          <Route path="/sign-in" element={<Login onLogin={handleLogin} />} />
        </Routes>
        <Footer />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          onLoading={isEditProfilePopupOnLoading}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
          onLoading={isAddPlacePopupOnLoading}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          onLoading={isEditAvatarPopupOnLoading}
        />
        <PopupWithForm name="confirm" title="Вы&nbsp;уверены?" buttonText="Да" />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        <InfoTooltip
          isOpen={isOpenInfoTooltip}
          onClose={closeAllPopups}
          isSuccess={responseInfo}
          successMessage="Вы успешно зарегистрировались!"
          FailMessage="Что-то пошло не так! Попробуйте ещё раз."
        />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
