const mongoose = require("mongoose");
const { Faker, en } = require("@faker-js/faker");
const User = require("../models/User");
const cloudinary = require("./cloudinary");
const connectDB = require("../config/db");

const faker = new Faker({ locale: en });

const generateUsers = async () => {
  await connectDB();

  const users = [];

  for (let i = 0; i < 10; i++) {
    const result = await cloudinary.uploader.upload(faker.image.avatar(), {
      folder: "avatars",
    });
    const user = new User({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      avatar: result.secure_url,
      comments: [], // Empty array initially
      likes: [], // Empty array initially
      views: [], // Empty array initially
    });

    users.push(user);
  }

  try {
    await User.insertMany(users);
    console.log("Users inserted successfully.");
  } catch (err) {
    console.error("Error generating users:", err);
  } finally {
    mongoose.disconnect();
  }
};

generateUsers().catch((err) => {
  console.error("Error generating users:", err);
  mongoose.disconnect();
});
