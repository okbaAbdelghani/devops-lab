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
        const limit = Math.min(
            parseInt(req.query.limit) || 10,
            1000
        );

        if (req.query.limit !== undefined && (isNaN(limit) || limit <= 0)) {
            return res.status(400).json({
                error: "limit must be a positive integer"
            });
        }

        const finalLimit = Math.min(limit || 10, 1000);

        const after = Math.max(
            parseInt(req.query.after) || 0, 0
        );

        const users = await usersService.getUsers(finalLimit, after);

        const nextCursor = users.length > 0 ? users[users.length - 1].id : null;
        res.json({
            data: users,
            nextCursor
        });
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