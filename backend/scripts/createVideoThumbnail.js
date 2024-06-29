const fs = require("fs-extra");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");

// Paths
const videosPath = path.join(__dirname, "../uploads/videos");
const imagesPath = path.join(__dirname, "images");

// Ensure the images folder exists
fs.ensureDirSync(imagesPath);

// Function to capture screenshots from videos
function captureScreenshots() {
  const videoFiles = fs
    .readdirSync(videosPath)
    .filter((file) => /\.(mp4|mov|wmv|avi|flv|mkv)$/.test(file));

  videoFiles.forEach((file, index) => {
    const filePath = path.join(videosPath, file);
    const outputImageName = `${path.basename(file, path.extname(file))}.jpg`;
    const outputImagePath = path.join(imagesPath, outputImageName);

    ffmpeg(filePath)
      .outputOptions("-analyzeduration", "100M")
      .outputOptions("-probesize", "50M")
      .screenshots({
        timestamps: [7],
        filename: outputImageName,
        folder: imagesPath,
        size: "640x480",
      })
      .on("end", () => {
        console.log(`Screenshot saved for ${file} at ${outputImagePath}`);
      })
      .on("error", (err, stdout, stderr) => {
        console.error(`Error capturing screenshot for ${file}:`, err.message);
        console.error("ffmpeg stderr:", stderr);
      });
  });
}

// Main function to execute the script
async function main() {
  captureScreenshots();
}

main().catch(console.error);
