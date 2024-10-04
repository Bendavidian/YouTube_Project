## About the Node.js server
Welcome to our YouTube server. This server is made for our React and Android YouTube app that we developed during the course of Advanced Programming in BIU.
Our Node.js server serves as the central backend component for our YouTube project, facilitating communication between our React web app, Android mobile app, and database. Built on Express.js, it follows an MVC architecture, handling user authentication, video management, and real-time updates. With RESTful APIs, it seamlessly integrates with our client applications, ensuring smooth user interactions.

#### how to run the server?

## Downloading and Installing FFmpeg
#### Download FFmpeg:

1. Visit the FFmpeg official download page. [FFMPEG](https://www.ffmpeg.org/download.html)
2. Choose the appropriate version for your operating system (Windows, macOS, or Linux).
3. Installing FFmpeg:

* Windows:

1. Go to the FFmpeg download page for Windows [FFMPEG For Windows](https://www.gyan.dev/ffmpeg/builds/).
2. Download the latest "release" build.
 (Look for a file named similar to ffmpeg-release-full.7z or ffmpeg-n4.4.1-win64-static.zip.)
3. Extract the downloaded zip file to a directory in your C drive folder (e.g., C:\ffmpeg).
4. Add FFmpeg to your system PATH:
5. Open the Start menu, search for "Environment Variables", and select "Edit the system environment variables".
6. Click on the "Environment Variables" button.
7. Under "System variables", find and select the "Path" variable, then click "Edit".
8. Click "New" and add the path to the FFmpeg bin folder (e.g., C:\ffmpeg\bin).
9. Click "OK" to close all windows.
10. Verify the installation by opening a Command Prompt and running: ffmpeg -version

* macOS:

1. Install Homebrew if you haven't already:
```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
2. Use Homebrew to install FFmpeg:
```
brew install ffmpeg
```
3. Verify the installation by opening Terminal and running 
```
ffmpeg -version.
```
* Linux:

1. Go to the FFmpeg download page for Linux.
2. Choose the appropriate package for your distribution. For example, for Ubuntu/Debian:
3. Open your terminal.
4. Update your package list:
```
sudo apt update
```
5. Install FFmpeg:
```
sudo apt install ffmpeg
```
6. Verify the installation by running ``` ffmpeg -version ```.
   
## Setting up the project
## Download MongoDB
[Download MongoDB](https://www.mongodb.com/try/download/community)
#### Create a MongoDB Database
1. Create a new connection with this connection string: 'mongodb://localhost:27017/'
2. Create a database called Youtube
3. Create three collections: 'users', 'videos', and 'comments'
4. Download the JSON files from the 'DataBaseJsons' directory:
   * 'DataBaseJsons/Youtube.comments.json'
   * 'DataBaseJsons/Youtube.users.json'
   * 'DataBaseJsons/Youtube.videos.json'
5. Import them accordingly to the MongoDB collections.

#### Clone the repository
```
git clone https://github.com/Bendavidian/YouTube_Project.git
cd YouTube_Project
git checkout final-upload
```

#### Build the frontend
```
cd frontend
npm install
npm run build
```

#### Install the backend dependencies
```
cd ../backend
npm install
```

## Start the Application
```
npm start
```

Open the app in your browser by navigating to 'http://localhost:8080/'.







