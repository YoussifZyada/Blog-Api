import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./server/models/User.js";
import Post from "./server/models/Post.js";

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    console.log("Cleared existing data");

    // Create users
    const password = await bcrypt.hash("password123", 10);

    const youssif = await User.create({
      username: "youssifzyada",
      email: "youssif@test.com",
      password,
    });

    const ahmed = await User.create({
      username: "ahmed zyada",
      email: "ahmed@test.com",
      password,
    });

    const zyad = await User.create({
      username: "zyad zyada",
      email: "zyad@test.com",
      password,
    });

    console.log("Users created");

    // Create posts for youssif
    await Post.create([
      { user: youssif._id, content: "Hello world! This is my first post on this blog." },
      { user: youssif._id, content: "Learning Node.js has been an amazing journey so far!" },
      { user: youssif._id, content: "Just finished building my first REST API. Feeling proud!" },
    ]);

    // Create posts for ahmed
    await Post.create([
      { user: ahmed._id, content: "Ahmed's first post - excited to be here!" },
      { user: ahmed._id, content: "MongoDB + Express = perfect combination for backend dev." },
      { user: ahmed._id, content: "Debugging is like being a detective in a crime movie where you are also the murderer." },
    ]);

    // Create posts for zyad
    await Post.create([
      { user: zyad._id, content: "Zyad checking in with his first post!" },
      { user: zyad._id, content: "React hooks make life so much easier. useState is my favorite!" },
      { user: zyad._id, content: "Clean code is a dream. Messy code is reality. Working on closing the gap." },
    ]);

    console.log("Posts created");
    console.log("Seed completed!");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err.message);
    process.exit(1);
  }
};

seed();
