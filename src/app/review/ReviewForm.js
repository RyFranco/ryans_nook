import {useState} from "react";



function MediaTypePrompt({onSelect}){

  return (
    <div className="media-button-grid">
      <button className="mediaButtonForm" onClick = {() => onSelect("game")}> Game</button>
      <button className="mediaButtonForm" onClick = {() => onSelect("anime")}> Anime</button>
      <button className="mediaButtonForm" onClick = {() => onSelect("show")}> Show</button>
      <button className="mediaButtonForm" onClick = {() => onSelect("movie")}> Movie</button>
      <button className="mediaButtonForm" onClick = {() => onSelect("book")}> Book</button>
      <button className="mediaButtonForm" onClick = {() => onSelect("manga")}> Manga</button>
      <button className="mediaButtonForm" onClick = {() => onSelect("music")}> Music</button>
    </div>
  );
}


export default function ReviewForm( {onSuccess, setModalSize}) {

    const [review, setReview] = useState({
      title: "",
      media_type: "",
      series: "",
      rating: 0,
      progress_current: 0,
      progress_total: 0,
      status: "planning", 
      review_description: "",
      image_url: "",
      media_banner_img:"",
      author: "",
      date_completed: null,
      is_favorite: false,
    });

  const [selectedMediaType, setSelectedMediaType] = useState(null);
    
  if(selectedMediaType == null){
    return (
      <div>
        <h2>What are you reviewing?</h2>
        <MediaTypePrompt onSelect={(type) => {
          setSelectedMediaType(type);
          setReview({ ...review, media_type: type, progress_total: ["Movie", "Game", "Music"].includes(type) ? 1:0 });
          setModalSize("default");
        }} />
      </div>
    );
  }

  const handleSubmit = async (e) => {
    //don't reload page\
    e.preventDefault();
    
    //console.log("Submitting review:", review); 

    try {
      const response = await fetch("http://localhost:8080/reviews/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
      });
      console.log("Status:", response.status);
      if (response.ok) onSuccess();
      else console.error("Server Error:", response.statusText);
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h2>Add a {selectedMediaType} Review</h2>
      <div className="input-row">
        <label>
          Title:
          <input type="text" name="title" value={review.title} onChange={(e) => setReview({ ...review, title: e.target.value })} />
        </label>

        <label>
          Series:
          <input type="text" name="series" value={review.series} onChange={(e) => setReview({ ...review, series: e.target.value })} />
        </label>

         <label>
          Favorite:
          <input type="checkbox" name="is_favorite" checked={review.is_favorite} onChange={(e) => setReview({ ...review, is_favorite: e.target.checked })} />
        </label>

      </div>

      <div className="input-row">
        <label>
          Rating (0–10):
          <input type="number" name="rating" min="0" max="10" step="0.5" value={review.rating} onChange={(e) => setReview({ ...review, rating: parseFloat(e.target.value) })} />
        </label>

        <label>
          Status:
          <select name="status" value={review.status} onChange={(e) => {
            const newStatus = e.target.value;
            const updates = { ...review, status: newStatus };
            if (newStatus === "completed") {
              updates.date_completed = new Date().toISOString().split("T")[0];
              updates.progress_current = review.progress_total;
            } else {
              updates.date_completed = null;
            }
            setReview(updates);
          }}
          >
            <option value="planning">Planning</option>
            <option value="watching">Watching</option>
            <option value="completed">Completed</option>
          </select>
        </label>
        
        {!["movie", "game", "music"].includes(review.media_type) && (
          <label>
            Progress:
            <div className="progress-inputs">
              <input type="number" name="progress_current" placeholder="Current" value={review.progress_current} onChange = {(e) => setReview({...review, progress_current:parseInt(e.target.value, 10)})}/>
              /
              <input type="number" name="progress_total" placeholder="Total" value={review.progress_total} onChange={(e) => setReview({ ...review, progress_total: parseInt(e.target.value, 10)})} />
            </div>
          </label>
        )}

      </div>

      <label>
        Description:
        <textarea style= {{backgroundColor: "#1b1b29", color:"white"}} name="review_description" rows="4" value={review.review_description} onChange = {(e) => setReview({...review, review_description:e.target.value})} />
      </label>
      
      <div className="input-row">
        <label>
          Image URL:
          <input type="text" name="image_url" value={review.image_url} onChange = {(e) => setReview({...review, image_url:e.target.value})} />
        </label>

         <label>
          Image Banner URL:
          <input type="text" name="media_banner_img" value={review.media_banner_img} onChange = {(e) => setReview({...review, media_banner_img:e.target.value})} />
        </label>

        <label>
          Author:
          <input type="text" name="author" value={review.author} onChange = {(e) => setReview({...review, author:e.target.value})}/>
        </label>
      </div>


      
      <button type="submit">Save</button>
    </form>
  );
 
  
}


