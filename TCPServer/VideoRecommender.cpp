#include <map>
#include <vector>
#include <algorithm>
#include <set>
#include <cmath>
#include <string>
#include <iostream>
#include <cstdlib> // for rand()
#include "VideoRecommender.h"

using namespace std;

#include "VideoRecommender.h"

// Constructor implementation
VideoRecommender::VideoRecommender(const vector<pair<string, int>>& initial_videos) {
    for (const auto& video : initial_videos) {
        video_popularity[video.first] = video.second;
    }
}

// Function to add a video to the user's watch history
void VideoRecommender::add_watch_history(const string& userId, const string& videoId) {
    if (find(user_watch_history[userId].begin(), user_watch_history[userId].end(), videoId) == user_watch_history[userId].end()) {
        user_watch_history[userId].push_back(videoId);
        video_popularity[videoId]++;
        cout << "Added video: " << videoId << " to user: " << userId << "'s watch history." << endl;
    } else {
        cout << "Video: " << videoId << " is already in user: " << userId << "'s watch history." << endl;
    }
}

// Function to recommend videos for a user
vector<string> VideoRecommender::recommend_videos(const string& userId, int k) {
    vector<string> recommendations;
    map<string, int> candidate_videos;

    vector<string> watched_videos = user_watch_history[userId];
    if (watched_videos.empty()) {
        return recommendations;
    }

    vector<pair<string, double>> user_similarities;
    for (const auto &entry : user_watch_history) {
        string other_user_id = entry.first;
        if (other_user_id == userId) {
            continue;
        }
        double similarity = calculate_similarity(watched_videos, entry.second);
        if (similarity > 0) {
            user_similarities.push_back({other_user_id, similarity});
        }
    }

    sort(user_similarities.begin(), user_similarities.end(), [](const pair<string, double> &a, const pair<string, double> &b) {
        return b.second < a.second;
    });

    for (const auto &user : user_similarities) {
        const vector<string> &other_user_videos = user_watch_history[user.first];
        for (const string &vid : other_user_videos) {
            if (find(watched_videos.begin(), watched_videos.end(), vid) == watched_videos.end()) {
                candidate_videos[vid] += video_popularity[vid];
            }
        }
    }

    vector<pair<string, int>> sorted_videos(candidate_videos.begin(), candidate_videos.end());
    sort(sorted_videos.begin(), sorted_videos.end(), [](const pair<string, int> &a, const pair<string, int> &b) {
        return b.second < a.second;
    });

    for (const auto &vid : sorted_videos) {
        recommendations.push_back(vid.first);
        if (recommendations.size() >= 10)
            break;
    }

    if (recommendations.size() < 6) {
        for (const auto &entry : video_popularity) {
            if (find(recommendations.begin(), recommendations.end(), entry.first) == recommendations.end() &&
                find(watched_videos.begin(), watched_videos.end(), entry.first) == watched_videos.end()) {
                recommendations.push_back(entry.first);
                if (recommendations.size() >= 6)
                    break;
            }
        }
    }

    return recommendations;
}

// Private method implementation for calculating similarity
double VideoRecommender::calculate_similarity(const vector<string>& u1, const vector<string>& ui) {
    set<string> u1_set(u1.begin(), u1.end());
    set<string> ui_set(ui.begin(), ui.end());

    int intersection_size = 0;
    for (const string& vid : u1_set) {
        if (ui_set.find(vid) != ui_set.end()) {
            intersection_size++;
        }
    }

    set<string> union_set = u1_set;
    union_set.insert(ui_set.begin(), ui_set.end());

    int union_size = union_set.size();

    return (double)intersection_size / union_size;
}