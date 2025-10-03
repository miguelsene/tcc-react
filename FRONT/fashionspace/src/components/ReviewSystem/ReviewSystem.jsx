import { useState, useEffect } from 'react';
import './ReviewSystem.css';

const ReviewSystem = ({ bazarId, user }) => {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    photos: []
  });

  useEffect(() => {
    loadReviews();
  }, [bazarId]);

  const loadReviews = () => {
    const allReviews = JSON.parse(localStorage.getItem('fashionspace_reviews') || '[]');
    const bazarReviews = allReviews.filter(r => r.bazarId === bazarId);
    setReviews(bazarReviews);
  };

  const submitReview = () => {
    const review = {
      id: Date.now().toString(),
      bazarId,
      userId: user.id,
      userName: user.nome,
      userAvatar: user.avatar || '/default-avatar.png',
      rating: newReview.rating,
      comment: newReview.comment,
      photos: newReview.photos,
      date: new Date().toISOString(),
      likes: 0,
      replies: []
    };

    const allReviews = JSON.parse(localStorage.getItem('fashionspace_reviews') || '[]');
    allReviews.push(review);
    localStorage.setItem('fashionspace_reviews', JSON.stringify(allReviews));
    
    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, comment: '', photos: [] });
    setShowForm(false);
  };

  const addReply = (reviewId, reply) => {
    const allReviews = JSON.parse(localStorage.getItem('fashionspace_reviews') || '[]');
    const reviewIndex = allReviews.findIndex(r => r.id === reviewId);
    
    if (reviewIndex !== -1) {
      allReviews[reviewIndex].replies.push({
        id: Date.now().toString(),
        userId: user.id,
        userName: user.nome,
        text: reply,
        date: new Date().toISOString()
      });
      localStorage.setItem('fashionspace_reviews', JSON.stringify(allReviews));
      loadReviews();
    }
  };

  const renderStars = (rating, interactive = false, onChange = null) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className={`bi ${i < rating ? 'bi-star-fill' : 'bi-star'} star ${interactive ? 'interactive' : ''}`}
        onClick={interactive ? () => onChange(i + 1) : undefined}
      />
    ));
  };

  return (
    <div className="review-system">
      <div className="review-header">
        <h3><i className="bi bi-star-fill"></i> Avaliações ({reviews.length})</h3>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <i className="bi bi-plus-circle"></i> Avaliar
        </button>
      </div>

      {showForm && (
        <div className="review-form">
          <div className="rating-input">
            <label>Sua avaliação:</label>
            <div className="stars">
              {renderStars(newReview.rating, true, (rating) => 
                setNewReview({...newReview, rating})
              )}
            </div>
          </div>
          
          <textarea
            placeholder="Compartilhe sua experiência..."
            value={newReview.comment}
            onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
          />
          
          <div className="form-actions">
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={submitReview}>
              Publicar Avaliação
            </button>
          </div>
        </div>
      )}

      <div className="reviews-list">
        {reviews.map(review => (
          <ReviewCard 
            key={review.id} 
            review={review} 
            user={user}
            onReply={addReply}
            renderStars={renderStars}
          />
        ))}
      </div>
    </div>
  );
};

const ReviewCard = ({ review, user, onReply, renderStars }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');

  const submitReply = () => {
    if (replyText.trim()) {
      onReply(review.id, replyText);
      setReplyText('');
      setShowReplyForm(false);
    }
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
        <span className="date">{new Date(review.date).toLocaleDateString()}</span>
      </div>
      
      <p className="comment">{review.comment}</p>
      
      <div className="review-actions">
        <button onClick={() => setShowReplyForm(!showReplyForm)}>
          <i className="bi bi-reply"></i> Responder
        </button>
      </div>

      {showReplyForm && (
        <div className="reply-form">
          <textarea
            placeholder="Sua resposta..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
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

      {review.replies.length > 0 && (
        <div className="replies">
          {review.replies.map(reply => (
            <div key={reply.id} className="reply">
              <strong>{reply.userName}</strong>
              <p>{reply.text}</p>
              <span className="date">{new Date(reply.date).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSystem;