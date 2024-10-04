#ifndef VIDEO_RECOMMENDER_H
#define VIDEO_RECOMMENDER_H

#include <map>
#include <vector>
#include <string>

using namespace std;

class VideoRecommender {
private:
    map<string, vector<string>> user_watch_history; // user ID to list of watched video IDs
    map<string, int> video_popularity;              // video ID to its watch count

    double calculate_similarity(const vector<string>& u1, const vector<string>& ui);

public:
    VideoRecommender(const vector<pair<string, int>>& initial_videos); // Constructor

    void add_watch_history(const string& userId, const string& videoId); // Add to watch history
    vector<string> recommend_videos(const string& userId, int k = 3); // Recommend videos
};

#endif // VIDEO_RECOMMENDER_H
