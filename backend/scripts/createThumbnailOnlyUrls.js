const fs = require("fs-extra");
const path = require("path");
const cloudinary = require("./cloudinary");

// Paths
const imagesPath = path.join(__dirname, "images"); // Directory containing images
const outputPath = path.join(__dirname, "images.json"); // Path to output JSON file

// Function to upload images to Cloudinary and return URLs
async function uploadImages() {
  // Read image files from the directory and filter valid image formats
  const imageFiles = fs
    .readdirSync(imagesPath)
    .filter((file) => /\.(jpg|jpeg|png|gif|svg|webp)$/.test(file));
  const imageData = [];

  for (const file of imageFiles) {
    const filePath = path.join(imagesPath, file); // Full path to the image file
    try {
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(filePath);
      imageData.push({
        title: path.basename(file, path.extname(file)), // Extract title from filename
        url: result.secure_url, // Get secure URL from Cloudinary
      });
      console.log(`Uploaded ${file} to Cloudinary.`);
    } catch (error) {
      console.error(`Failed to upload ${file}:`, error); // Log error if upload fails
    }
  }

  // Save the image data to images.json
  fs.writeJsonSync(outputPath, imageData, { spaces: 2 });
  console.log("Saved image URLs to images.json");
}

// Main function to execute the script
async function main() {
  await uploadImages(); // Call the upload function
}

main().catch(console.error); // Execute the main function and catch any errors
