import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './ReviewSystem.css';

const userShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  nome: PropTypes.string,
  fotoPerfil: PropTypes.string,
  tipoUsuario: PropTypes.string,
});

const replyShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  userName: PropTypes.string,
  text: PropTypes.string,
  date: PropTypes.string,
});

const reviewShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  userAvatar: PropTypes.string,
  userName: PropTypes.string,
  rating: PropTypes.number,
  date: PropTypes.string,
  comment: PropTypes.string,
  replies: PropTypes.arrayOf(replyShape),
});

const DEFAULT_REVIEW = {
  rating: 5,
  comment: '',
  photos: [],
};

const getStorageKey = (bazarId) => `fashionspace_reviews_${bazarId}`;

const readStoredReviews = (bazarId) => {
  return JSON.parse(localStorage.getItem(getStorageKey(bazarId)) || '[]');
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const renderStars = (rating, interactive = false, onChange = null) => {
  return Array.from({ length: 5 }, (_, index) => {
    const value = index + 1;
    const iconClass = `bi ${index < rating ? 'bi-star-fill' : 'bi-star'} star`;

    if (!interactive) {
      return <i key={value} className={iconClass} aria-hidden="true" />;
    }

    return (
      <button
        key={value}
        type="button"
        className="star-button"
        onClick={() => onChange(value)}
        aria-label={`Avaliar com ${value} estrela${value === 1 ? '' : 's'}`}
      >
        <i className={`${iconClass} interactive`} aria-hidden="true" />
      </button>
    );
  });
};

const ReviewSystem = ({ bazarId, user }) => {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState(DEFAULT_REVIEW);
  const [loading, setLoading] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  useEffect(() => {
    try {
      const localReviews = readStoredReviews(bazarId);
      setReviews(localReviews);
      setUserHasReviewed(Boolean(user?.id && localReviews.some((review) => review.userId === user.id)));
    } catch (error) {
      console.error('Erro ao carregar avaliacoes:', error);
    }
  }, [bazarId, user?.id]);

  const submitReview = () => {
    if (!newReview.comment.trim()) {
      alert('Por favor, escreva um comentario.');
      return;
    }

    setLoading(true);
    try {
      const review = {
        id: Date.now().toString(),
        bazarId,
        userId: user?.id || 'anon',
        userName: user?.nome || 'Anonimo',
        userAvatar: user?.fotoPerfil || `https://ui-avatars.com/api/?name=${user?.nome || 'A'}&background=5f81a5&color=fff&size=40`,
        rating: newReview.rating,
        comment: newReview.comment,
        photos: newReview.photos,
        date: new Date().toISOString(),
        likes: 0,
        replies: [],
      };

      const allReviews = readStoredReviews(bazarId);
      allReviews.unshift(review);
      localStorage.setItem(getStorageKey(bazarId), JSON.stringify(allReviews));

      setReviews((currentReviews) => [review, ...currentReviews]);
      setNewReview(DEFAULT_REVIEW);
      setShowForm(false);
      setUserHasReviewed(true);
    } catch (error) {
      console.error('Erro ao salvar avaliacao:', error);
      alert('Erro ao salvar avaliacao. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const addReply = (reviewId, reply) => {
    try {
      const allReviews = readStoredReviews(bazarId);
      const reviewIndex = allReviews.findIndex((review) => review.id === reviewId);

      if (reviewIndex === -1) {
        return;
      }

      const reviewReplies = allReviews[reviewIndex].replies || [];
      allReviews[reviewIndex].replies = [
        ...reviewReplies,
        {
          id: Date.now().toString(),
          userId: user?.id || 'anon',
          userName: user?.nome || 'Anonimo',
          text: reply,
          date: new Date().toISOString(),
        },
      ];

      localStorage.setItem(getStorageKey(bazarId), JSON.stringify(allReviews));
      setReviews(allReviews);
    } catch (error) {
      console.error('Erro ao adicionar resposta:', error);
    }
  };

  if (!user) {
    return (
      <div className="review-system">
        <div className="review-header">
          <h3><i className="bi bi-star-fill" aria-hidden="true" /> Avaliacoes ({reviews.length})</h3>
        </div>
        <div className="login-prompt">
          <p>Faca login para avaliar este bazar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="review-system">
      <div className="review-header">
        <h3><i className="bi bi-star-fill" aria-hidden="true" /> Avaliacoes ({reviews.length})</h3>
        {!userHasReviewed && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)} disabled={loading}>
            <i className="bi bi-plus-circle" aria-hidden="true" /> {loading ? 'Enviando...' : 'Avaliar'}
          </button>
        )}
      </div>

      {showForm && !userHasReviewed && (
        <div className="review-form">
          <div className="rating-input">
            <span className="rating-label">Sua avaliacao:</span>
            <div className="stars">
              {renderStars(newReview.rating, true, (rating) => setNewReview({ ...newReview, rating }))}
            </div>
          </div>

          <textarea
            aria-label="Comentario da avaliacao"
            placeholder="Compartilhe sua experiencia..."
            value={newReview.comment}
            onChange={(event) => setNewReview({ ...newReview, comment: event.target.value })}
            rows={4}
          />

          <div className="form-actions">
            <button className="btn btn-secondary" onClick={() => setShowForm(false)} disabled={loading}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={submitReview} disabled={loading}>
              {loading ? 'Publicando...' : 'Publicar Avaliacao'}
            </button>
          </div>
        </div>
      )}

      {userHasReviewed && (
        <div className="already-reviewed">
          <i className="bi bi-check-circle-fill" aria-hidden="true" />
          <p>Voce ja avaliou este bazar.</p>
        </div>
      )}

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <div className="no-reviews">
            <i className="bi bi-star" aria-hidden="true" />
            <p>Nenhuma avaliacao ainda. Seja o primeiro a avaliar!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              user={user}
              onReply={addReply}
              renderStars={renderStars}
            />
          ))
        )}
      </div>
    </div>
  );
};

