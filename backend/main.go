package main

import (
	"database/sql"
	"log"
	"net/http"
	"time"
	"fmt"
	"io"
	"encoding/json"
	_ "github.com/lib/pq"
)

var db *sql.DB; //variable named db holds database connection

type Review struct {
		ID               int       `json:"id"`
		Title            string    `json:"title"`
		MediaType        string    `json:"media_type"`
		Series           string    `json:"series"`
		Rating           float64   `json:"rating"`
		ProgressCurrent  int       `json:"progress_current"`
		ProgressTotal    int       `json:"progress_total"`
		Status           string    `json:"status"`
		ReviewDescription string   `json:"review_description"`
		ImageURL         string    `json:"image_url"`
		MediaBannerImg	 string    `json:"media_banner_img"`
		Author           string    `json:"author"`
		DateCompleted    *string `json:"date_completed"`  //string will be converted to date 
		IsFavorite       bool      `json:"is_favorite"`
	}


func main(){
	var err error //error is a type in go

	// ':=' declare and initializes the var
	//  Postgresql connection string, tells go how to connect to the DB
	connectionString := "user=postgres password=^&*$# dbname=ryans_nook sslmode=disable"

	//assign new value to db & err
	//Registers a new connection and returns a two values: a pointer to the db connection pool and any errors
	db, err = sql.Open("postgres", connectionString)
	if err != nil {
		log.Fatal("Can't open DB pool", err)
	}

	//actually connecting to DB, will return error if can't
	err = db.Ping()
	if err != nil {
		log.Fatal("DB ping error:", err)
	}

	

	http.Handle("/reviews", withCORS(http.HandlerFunc(getReviewsHandler)))
	http.Handle("/reviews/create", withCORS(http.HandlerFunc(createReviewHandler)))
	http.Handle("/reviews/update", withCORS(http.HandlerFunc(updateReviewHandler)))

	log.Println("Server running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
	
}

//GET//
func getReviewsHandler(writer http.ResponseWriter, request *http.Request){
	//Query the review table
	rows, err := db.Query(`SELECT id, title, media_type, series, rating,
	progress_current, progress_total, status, review_description, image_url, media_banner_img, author,
	date_completed, is_favorite FROM reviews`)

	if err != nil{
		http.Error(writer, "Database query error", http.StatusInternalServerError)
		return
	}

	defer rows.Close()

	var reviews []Review

	//more error checking 
	for rows.Next() {
		var r Review
		_ = rows.Scan(
			&r.ID,
			&r.Title,
			&r.MediaType,
			&r.Series,
			&r.Rating,
			&r.ProgressCurrent,
			&r.ProgressTotal,
			&r.Status,
			&r.ReviewDescription,
			&r.ImageURL,
			&r.MediaBannerImg,
			&r.Author,
			&r.DateCompleted,
			&r.IsFavorite,
		)
		reviews = append(reviews, r)
	}

	//tells browser that I am sending a json
	writer.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(writer).Encode(reviews)
	if(err != nil){
		http.Error(writer, "Failed to encode reviews", http.StatusInternalServerError)
	}
}

//POST//
func createReviewHandler(writer http.ResponseWriter, request *http.Request) {
	// Read body once
	body, _ := io.ReadAll(request.Body)
	fmt.Println("Raw JSON received:", string(body))

	var newReview Review
	err := json.Unmarshal(body, &newReview)
	if err != nil {
		log.Println("Failed to decode JSON:", err)
		http.Error(writer, "Invalid review data", http.StatusBadRequest)
		return
	}

	if newReview.Status == "completed" {
		now := time.Now().Format("2000-1-01")
		newReview.DateCompleted = &now
	} else {
		newReview.DateCompleted = nil
	}

	_, err = db.Exec(`
		INSERT INTO reviews (
			title, media_type, series, rating,
			progress_current, progress_total, status,
			review_description, image_url, media_banner_img, author,
			date_completed, is_favorite
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
		newReview.Title, newReview.MediaType, newReview.Series, newReview.Rating,
		newReview.ProgressCurrent, newReview.ProgressTotal, newReview.Status,
		newReview.ReviewDescription, newReview.ImageURL, newReview.MediaBannerImg, newReview.Author,
		newReview.DateCompleted, newReview.IsFavorite,
	)

	if err != nil {
		log.Println("Failed to insert into DB:", err)
		http.Error(writer, "Database insert failed", http.StatusInternalServerError)
		return
	}

	writer.WriteHeader(http.StatusCreated)
	writer.Write([]byte("Review created successfully"))
}

//EDIT//
func updateReviewHandler(writer http.ResponseWriter, request *http.Request){
	if request.Method != http.MethodPost {
		http.Error(writer, "Only POST allowed", http.StatusMethodNotAllowed)
		return
	}

	body,_ := io.ReadAll(request.Body);
	var updatedReview Review;
	err := json.Unmarshal(body, &updatedReview);

	if err != nil {
		log.Println("Failed to decode JSON:", err)
		http.Error(writer, "Invalid review data", http.StatusBadRequest)
		return
	}

	if updatedReview.Status == "completed"{
		now:= time.Now().Format("2000-1-01")
		updatedReview.DateCompleted = &now;
	}else{
		updatedReview.DateCompleted = nil;
	}

	_, err = db.Exec(`
		UPDATE reviews SET
			title = $1,
			media_type = $2,
			series = $3,
			rating = $4,
			progress_current = $5,
			progress_total = $6,
			status = $7,
			review_description = $8,
			image_url = $9,
			media_banner_img = $10,
			author = $11,
			date_completed = $12,
			is_favorite = $13
		WHERE id = $14
	`, updatedReview.Title,
		updatedReview.MediaType,
		updatedReview.Series,
		updatedReview.Rating,
		updatedReview.ProgressCurrent,
		updatedReview.ProgressTotal,
		updatedReview.Status,
		updatedReview.ReviewDescription,
		updatedReview.ImageURL,
		updatedReview.MediaBannerImg,
		updatedReview.Author,
		updatedReview.DateCompleted,
		updatedReview.IsFavorite,
		updatedReview.ID,
	)
}

func withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
