# Welcome to Our YouTube Server Platform for Web!
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

## Development Process
#### Server Development
* Initially, we focused on implementing the register, sign-in, and token functions to ensure proper functionality.
* We then proceeded to work on the remaining functions, reviewing every detail to ensure React behavior met our expectations.
* After thorough testing, we uploaded our program and managed the project using Jira.
#### Architecture
* We set up a Node.js Express server using the MVC architecture, divided into Users, Videos, and Comments models.
* Each team member focused on one model, and later we integrated them.
* We integrated the Mongoose service to work with MongoDB.
#### React Integration
* We updated the React app to fetch data from the Express server, transitioning from a static to a dynamic application.
  
#### Additional Features
* User Authentication: Added JWT-based authentication for secure sessions. When a user logs in, they receive two types of tokens:
  * Refresh-token: Deleted after a week, requiring the user to reauthenticate.
  * Access-token: Automatically renews every hour and used for user verification for any action in the application.
 
## About Our Project
#### Home Page
* Upon entering the application, the home page will open as a guest. In each rendering of the application under the server, the user will be shown a total of 20 videos: ten of the most popular and ten randomly selected from the total of 40 videos in our database.
* Searching for specific videos can only be done on the home screen using the search bar.
* As a guest, you can watch videos and see which videos belong to which subscribers by clicking on the image of the person who uploaded the video on the home screen, clicking on the left menu, and selecting a specific subscription, or clicking on the author's image or name while watching any video.
* You can press the login button to go to the login screen or a logout button if you are recognized as a user.
* To get all the features that the application offers, you will need to create a new user and register or use this distributive user on the sign-in page:
  * Email: bendben13@gmail.com
  * Password: ben12345
* As a registered user, and only when connected, you will see two additional buttons at the top of the screen: one for uploading a new video and the other for settings where you can edit your user data. Additionally, you can click on your picture to see all the videos you have uploaded. Alternatively, you can click on the left menu and then on "Your videos" to display all your uploaded videos.

#### Sign-In Page
* Click on the "Sign In" button to navigate to the sign-in page. Here, you can enter your existing account details or navigate to the registration page if you are not registered yet.
* If you change your mind and want to return to the home page as a guest, click on the "YouTube" icon in the upper-left part of the registration screen or log in to the application.
* If you are already registered and want to log in, start typing your email to see suggestions. You can also view the password you type.


#### Sign-Up Page
* To create a new user in our YouTube app, fill in all required fields. The email must follow the pattern name@example.com. The password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji. Confirm your password, choose your display name, and upload a profile photo. Upon successful submission, you will be redirected to the sign-in page.
* If you change your mind and want to return to the home page as a guest, click on the "YouTube" icon in the upper-left part of the registration screen or log in to the application.
* Each time a new user registers, his password is encrypted, thus preserving the security of the user's information. In the database, the password that will be visible to that user will already be after the encryption.

#### New Video
* Registered users can upload new videos using the button on the upper-right side. Clicking this button opens a modal where you can enter the video title, description, and the video itself ( mp4 format). After uploading, you will receive a success message and be redirected to the home page.
* When uploading a video, the thumbnail that appears on the video card is created and saved automatically about 7 seconds after the video starts playing. Therefore, you do not need to upload a separate picture when uploading a new video.

#### Dark Mode
* You can switch between dark mode and light mode using the switch button on the upper-right side of the screen while browsing the application.

#### Video Viewing Page
* When watching a video, you will see the buttons displayed on the original YouTube site with unique designs. The icons for editing comments, deleting a video, or changing the title and description will not be shown if you are browsing the site as a guest. If you try to comment as a guest, you will receive an error message. As a registered user, you can submit your comment and see your profile picture next to your name in the comment.
* Whether you are a guest or not, you can click on the picture of the person who uploaded the video to view all the videos uploaded by that user.

## Summary of User Permissions
#### Upload, Edit, and Delete Videos
* Only signed-in users can upload, edit, or delete videos.
* After signing in, you will see a "video camera" button near the search bar, allowing you to upload new videos.
  And in addition a settings button where you can edit your user profile.
* Options to edit and delete videos you have uploaded will become available on the video details page, When clicking on the profile picture or welcome message, or on the "Your videos" button in the left menu. or in addition only if you watch the video you uploaded, you will be able to see the buttons required to perform these actions.

#### Comments on Videos
* Only signed-in users can comment on videos, edit their comments, or delete their comments.
* After signing in, you can add comments to videos by typing in the comment box and submitting.
* You will also see options to edit or delete comments on videos.
  
#### Update and Delete Users
* To update or delete an account, the user must be logged in and access their own page. They can do so by clicking the "settings" button, and then edit or delete, and a final confirmation of the deletion will be made if you decide this option. 
* The user can edit their display name, Email and profile picture.
* Deleting a user will also delete all videos uploaded by them, comments on these videos, and comments published by them on other videos.




![HOMEPAGE](https://github.com/Bendavidian/YouTube_Project/assets/122617665/85796115-e3c8-4f4b-a61e-e4521d9cf287)
![SIGN-IN](https://github.com/Bendavidian/YouTube_Project/assets/122617665/f5752a8d-82df-4194-ad60-a86b360b8aff)
![REGISTER](https://github.com/Bendavidian/YouTube_Project/assets/122617665/98ebe137-c0cd-4786-97af-c49de4e587fc)
![UPLOAD](https://github.com/Bendavidian/YouTube_Project/assets/122617665/82528b40-8be0-40f0-a662-d6127d9023b0)
![WATCHING_VIDEO](https://github.com/Bendavidian/YouTube_Project/assets/122617665/dfd9cdd5-b07f-4e41-a8a9-b8e288f52247)
![DARK-MODE](https://github.com/Bendavidian/YouTube_Project/assets/122617665/65b3f182-3eb0-4d98-85ea-b6a6cf29a29b)