ReviewSystem.propTypes = {
  bazarId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  user: userShape,
};

const ReviewCard = ({ review, user, onReply, renderStars }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');

  const submitReply = () => {
    if (!replyText.trim()) {
      return;
    }

    onReply(review.id, replyText);
    setReplyText('');
    setShowReplyForm(false);
  };

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="user-info">
          <img src={review.userAvatar} alt={review.userName} />
          <div>
            <h4>{review.userName}</h4>
            <div className="stars">{renderStars(review.rating)}</div>
          </div>
        </div>
        <span className="date">{formatDate(review.date)}</span>
      </div>

      <p className="comment">{review.comment}</p>

      <div className="review-actions">
        {user?.tipoUsuario === 'dono' && (
          <button type="button" onClick={() => setShowReplyForm(!showReplyForm)}>
            <i className="bi bi-reply" aria-hidden="true" /> Responder
          </button>
        )}
      </div>

      {showReplyForm && (
        <div className="reply-form">
          <textarea
            aria-label="Resposta da avaliacao"
            placeholder="Sua resposta..."
            value={replyText}
            onChange={(event) => setReplyText(event.target.value)}
            rows={3}
          />
          <div className="form-actions">
            <button className="btn btn-secondary" onClick={() => setShowReplyForm(false)}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={submitReply}>
              Responder
            </button>
          </div>
        </div>
      )}

      {review.replies && review.replies.length > 0 && (
        <div className="replies">
          {review.replies.map((reply) => (
            <div key={reply.id} className="reply">
              <strong>{reply.userName}</strong>
              <p>{reply.text}</p>
              <span className="date">{formatDate(reply.date)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

ReviewCard.propTypes = {
  review: reviewShape.isRequired,
  user: userShape,
  onReply: PropTypes.func.isRequired,
  renderStars: PropTypes.func.isRequired,
};

export default ReviewSystem;
