#### About the TCP server:
The TCP server written in C++ works in conjunction with the Node.js server to handle video recommendations. The TCP server communicates with the Node.js server through a client-server architecture. When a user interacts with the website (e.g., watching a video), the Node.js server sends a request to the TCP server to fetch video recommendations based on the user's watch history. The TCP server, which manages video data, processes the request and returns recommended video IDs. These recommendations are then fetched from the database by the Node.js server and displayed on the 
frontend for the user. This interaction enables efficient video recommendations based on user behavior.


here add more about how the algoritem works.............


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












