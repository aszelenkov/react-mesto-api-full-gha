import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import React, { useState, useEffect, useCallback } from "react";
import { usePopupState } from '../hooks/customHooks';
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import DeleteCardPopup from "./DeleteCardPopup";
import ProtectedRoute from "./ProtectedRoute";
import AddPlacePopup from "./AddPlacePopup";
import InfoTooltip from "./InfoTooltip";
import ImagePopup from "./ImagePopup";
import * as auth from "../utils/auth";
import Register from "./Register";
import Header from "./Header";
import api from "../utils/api";
import Footer from "./Footer";
import Login from "./Login";
import Main from "./Main";

function App() {

  const [selectedCard, setSelectedCard] = useState(null);
  const [deletedCard, setDeletedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();

  const { state: popups, closeAllPopups, handlePopupStateChange } = usePopupState({
    isEditAvatarPopupOpen: false,
    isEditProfilePopupOpen: false,
    isAddPlacePopupOpen: false,
    isPhotoViewPopupOpen: false,
    isDeleteCardPopupOpen: false,
    isInfoTooltipPopupOpen: false,
  }, setSelectedCard, setDeletedCard);

  const handleError = (err) => console.log(`Ошибка: ${err}`);

  useEffect(() => {
    if (loggedIn) {
    Promise.all([api.getUserInfo(), api.getItems()])
      .then(([userData, cardsData]) => {
        setCurrentUser(userData);
        setCards(cardsData.reverse());
      })
      .catch(handleError);
    }
  }, [loggedIn]);

  const handleCardClick = (card) => {
    setSelectedCard(card);
    handlePopupStateChange('isPhotoViewPopupOpen', true);
  };

  const handleDeleteCardClick = (card) => {
    setDeletedCard(card);
    handlePopupStateChange('isDeleteCardPopupOpen', true);
  };

  const handleConfirmRegister = (ok) => {
    handlePopupStateChange('isInfoTooltipPopupOpen', true);
    setIsSuccess(ok)
  }

  const apiRequestHandler = async (apiFunc, successFunc) => {
    try {
      setIsLoading(true);
      const result = await apiFunc();
      successFunc(result);
      closeAllPopups();
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardLike = (card) => {
    const isLiked = card.likes.some((i) => i === currentUser._id);
    apiRequestHandler(
      () => api.changeLikeCardStatus(card._id, isLiked),
      (newCard) => setCards((state) => state.map((c) => c._id === card._id ? newCard : c))
    );
  };

  const handleCardDelete = (card) => {
    apiRequestHandler(
      () => api.deleteCard(card._id),
      () => {
        setCards(cards.filter((c) => c._id !== card._id));
      }
    );
  };
  
  const handleUpdateAvatar = ({ avatar }) => {
    apiRequestHandler(
      () => api.editAvatar(avatar),
      setCurrentUser
    );
  };
  
  const handleUpdateUser = ({ name, about }) => {
    apiRequestHandler(
      () => api.setUserInfo({ name, about }),
      setCurrentUser
    );
  };
  
  const handleAddPlaceSubmit = (data) => {
    apiRequestHandler(
      () => api.setItem(data),
      (newCard) => setCards((cards) => [newCard, ...cards])
    );
  };

  const handleRegister = (email, password) => {
    auth.register(email, password)
      .then(() => {
        handleConfirmRegister(true)
        navigate('./sign-in')
      })
      .catch((err) => {
        handleConfirmRegister(false);
        console.error(`Ошибка: ${err}`);
      })
  }

  const handleLogin = (email, password) => {
    auth.authorize(email, password)
    .then((data) => {
        setLoggedIn(true);
        localStorage.setItem("token", data.token);
        setEmail(email);
        navigate("/");
      })
      .catch((err) => {
        handleConfirmRegister(false);
        console.error(`Ошибка: ${err}`);
      });
  };

  const onSignOut = () => {
    localStorage.removeItem("token");
    setLoggedIn(false)
    setEmail('')
    navigate("/sign-in");
  }

  const handleTokenCheck = useCallback(() => {
    const token = localStorage.getItem('token');
    if (token) {
      auth
        .checkToken(token)
        .then((res) => {
          if (res){
            setEmail(res.email);
            setLoggedIn(true);
            navigate("/");
          }
        })
        .catch((err) => {
          console.error(`Ошибка: ${err}`);
        });
    }
  }, [navigate]);

  useEffect(() => {
    handleTokenCheck();
  }, [handleTokenCheck]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
    <div className="page">
      
      <Header 
        loggedIn={loggedIn}
        email={email}
        onSignOut={onSignOut}
      />

      <Routes>
        <Route 
          path="/sign-up" 
          element={<Register 
            onRegister={handleRegister} />} 
        />

        <Route 
          path="/sign-in" 
          element={<Login 
            onLogin={handleLogin} />} 
        />

        <Route 
          path="/"
          element={
            <ProtectedRoute
              element={Main} 
              onEditAvatar={() => handlePopupStateChange("isEditAvatarPopupOpen", true)}
              onEditProfile={() => handlePopupStateChange("isEditProfilePopupOpen", true)}
              onAddPlace={() => handlePopupStateChange("isAddPlacePopupOpen", true)}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleDeleteCardClick}
              cards={cards}
              loggedIn={loggedIn} 
              onClose={closeAllPopups}          
            />
          }
        />
        <Route 
          path='*'
          element={<Navigate to="sign-in" /> }
        />
      </Routes>

      {loggedIn && <Footer />}

      {currentUser && (
      <>
      <EditAvatarPopup 
        onUpdateAvatar={handleUpdateAvatar} 
        isOpen={popups.isEditAvatarPopupOpen} 
        isLoading={isLoading}
        onClose={closeAllPopups} 
      />

      <EditProfilePopup 
        onUpdateUser={handleUpdateUser} 
        isOpen={popups.isEditProfilePopupOpen} 
        isLoading={isLoading}
        onClose={closeAllPopups} 
      /> 

      <AddPlacePopup 
        onAddPlace={handleAddPlaceSubmit} 
        isOpen={popups.isAddPlacePopupOpen} 
        isLoading={isLoading}
        onClose={closeAllPopups} 
      />

      <DeleteCardPopup 
        onDeleteCard={handleCardDelete} 
        isOpen={popups.isDeleteCardPopupOpen} 
        deletedCard={deletedCard}
        isLoading={isLoading}
        onClose={closeAllPopups}
      />
      </>
      )}

      <ImagePopup
        isOpen={popups.isPhotoViewPopupOpen}
        card={selectedCard}
        onClose={closeAllPopups}
      />

      <InfoTooltip
        isOpen={popups.isInfoTooltipPopupOpen}
        isSuccess={isSuccess}
        onClose={closeAllPopups}
        successMessage="Вы успешно зарегистрировались!" 
        errorMessage="Что-то пошло не так! Попробуйте еще раз."
      />      
    </div>
    </CurrentUserContext.Provider>
  );
}

export default App;