import {
  getAllUsersService,
  getUserByIdService,
  createUserService,
  updateUserService,
  deleteUserService,
} from "../services/user.service.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersService();

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await getUserByIdService(Number(req.params.id));

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    const status = error.message === "User not found" ? 404 : 400;

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await createUserService(name, email);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await updateUserService(Number(req.params.id), name, email);

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    const status = error.message === "User not found" ? 404 : 400;

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await deleteUserService(Number(req.params.id));

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: user,
    });
  } catch (error) {
    const status = error.message === "User not found" ? 404 : 400;

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};
