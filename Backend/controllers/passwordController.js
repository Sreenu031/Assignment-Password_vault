const Password = require("../models/Password");

// Get all passwords for a user
const getPasswords = async (req, res) => {
  try {
    const passwords = await Password.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    // Transform data to match frontend format
    const formattedPasswords = passwords.map((password) => ({
      id: password._id.toString(),
      title: password.title,
      username: password.username,
      password: password.password,
      notes: password.notes,
      createdAt: password.createdAt.toISOString().split("T")[0],
    }));

    res.status(200).json({
      success: true,
      passwords: formattedPasswords,
    });
  } catch (error) {
    console.error("Get passwords error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch passwords",
    });
  }
};

// Create a new password
const createPassword = async (req, res) => {
  try {
    const { title, username, password, notes } = req.body;

    // Validation
    if (!title || !username || !password) {
      return res.status(400).json({
        success: false,
        error: "Title, username, and password are required",
      });
    }

    const newPassword = new Password({
      userId: req.user.id,
      title: title.toString().trim(),
      username: username.toString().trim(),
      password: password.toString(),
      notes: notes ? notes.toString().trim() : "",
    });

    const savedPassword = await newPassword.save();

    // Format response to match frontend expectations
    const formattedPassword = {
      id: savedPassword._id.toString(),
      title: savedPassword.title,
      username: savedPassword.username,
      password: savedPassword.password,
      notes: savedPassword.notes,
      createdAt: savedPassword.createdAt.toISOString().split("T")[0],
    };

    res.status(201).json({
      success: true,
      password: formattedPassword,
    });
  } catch (error) {
    console.error("Create password error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create password",
    });
  }
};

// Update a password
const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, username, password, notes } = req.body;

    // Validation
    if (!title || !username || !password) {
      return res.status(400).json({
        success: false,
        error: "Title, username, and password are required",
      });
    }

    const existingPassword = await Password.findOne({
      _id: id,
      userId: req.user.id,
    });

    if (!existingPassword) {
      return res.status(404).json({
        success: false,
        error: "Password not found",
      });
    }

    // Update fields
    existingPassword.title = title.toString().trim();
    existingPassword.username = username.toString().trim();
    existingPassword.password = password.toString();
    existingPassword.notes = notes ? notes.toString().trim() : "";

    const updatedPassword = await existingPassword.save();

    // Format response
    const formattedPassword = {
      id: updatedPassword._id.toString(),
      title: updatedPassword.title,
      username: updatedPassword.username,
      password: updatedPassword.password,
      notes: updatedPassword.notes,
      createdAt: updatedPassword.createdAt.toISOString().split("T")[0],
    };

    res.status(200).json({
      success: true,
      password: formattedPassword,
    });
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update password",
    });
  }
};

// Delete a password
const deletePassword = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPassword = await Password.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!deletedPassword) {
      return res.status(404).json({
        success: false,
        error: "Password not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Password deleted successfully",
    });
  } catch (error) {
    console.error("Delete password error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete password",
    });
  }
};

// Get a single password
const getPassword = async (req, res) => {
  try {
    const { id } = req.params;

    const password = await Password.findOne({
      _id: id,
      userId: req.user.id,
    });

    if (!password) {
      return res.status(404).json({
        success: false,
        error: "Password not found",
      });
    }

    // Format response
    const formattedPassword = {
      id: password._id.toString(),
      title: password.title,
      username: password.username,
      password: password.password,
      notes: password.notes,
      createdAt: password.createdAt.toISOString().split("T")[0],
    };

    res.status(200).json({
      success: true,
      password: formattedPassword,
    });
  } catch (error) {
    console.error("Get password error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch password",
    });
  }
};

module.exports = {
  getPasswords,
  createPassword,
  updatePassword,
  deletePassword,
  getPassword,
};
