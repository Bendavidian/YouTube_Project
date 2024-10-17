# About the TCP server:
The TCP server written in C++ works in conjunction with the Node.js server to handle video recommendations. The TCP server communicates with the Node.js server through a client-server architecture. When a user interacts with the website (e.g., watching a video), the Node.js server sends a request to the TCP server to fetch video recommendations based on the user's watch history. The TCP server, which manages video data, processes the request and returns recommended video IDs. These recommendations are then fetched from the database by the Node.js server and displayed on the 
frontend for the user. This interaction enables efficient video recommendations based on user behavior.


### Video Recommendation Algorithm:
Our video recommendation system is designed to provide users with personalized video suggestions based on their watch history and video popularity among similar users.
For each user, we maintain a list of videos they have watched. When a user watches a video, it is added to their watch history if it isn't already there, and the video's popularity score increases.
Each video is assigned a popularity score, which increments every time a user watches that video (views).
The system compares users' watch histories to find those with similar tastes. To measure similarity, we use the Jaccard similarity coefficient. This method calculates the overlap between two users' watched videos (intersection) relative to the total number of unique videos watched by both users (union).

The algorithm checks the user's watch history to find similar users.
Videos watched by these similar users, but not by the current user, are shortlisted.
These videos are ranked by popularity, and the top-ranked ones are recommended.
If fewer than six videos are found, the system suggests additional popular videos (randomly) that the user hasn’t watched yet.


### Before running:
You need to make sure you have a VS code Software that will help you run this code.<br>
You also need to make sure you have tools that are used to compile C++ programs.<br>
open the terminal and run these:<br>
-sudo apt-get update<br>
-sudo apt-get install -y g++.<br>
-sudo apt-get install lightest-dev cmake<br>

### How to compile and run our program:

1. download our TCPServer file (from branch "ben part 4"!) 
[(https://github.com/Bendavidian/YouTube_Project.git)](https://github.com/Bendavidian/YouTube_Project/tree/Ben-part-4)
2. put the next commands in that folder on the terminal:
3. cd src
4. make
5. ./server
6. our program is now running on your computer!












