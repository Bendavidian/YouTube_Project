#### About the TCP server:
The TCP server written in C++ works in conjunction with the Node.js server to handle video recommendations. The TCP server communicates with the Node.js server through a client-server architecture. When a user interacts with the website (e.g., watching a video), the Node.js server sends a request to the TCP server to fetch video recommendations based on the user's watch history. The TCP server, which manages video data, processes the request and returns recommended video IDs. These recommendations are then fetched from the database by the Node.js server and displayed on the 
frontend for the user. This interaction enables efficient video recommendations based on user behavior.










