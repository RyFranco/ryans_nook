import { useState } from 'react';
import './ReviewEditModal.css';

export default function ReviewEditModal({ review, onClose }) {
  const [editedReview, setEditedReview] = useState(review);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/reviews/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedReview),
      });

      if (response.ok) {
        onClose();
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  return (
    <div className="edit-modal-content" onClick={(e) => e.stopPropagation()}>

      <div className='header-banner'>
        <button className="edit-modal-close" onClick={onClose}>×</button>
        <img src={editedReview.media_banner_img} alt="media banner" />
      </div>

      <div className='poster-img'>
        <img src={editedReview.image_url} alt="poster" />
      </div>

      {/* <div className="title-info">
        <h4>{editedReview.title}</h4>
      </div> */}

      <div className='edit-review-details'>
        <form onSubmit={handleSubmit}>
            <div className="title-info">
                <input type="text" name="title" value={editedReview.title} onChange={(e) => setEditedReview({ ...editedReview, title: e.target.value })} />
            </div>
            
          <div className="edit-input-row">
            <label>
              Status:
              <select name="status" value={editedReview.status} onChange={(e) => {
                const newStatus = e.target.value;
                const updates = { ...editedReview, status: newStatus };
                if (newStatus === "completed") {
                  updates.date_completed = new Date().toISOString().split("T")[0];
                  updates.progress_current = editedReview.progress_total;
                } else {
                  updates.date_completed = null;
                }
                setEditedReview(updates);
              }}>
                <option value="planning">Planning</option>
                <option value="watching">Watching</option>
                <option value="completed">Completed</option>
              </select>
            </label>

            <label>
              Rating (0–10):
              <input type="number" name="rating" min="0" max="10" step="0.5" value={editedReview.rating} onChange={(e) => setEditedReview({ ...editedReview, rating: parseFloat(e.target.value) })} />
            </label>

            <label>
            Progress:
            <div className="edit-progress-inputs">
                <input type="number" name="progress_current" placeholder="Current" value={editedReview.progress_current} onChange={(e) => setEditedReview({ ...editedReview, progress_current: parseInt(e.target.value, 10) })} />
                /
                <input type="number" name="progress_total" placeholder="Total" value={editedReview.progress_total} onChange={(e) => setEditedReview({ ...editedReview, progress_total: parseInt(e.target.value, 10) })} />
            </div>
            </label>

            
          </div>
            
          {/* <div className="edit-input-row">

            <label>
              Series:
              <input type="text" name="series" value={editedReview.series} onChange={(e) => setEditedReview({ ...editedReview, series: e.target.value })} />
            </label>

            <label>
              Favorite:
              <input type="checkbox" name="is_favorite" checked={editedReview.is_favorite} onChange={(e) => setEditedReview({ ...editedReview, is_favorite: e.target.checked })} />
            </label>
          </div> */}


          <label>
            Description:
            <textarea style={{ backgroundColor: "#1b1b29", color: "white" }} name="review_description" rows="4" value={editedReview.review_description} onChange={(e) => setEditedReview({ ...editedReview, review_description: e.target.value })} />
          </label>

          {/* <div className="edit-input-row">
            <label>
              Image URL:
              <input type="text" name="image_url" value={editedReview.image_url} onChange={(e) => setEditedReview({ ...editedReview, image_url: e.target.value })} />
            </label>

            <label>
              Image Banner URL:
              <input type="text" name="media_banner_img" value={editedReview.media_banner_img} onChange={(e) => setEditedReview({ ...editedReview, media_banner_img: e.target.value })} />
            </label>

            <label>
              Author:
              <input type="text" name="author" value={editedReview.author} onChange={(e) => setEditedReview({ ...editedReview, author: e.target.value })} />
            </label>
          </div> */}

          <button className='edit-review-save-button' type="submit">Save</button>
        </form>
      </div>

    </div>
  );
}
