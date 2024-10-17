# Page5- Android App
### Development Process
### API Development
We began by developing APIs for users, videos, and comments. Each API handles requests such as adding, fetching,
or editing data from the database.
The UserAPI manages user-related actions, including registration, authentication, and profile updates.
The CommentApi facilitates comment-related functions like adding, editing, and deleting comments on videos.
The VideoAPI focuses on handling video data and supporting operations such as fetching recommended videos or video details.
### Local Database with Room
We integrated Room for local data storage, allowing the app to work offline and cache important data.
DAO (Data Access Objects):
UserDao.java, VideoDao.java, and CommentsDao.java define the methods for interacting with the local SQLite database. 
The repositories (e.g., UserRepository.java, VideoRepository.java, and CommentRepository.java)
 communicate with the DAOs to fetch data locally when available. 
If the data is not present in the local database, the repository will call the API to fetch it from the server and cache it
in Room.
### Authentication
For secure user authentication, we implemented a JWT-based authentication system. This ensures that users can perform actions
only after successful login.
The AuthenticationInterceptor attaches tokens to every outgoing request, ensuring protected endpoints are securely accessed
by verified users.
### Retrofit Integration
We used Retrofit in the RetrofitBuilder.java to create API services and handle network requests to the server.
Each API call (e.g., user login, fetch comments, video interactions) is built and handled seamlessly via Retrofit's interface.
WebServiceAPI handles global configurations for Retrofit, making it easier to initialize network connections across
different API endpoints.
### Repository and ViewModel Layers
We introduced repositories and view models to adhere to the MVVM (Model-View-ViewModel) architecture.

## About Our Project
#### Home Page
* Upon entering the application, the home page will open as a guest. In each rendering of the application under the server, the user will be shown a total of 20 videos: 10 of the most popular and 10 randomly selected from the total of 40 videos in our database.
* Searching for specific videos can only be done on the home screen using the search bar.
* As a guest, you can only watch videos.
* You can press the left menu or just swipe right so the left menu will open, and press the login button, or press the logout button if you are already logged in.
* To get all the features that the application offers, you will need to create a new user and register or use this distributive user on the sign-in page:
  * Email: bendben13@gmail.com
  * Password: ben12345
* As a registered user you can add videos by pressing the + button at the bottom of the page. 
The user button at the bottom of the page will redirect you to your profile page if you are a registered user(otherwise- to a guest user page). There, you can see all the videos you have uploaded and edit your user data, such as your profile picture, email, and password. Additionally, by selecting a video you've uploaded, you will have the option to press the "Edit" and "Delete" buttons to manage your videos.

#### Login Page
* Swipe right and left menu will open. Click on the "Login" button to navigate to the login page. Here, you can enter your existing account details or navigate to the registration page if you are not registered yet.

#### Sign-Up Page
*press on Login, and then on the button "Click here" to register. 
* To create a new user in our YouTube app, fill in all required fields. The email must follow the pattern name@example.com. The password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji. Confirm your password, choose your display name, and upload a profile photo, or take one. Upon successful submission, you will be redirected to the Login page.
* Each time a new user registers, his password is encrypted, thus preserving the security of the user's information. In the database, the password that will be visible to that user will already be after the encryption.

#### New Video
* Registered users can upload new videos using the button + at the bottom of the page. Clicking this button opens a page where you can enter the video title, description, and the video itself. After uploading, you will receive a success message and be redirected to the home page.
* When uploading a video, the thumbnail that appears on the video card is created and saved automatically about 7 seconds after the video starts playing. Therefore, you do not need to upload a separate picture when uploading a new video.

#### Dark Mode
* You can switch between dark mode and light mode using the switch button on the upper-right side of the screen while browsing the application.

#### Video Viewing Page
* When watching a video you'll see the details about the video. Only the owner of the video can edit or delete it. 
 If you try to comment as a guest, you will receive an error message. As a registered user, you can submit your comment and see your profile picture next to your name in the comment.

## Summary of User Permissions
#### Upload, Edit, and Delete Videos
* Only signed-in users can upload, edit, or delete videos.
* After signing in, you will see a "+" button at the bottom of the page, allowing you to upload new videos.
  And in addition, a user button  where you can edit your user profile, and also see all the videos you have uploaded.
* Options to edit and delete videos you have uploaded will become available by pressing on the user button, choosing the video, and pressing on the "Delete" or "Edit" buttons.

#### Comments on Videos
* Only signed-in users can comment on videos, edit their comments, or delete their comments.
* After signing in, you can add comments to videos by typing in the comment box and submitting.
* You will also see options to edit or delete comments on videos.
  
#### Update and Delete Users
* To update or delete an account, the user must be logged in and access their own page. 
* The user can edit their display name, Email and profile picture.
* Deleting a user will also delete all videos uploaded by them, comments on these videos, and comments published by them on other videos.


![Screenshot_20241017_144906_YouTube](https://github.com/user-attachments/assets/10bef6d6-108c-42b4-99f0-507acee0bb1e)
