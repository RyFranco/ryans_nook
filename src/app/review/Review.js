import { useState, useEffect } from 'react';
import './Review.css';
import Modal from './ReviewModal';
import ReviewForm from './ReviewForm';
import ReviewEditModal from '../ReviewEditModal';

export default function Reviews() {
  const [showModal, setShowModal] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [modalSize, setModalSize] = useState("small");
  const [sortOption, setSortOption] = useState("score");
  const [mediaFilter, setMediaFilter] = useState("all");
  const [selectedReview, setSelectedReview] = useState(null);

  const sortByOption = (a, b) => {
    switch (sortOption) {
      case "score":
        return b.rating - a.rating;
      case "title":
        return a.title.localeCompare(b.title);
      case "date_completed":
        return new Date(a.date_completed) - new Date(b.date_completed);
      default:
        return b.rating - a.rating;
    }
  };

  const matchesMediaType = (review) =>
    mediaFilter === "all" || review.media_type === mediaFilter;

  const watchingReviews = reviews
    .filter(r => r.status === "watching" && matchesMediaType(r))
    .sort(sortByOption);

  const completedReviews = reviews
    .filter(r => r.status === "completed" && matchesMediaType(r))
    .sort(sortByOption);

  const plannedReviews = reviews
    .filter(r => r.status === "planning" && matchesMediaType(r))
    .sort(sortByOption);

  const handleCloseModal = () => {
    fetchReviews();
    setShowModal(false);
    setShowEdit(false);
    setModalSize("small");
    setSelectedReview(null);
  };

  const fetchReviews = () => {
    fetch('http://localhost:8080/reviews')
      .then(res => res.json())
      .then(data => setReviews(data || []));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="reviews-body">

      <div className="reviews-sidebar">
        <h4>Add Review</h4>
        <button className='add-review-button' onClick={() => setShowModal(true)}>+</button>

        <h4>Sort</h4>
        <div className="custom-select-wrapper">
          <select className="custom-select" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="score">Score</option>
            <option value="title">Title (A → Z)</option>
            <option value="date_completed">Date Completed (Newest First)</option>
          </select>
        </div>

        <h4>Lists</h4>
        <div className='media-filter-buttons'>
          {["all", "movie", "game", "anime", "manga", "show", "music", "book"].map(type => (
            <button
              key={type}
              className={`media-filter-button ${mediaFilter === type ? 'active' : ''}`}
              onClick={() => setMediaFilter(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="reviews-main">
        <div className="reviews-list-area">
          <h1>Reviews: {mediaFilter.charAt(0).toUpperCase() + mediaFilter.slice(1)}</h1>

          {/* Watching */}
          <div className='review-list'>
            <h3 className='review-list-header'>Watching</h3>
            <div className='review-list-content'>
              {watchingReviews.map(review => (
                <div
                  key={review.id}
                  className="review-item"
                  onClick={() => { setShowEdit(true); setSelectedReview(review); }}
                >
                  <img src={review.image_url} className='review-item-cover' />
                  <div className="review-info">
                    <span className="review-title">{review.title}</span>
                    <span className="review-rating">{review.rating}</span>
                    <span className="review-progress">
                      {review.progress_current === review.progress_total
                        ? review.progress_total
                        : `${review.progress_current}/${review.progress_total}`}
                    </span>
                    <span className="review-type">{review.media_type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Completed */}
          <div className='review-list'>
            <h3 className='review-list-header'>Completed</h3>
            <div className='review-list-content'>
              {completedReviews.map(review => (
                <div key={review.id} className='review-item' onClick={() => { setShowEdit(true); setSelectedReview(review); }}>
                  <img src={review.image_url} className='review-item-cover' />
                  <div className="review-info">
                    <span className="review-title">{review.title}</span>
                    <span className="review-rating">{review.rating}</span>
                    <span className="review-progress">
                      {review.progress_current === review.progress_total ? review.progress_total: `${review.progress_current}/${review.progress_total}`}
                    </span>
                    <span className="review-type">{review.media_type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Planning */}
          <div className='review-list'>
            <h3 className='review-list-header'>Planning</h3>
            <div className='review-list-content'>
              {plannedReviews.map(review => (
                <div
                  key={review.id}
                  className='review-item'
                  onClick={() => { setShowEdit(true); setSelectedReview(review); }}
                >
                  <img src={review.image_url} className='review-item-cover' />
                  <div className="review-info">
                    <span className="review-title">{review.title}</span>
                    <span className="review-rating">{review.rating}</span>
                    <span className="review-progress">
                      {review.progress_current === review.progress_total
                        ? review.progress_total
                        : `${review.progress_current}/${review.progress_total}`}
                    </span>
                    <span className="review-type">{review.media_type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {showModal && (
            <Modal onClose={handleCloseModal} size={modalSize}>
              <ReviewForm onSuccess={handleCloseModal} setModalSize={setModalSize} />
            </Modal>
          )}

          {showEdit && selectedReview && (
            <div className='edit-modal-overlay' onClick={handleCloseModal}>
              <ReviewEditModal review={selectedReview} onClose={handleCloseModal} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}