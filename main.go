package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
)

type User struct {
	ID             int    `json:"id"`
	FirstName      string `json:"first_name"`
	Country        string `json:"country"`
	ProfilePicture string `json:"profile_picture"`
}

type ActivityLog struct {
	ID         int    `json:"id"`
	UserID     int    `json:"user_id"`
	ActivityID int    `json:"activity_id"`
	LoggedAt   string `json:"logged_at"`
}

type Activity struct {
	ID    int `json:"id"`
	Point int `json:"point"`
}

type UserRank struct {
	FirstName      string `json:"first_name"`
	Country        string `json:"country"`
	ProfilePicture string `json:"profile_picture"`
	TotalPoint     int    `json:"total_point"`
	Rank           int    `json:"rank"`
}

func main() {
	db, err := sql.Open("mysql", "root:Nayem1998@tcp(localhost:3306)/leaderborad")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Define the HTTP handler
	http.HandleFunc("/api/users/rank", func(w http.ResponseWriter, r *http.Request) {
		// Execute the SQL query to retrieve user rankings
		query := `SELECT 
		u.first_name,
		u.country,
		u.profile_picture,
		SUM(a.points) AS total_point,
		RANK() OVER (ORDER BY SUM(a.points) DESC) AS pos
	FROM 
		users u
	JOIN 
		activity_logs al ON u.id = al.user_id
	JOIN 
		activities a ON al.activity_id = a.id
	GROUP BY 
		u.id
	ORDER BY
		total_point DESC
	`

		rows, err := db.Query(query)
		if err != nil {
			log.Fatal(err)
		}
		defer rows.Close()

		var rankings []UserRank

		// Iterate over the result rows and populate the UserRank slice
		//fmt.Printf("%v", rows)

		for rows.Next() {
			var userRank UserRank
			err := rows.Scan(&userRank.FirstName, &userRank.Country, &userRank.ProfilePicture, &userRank.TotalPoint, &userRank.Rank)
			if err != nil {
				log.Fatal(err)
			}
			rankings = append(rankings, userRank)
		}

		// JSON encode the rankings and send the response
		//w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.WriteHeader(http.StatusOK)
		err = json.NewEncoder(w).Encode(rankings)
		if err != nil {
			log.Fatal(err)
		}
	})

	// Start the server
	fmt.Println("Server listening on port 8000...")
	log.Fatal(http.ListenAndServe(":8000", nil))
}
