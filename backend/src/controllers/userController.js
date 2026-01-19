import bcrypt from "bcryptjs";
import User from "../models/user.js";
import jwt from "jsonwebtoken"


export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email })

        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ name, email, password })
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '3d' })
        })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        console.error(error, "user error here")
    }
}


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user._name,
                email: user.email,
                token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
            })
        } else {
            res.status(401).json({ message: 'Invalid email or password' })
        }
    } catch (error) {
        res.status(401).json({ message: error.message })
    }

}