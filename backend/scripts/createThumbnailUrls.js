const fs = require("fs-extra");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const cloudinary = require("./cloudinary");

// Paths
const videosPath = path.join(__dirname, "../uploads/videos"); // Path to the videos folder
const imagesPath = path.join(__dirname, "images"); // Path to the images folder
const outputPath = path.join(__dirname, "images.json"); // Path to the output JSON file

// Ensure the images folder exists
fs.ensureDirSync(imagesPath);

// Function to capture screenshots from videos
async function captureScreenshots() {
  // Read video files from the directory and filter valid video formats
  const videoFiles = fs
    .readdirSync(videosPath)
    .filter((file) => /\.(mp4|mov|wmv|avi|flv|mkv)$/.test(file));

  for (const file of videoFiles) {
    const filePath = path.join(videosPath, file); // Full path to the video file
    const outputImageName = `${path.basename(file, path.extname(file))}.jpg`; // Output image name
    const outputImagePath = path.join(imagesPath, outputImageName); // Full path to the output image

    try {
      // Capture screenshot from video
      await new Promise((resolve, reject) => {
        ffmpeg(filePath)
          .outputOptions("-analyzeduration", "100M")
          .outputOptions("-probesize", "50M")
          .screenshots({
            timestamps: [7], // Capture screenshot at 7 seconds
            filename: outputImageName,
            folder: imagesPath,
            size: "640x480",
          })
          .on("end", resolve)
          .on("error", reject);
      });

      console.log(`Screenshot saved for ${file} at ${outputImagePath}`);
      await uploadImageToCloudinary(outputImagePath, outputImageName); // Upload the screenshot to Cloudinary
      fs.removeSync(outputImagePath); // Delete the local screenshot
      console.log(`Deleted temporary image ${outputImagePath}`);
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message); // Log any errors
    }
  }
}

// Function to upload an image to Cloudinary and save the URL
async function uploadImageToCloudinary(filePath, fileName) {
  try {
    const result = await cloudinary.uploader.upload(filePath); // Upload image to Cloudinary
    const imageData = {
      title: path.basename(fileName, path.extname(fileName)), // Extract title from filename
      url: result.secure_url, // Get secure URL from Cloudinary
    };

    // Read existing data from images.json
    let existingData = [];
    if (fs.existsSync(outputPath)) {
      existingData = fs.readJsonSync(outputPath);
    }

    // Add new image data
    existingData.push(imageData);

    // Save the updated data to images.json
    fs.writeJsonSync(outputPath, existingData, { spaces: 2 });
    console.log(`Uploaded ${fileName} to Cloudinary and saved URL.`);
  } catch (error) {
    console.error(`Failed to upload ${fileName}:`, error);
  }
}

// Main function to execute the script
async function main() {
  await captureScreenshots(); // Capture screenshots from videos and upload to Cloudinary
}

main().catch(console.error); // Execute the main function and catch any errors
