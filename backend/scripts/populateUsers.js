const mongoose = require("mongoose");
const { Faker, en } = require("@faker-js/faker");
const User = require("../models/User");
const cloudinary = require("./cloudinary");
const connectDB = require("../config/db");

const faker = new Faker({ locale: en }); // Initialize Faker with English locale

// Function to generate fake users
const generateUsers = async () => {
  await connectDB(); // Connect to the database

  const users = [];

  for (let i = 0; i < 10; i++) {
    // Upload avatar image to Cloudinary
    const result = await cloudinary.uploader.upload(faker.image.avatar(), {
      folder: "avatars",
    });

    // Create new user with fake data
    const user = new User({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      avatar: result.secure_url, // URL of the uploaded avatar image
      comments: [], // Empty array initially
      likes: [], // Empty array initially
      views: [], // Empty array initially
    });

    users.push(user); // Add user to the users array
  }

  try {
    // Insert users into the database
    await User.insertMany(users);
    console.log("Users inserted successfully.");
  } catch (err) {
    console.error("Error generating users:", err); // Log any errors
  } finally {
    mongoose.disconnect(); // Disconnect from the database
  }
};

// Execute the generateUsers function and handle any errors
generateUsers().catch((err) => {
  console.error("Error generating users:", err); // Log any errors
  mongoose.disconnect(); // Disconnect from the database
});
