const fs = require("fs-extra");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const cloudinary = require("./cloudinary");

// Paths
const videosPath = path.join(__dirname, "../uploads/videos");
const imagesPath = path.join(__dirname, "images");
const outputPath = path.join(__dirname, "images.json");

// Ensure the images folder exists
fs.ensureDirSync(imagesPath);

// Function to capture screenshots from videos
async function captureScreenshots() {
  const videoFiles = fs
    .readdirSync(videosPath)
    .filter((file) => /\.(mp4|mov|wmv|avi|flv|mkv)$/.test(file));

  for (const file of videoFiles) {
    const filePath = path.join(videosPath, file);
    const outputImageName = `${path.basename(file, path.extname(file))}.jpg`;
    const outputImagePath = path.join(imagesPath, outputImageName);

    try {
      await new Promise((resolve, reject) => {
        ffmpeg(filePath)
          .outputOptions("-analyzeduration", "100M")
          .outputOptions("-probesize", "50M")
          .screenshots({
            timestamps: [7],
            filename: outputImageName,
            folder: imagesPath,
            size: "640x480",
          })
          .on("end", resolve)
          .on("error", reject);
      });

      console.log(`Screenshot saved for ${file} at ${outputImagePath}`);
      await uploadImageToCloudinary(outputImagePath, outputImageName);
      fs.removeSync(outputImagePath);
      console.log(`Deleted temporary image ${outputImagePath}`);
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message);
    }
  }
}

// Function to upload an image to Cloudinary and save the URL
async function uploadImageToCloudinary(filePath, fileName) {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    const imageData = {
      title: path.basename(fileName, path.extname(fileName)),
      url: result.secure_url,
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
  await captureScreenshots();
}

main().catch(console.error);
