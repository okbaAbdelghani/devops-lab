const usersService = require("../services/users.service");

const createUser = async (req, res) => {
    const { name, email } = req.body;

    try {
        const user = await usersService.createUser(name, email);
        res.status(201).json(user);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
             error: "Failed to create user" 
        });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await usersService.getUsers();
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
             error: "Failed to fetch users" 
        });
    }
};

module.exports = {
    createUser, 
    getUsers 
};