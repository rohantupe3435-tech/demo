import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";

// Load environment variables
dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log("[Seeder] Clearing existing users...");
    await User.deleteMany();

    const adminUser = {
      name: process.env.ADMIN_NAME || "Store Admin",
      email: (process.env.ADMIN_EMAIL || "admin@demo.com").toLowerCase().trim(),
      password: process.env.ADMIN_PASSWORD || "admin123",
      role: "admin"
    };

    const customerUser = {
      name: "Demo Customer",
      email: "customer@demo.com",
      password: "customer123",
      role: "customer"
    };

    console.log("[Seeder] Seeding default admin & customer accounts...");
    await User.create(adminUser);
    await User.create(customerUser);

    console.log("=========================================");
    console.log("  Default Users Seeded Successfully!");
    console.log(`  Admin:    ${adminUser.email} / ${adminUser.password}`);
    console.log(`  Customer: ${customerUser.email} / ${customerUser.password}`);
    console.log("=========================================");

    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    console.log("[Seeder] Destroying all user data...");
    await User.deleteMany();

    console.log("[Seeder] All user data successfully wiped.");
    process.exit(0);
  } catch (error) {
    console.error(`[Destroy Error]: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  seedData();
}
