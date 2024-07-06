const fs = require("fs");
const path = require("path");
const cloudinary = require("./cloudinary");

// Function to upload a video to Cloudinary
const uploadVideo = (filePath) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      { resource_type: "video" }, // Specify the resource type as video
      (error, result) => {
        if (error) reject(error); // Reject the promise if there's an error
        else resolve(result.secure_url); // Resolve the promise with the secure URL
      }
    );
  });
};

// Main function to upload videos and save URLs
const main = async () => {
  const directoryPath = path.join(__dirname, "../uploads/videos"); // Path to the videos directory
  const videoFiles = fs.readdirSync(directoryPath).filter(file => {
     // Filter to include only video files with specific extensions
    return file.endsWith(".mp4") || file.endsWith(".mov") || file.endsWith(".wmv") || file.endsWith(".avi") || file.endsWith(".flv") || file.endsWith(".mkv");
  });

  const videoUrls = [];

  // Loop through each video file and upload to Cloudinary
  for (const file of videoFiles) {
    const filePath = path.join(directoryPath, file);
    try {
      console.log(`Uploading ${file}...`);
      const url = await uploadVideo(filePath); // Upload the video and get the URL
      console.log(`Uploaded ${file}: ${url}`);
      videoUrls.push({ file, url }); // Add the file name and URL to the videoUrls array
    } catch (error) {
      console.error(`Failed to upload ${file}: ${error.message}`); // Log any errors
    }
  }

  // Write the video URLs to videos.json
  fs.writeFileSync(
    path.join(directoryPath, "videos.json"),
    JSON.stringify(videoUrls, null, 2)
  );
  console.log("videos.json file has been created with video URLs.");
};

// Execute the main function and handle any errors
main().catch((error) => {
  console.error(`Failed to upload videos: ${error.message}`);
});