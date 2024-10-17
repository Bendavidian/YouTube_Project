# Page5- Android App
### Development Process
### API Development
We began by developing APIs for users, videos, and comments. Each API handles requests such as adding, fetching,
or editing data from the database.
The UserAPI manages user-related actions, including registration, authentication, and profile updates.
The CommentApi facilitates comment-related functions like adding, editing, and deleting comments on videos.
The VideoAPI focuses on handling video data, supporting operations such as fetching recommended videos or video details.
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
* Upon entering the application, the home page will open as a guest. In each rendering of the application under the server, the user will be shown a total of 20 videos: ten of the most popular and ten randomly selected from the total of 40 videos in our database.
* Searching for specific videos can only be done on the home screen using the search bar.
* As a guest, you can only watch videos.
* You can press the left menu or just swipe right so the left menu will open, and press the login button, or to press the logout button if you are already logged in.
* To get all the features that the application offers, you will need to create a new user and register or use this distributive user on the sign-in page:
  * Email: bendben13@gmail.com
  * Password: ben12345
* As a registered user you can add videos by pressing the + button at the bottom of the page. 
The user button at the bottom of the page will redirect you to your profile page if you are a registered user(otherwise- to a guest user page). There, you can see all the videos you have uploaded and edit your user data, such as your profile picture, email, and password. Additionally, by selecting a video you've uploaded, you will have the option to press the "Edit" and "Delete" buttons to manage your videos.

#### Login Page
* Click on the "Sign In" button to navigate to the sign-in page. Here, you can enter your existing account details or navigate to the registration page if you are not registered yet.
* If you change your mind and want to return to the home page as a guest, click on the "YouTube" icon in the upper-left part of the registration screen or log in to the application.
* If you are already registered and want to log in, start typing your email to see suggestions. You can also view the password you type.


#### Sign-Up Page
* To create a new user in our YouTube app, fill in all required fields. The email must follow the pattern name@example.com. The password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji. Confirm your password, choose your display name, and upload a profile photo. Upon successful submission, you will be redirected to the sign-in page.
* If you change your mind and want to return to the home page as a guest, click on the "YouTube" icon in the upper-left part of the registration screen or log in to the application.
* Each time a new user registers, his password is encrypted, thus preserving the security of the user's information. In the database, the password that will be visible to that user will already be after the encryption.

