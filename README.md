# Welcome to Our YouTube Server Platform for Web!
#### how to run the server?
## Clone the Repository
git clone https://github.com/Bendavidian/YouTube_Project.git
cd YouTube_Project
git checkout final-upload
cd backend
## Install Dependencies
npm install
## Create a MongoDB Database
1. Create a new connection with this connection string: 'mongodb://localhost:27017/'
2. Create a database called Youtube
3. Create three collections: 'users', 'videos', and 'comments'
4. Download the JSON files from the 'DataBaseJsons' directory:
   * 'DataBaseJsons/Youtube.comments.json'
   * 'DataBaseJsons/Youtube.users.json'
   * 'DataBaseJsons/Youtube.videos.json'
5. Import them accordingly to the MongoDB collections.

## Start the Application
npm start

Open the app in your browser by navigating to 'http://localhost:8080/'.

## Development Process










