#include <iostream>
#include <pthread.h>
#include "VideoRecommender.h"
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <cstring>
#include <sstream> 

using namespace std;

const int port_no = 5555;
VideoRecommender* videoRecommender = nullptr; // Pointer to allow dynamic initialization later

// Function to parse video data from client
vector<pair<string, int>> parse_video_data(const string& data) {
    vector<pair<string, int>> videos;
    istringstream stream(data);
    string videoId;
    int views;

    // Extract videoId and views from the stream
    while (stream >> videoId >> views) {
        videos.push_back({videoId, views});
    }

    return videos;
}

void* handle_client(void* client_sock_ptr) {
    int client_sock = *(int*)client_sock_ptr;  // Cast and dereference the client socket

    char buffer[4096];
    int read_bytes;

    // Receive data from the client
    while ((read_bytes = recv(client_sock, buffer, sizeof(buffer), 0)) > 0) {
        buffer[read_bytes] = '\0'; // Null-terminate the received data
        cout << "Received: " << buffer << endl;

        // Create a stream from the received data
        std::istringstream stream(buffer);
        std::string command;

        // Check if the client sends video data to initialize VideoRecommender
        stream >> command;
        if (command == "INIT") {
            string video_data = buffer + 5;  // Skip the "INIT " prefix
            vector<pair<string, int>> videos = parse_video_data(video_data);

            // Initialize the VideoRecommender with video data
            videoRecommender = new VideoRecommender(videos);
            cout << "VideoRecommender initialized with video data from client" << endl;

            string response = "VideoRecommender initialized successfully\n";
            send(client_sock, response.c_str(), response.length(), 0);
        }
        else if (command == "RECOMMEND") {
            string userId, videoId;
            stream >> userId >> videoId;

            if (videoRecommender != nullptr) {
                cout << "Processing userId: " << userId << ", videoId: " << videoId << endl;

                // Add the video to the user's watch history
                videoRecommender->add_watch_history(userId, videoId);

                // Get video recommendations for the user
                vector<string> recommendations = videoRecommender->recommend_videos(userId);

                // Prepare a response with the recommended videos
                string response = "";
                for (const string& video : recommendations) {
                    response += video + " ";
                }

                // Send the recommendations back to the client
                send(client_sock, response.c_str(), response.length(), 0);
            } else {
                // If the recommender is not initialized, send an error message
                string error_message = "Error: VideoRecommender not initialized.\n";
                send(client_sock, error_message.c_str(), error_message.length(), 0);
            }
        } else {
            string error_message = "Error: Invalid command.\n";
            send(client_sock, error_message.c_str(), error_message.length(), 0);
        }
    }

    if (read_bytes == 0) {
        cout << "Client disconnected." << endl;
    } else if (read_bytes < 0) {
        perror("Error receiving data from client");
    }

    close(client_sock);
    return nullptr;
}


int main() {
    // Create the server socket
    int server_sock = socket(AF_INET, SOCK_STREAM, 0);
    if (server_sock < 0) {
        perror("Error creating socket");
        return -1;
    }

    // Set up the server address structure
    struct sockaddr_in server_addr;
    memset(&server_addr, 0, sizeof(server_addr));
    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = INADDR_ANY;  // Bind to all available interfaces
    server_addr.sin_port = htons(port_no);

    // Bind the socket to the specified port
    if (bind(server_sock, (struct sockaddr*)&server_addr, sizeof(server_addr)) < 0) {
        perror("Error binding socket");
        close(server_sock);
        return -1;
    }

    // Start listening for incoming connections
    if (listen(server_sock, 10) < 0) {  // 10 is the maximum number of pending connections
        perror("Error listening on socket");
        close(server_sock);
        return -1;
    }

    cout << "Server is listening on port " << port_no << endl;

    // Main loop: Accept and handle client connections
    while (true) {
        struct sockaddr_in client_addr;
        socklen_t client_len = sizeof(client_addr);
        int client_sock = accept(server_sock, (struct sockaddr*)&client_addr, &client_len);

        if (client_sock < 0) {
            perror("Error accepting connection");
            continue;
        }

        cout << "New client connected." << endl;

        // Create a new thread to handle the client
        pthread_t client_thread;
        if (pthread_create(&client_thread, nullptr, handle_client, &client_sock) != 0) {
            perror("Error creating thread");
            close(client_sock);
        }

        // Optionally detach the thread, so it cleans up automatically after finishing
        pthread_detach(client_thread);
    }

    // Close the server socket
    close(server_sock);
    return 0;
}
