const fs = require("fs-extra");
const path = require("path");
const cloudinary = require("./cloudinary");

// Paths
const imagesPath = path.join(__dirname, "images");
const outputPath = path.join(__dirname, "images.json");

// Function to upload images to Cloudinary and return URLs
async function uploadImages() {
  const imageFiles = fs
    .readdirSync(imagesPath)
    .filter((file) => /\.(jpg|jpeg|png|gif|svg|webp)$/.test(file));
  const imageData = [];

  for (const file of imageFiles) {
    const filePath = path.join(imagesPath, file);
    try {
      const result = await cloudinary.uploader.upload(filePath);
      imageData.push({
        title: path.basename(file, path.extname(file)),
        url: result.secure_url,
      });
      console.log(`Uploaded ${file} to Cloudinary.`);
    } catch (error) {
      console.error(`Failed to upload ${file}:`, error);
    }
  }

  // Save the image data to images.json
  fs.writeJsonSync(outputPath, imageData, { spaces: 2 });
  console.log("Saved image URLs to images.json");
}

// Main function to execute the script
async function main() {
  await uploadImages();
}

main().catch(console.error);
