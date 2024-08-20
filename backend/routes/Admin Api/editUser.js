const express = require("express");
const router = express.Router();
const AdminDetails = require("../../models/Admin/adminDetails");
const AdminCredentials = require("../../models/Admin/adminCredentials");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateAdminToken = require('../../middlewares/authAdminMiddleware');
const SECRET_KEY = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;
const UserDetails = require("../../models/User/userDetails");

