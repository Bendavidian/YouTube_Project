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


