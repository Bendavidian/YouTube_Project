const fs = require("fs");
const path = require("path");
const cloudinary = require("./cloudinary");

const uploadVideo = (filePath) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      { resource_type: "video" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
  });
};

const main = async () => {
  const directoryPath = path.join(__dirname, "../uploads/videos"); // Path to the videos directory
  const videoFiles = fs.readdirSync(directoryPath).filter(file => {
    return file.endsWith(".mp4") || file.endsWith(".mov") || file.endsWith(".wmv") || file.endsWith(".avi") || file.endsWith(".flv") || file.endsWith(".mkv");
  });

  const videoUrls = [];

  for (const file of videoFiles) {
    const filePath = path.join(directoryPath, file);
    try {
      console.log(`Uploading ${file}...`);
      const url = await uploadVideo(filePath);
      console.log(`Uploaded ${file}: ${url}`);
      videoUrls.push({ file, url });
    } catch (error) {
      console.error(`Failed to upload ${file}: ${error.message}`);
    }
  }

  fs.writeFileSync(
    path.join(directoryPath, "videos.json"),
    JSON.stringify(videoUrls, null, 2)
  );
  console.log("videos.json file has been created with video URLs.");
};

main().catch((error) => {
  console.error(`Failed to upload videos: ${error.message}`);
});