const bcrypt = require("bcryptjs");
const User = require("../model/userModel");

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.log("ADMIN_EMAIL / ADMIN_PASSWORD not set in .env — skipping admin seed");
      return;
    }

    const existingAdmin = await User.findOne({ where: { email: adminEmail } });
    if (existingAdmin) {
      console.log("Admin account already exists — skipping seed");
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await User.create({
      name: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "Admin",
    });

    console.log(`✅ Admin account created: ${adminEmail}`);
  } catch (error) {
    console.error("Error seeding admin account:", error);
  }
};

module.exports = seedAdmin;