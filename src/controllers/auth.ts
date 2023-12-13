import express from 'express';
import { getUserByEmail, createUser } from '../models/user';
import { shaPassword, random } from '../helpers';
const jwt = require('jsonwebtoken');

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Type your email and password!", result: null });
        }

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return res.status(400).json({ message: "User already exists", result: null });
        }

        const token = jwt.sign({ email: email }, 'AUTH', { expiresIn: '6h' });
        const salt = random();
        const user = await createUser({
            email,
            password: shaPassword(salt, password),
            salt
        });

        res.status(201).json({ message: "Registered successfully", result: { token, ...user } });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to register", result: error });
    }
}

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Type your email and password!", result: null });
        }

        const user = await getUserByEmail(email).select('+salt +password');

        if (!user) {
            return res.status(404).json({ message: "User not found", result: null });
        }

        const pwd = shaPassword(user.salt!, password);

        if (user.password != pwd) {
            return res.status(403).json({ message: "Incorrect password", result: null });
        }

        const token = jwt.sign({ email: email }, 'AUTH', { expiresIn: '6h' });
        res.status(200).json({ message: "Logged in successfully", result: { token, ...user.toObject() } });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to login", result: error });
    }
};