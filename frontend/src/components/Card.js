import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { useContext } from "react";

function Card(props) {

  const currentUser = useContext(CurrentUserContext);
  // const isOwn = card.owner === currentUser._id;
  const isOwn = (props.card.owner._id || props.card.owner) === currentUser._id;
  // const isOwn = props.card.owner === currentUser._id;
  const isLiked = props.card.likes.some((i) => i === currentUser._id);
  const cardLikeButtonClassName = (
    `elements__like ${isLiked && 'elements__like_active'}` 
  );

  const handleCardClick = () => {
    props.onCardClick(props.card);
  };

  const handleDeleteClick = () => {
    props.onCardDelete(props.card);
  };

  const handleLikeClick = () => {
    props.onCardLike(props.card);
  };


  return (
    <li className="elements__item">
      <img
        className="elements__photo"
        src={props.card.link}
        alt={props.card.name}
        onClick={handleCardClick}
      />
      <h2 className="elements__title">{props.card.name}</h2>
      <div className="elements__like-block">
        <button 
          className={cardLikeButtonClassName}
          type="button"
          aria-label='Нравится'
          onClick={handleLikeClick}
        >
        </button>
        <p className="elements__like-counter">{props.card.likes.length}</p>
      </div>
      {isOwn && 
      <button 
        className="elements__trash" 
        type="button"
        aria-label='Удалить карточку'
        onClick={handleDeleteClick}
      >
      </button>}
    </li>
  );
}

export default Card;
