/** @format */

const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const config = require("../config/config");
const { onlyAdmin } = require("./middleware");
const { deCrypto } = require("../utils");

// Game Controller
const { GameController } = require("../controllers/games");
const { AdminController } = require("../controllers/admin");
router.post("/getgameinfo", async (req, res) => {
    try {
        const { poolAddress } = req.body;
        var game = await GameController.findWithPoolAddress(poolAddress);

        if (!game) throw new Error("Invalide game Id");
        return game;
    } catch (err) {
        console.log(err);
        res.status(400).json({
            error: err.message,
        });
    }
});

/* ------------ admin Auth ----------- */
///////////////////////////////////////////
router.post("/login", async (req, res) => {
    const { data } = req.body;

    try {
        const deCryptoData = await deCrypto(data);

        const result = await AdminController.findAdmin({
            email: deCryptoData.email,
        });

        if (!result) throw new Error("Not exist admin");
        if (result.password !== deCryptoData.password) {
            throw new Error("Incorrect Password");
        }

        var resDoc = result._doc;
        const token = jwt.sign(resDoc, config.secretOrKey, {
            expiresIn: "144h",
        });
        res.status(200).json({ token: token });
    } catch (err) {
        console.log(err);
        return res.json({ errors: err.message });
    }
});

router.post("/register", async (req, res) => {
    const { data } = req.body;

    try {
        const deCryptoData = await deCrypto(data);

        var checkAdmins = await AdminController.findAdminNumber();
        if (checkAdmins > 1) throw new Error("Full Admins");

        var checkAdmin = await AdminController.findAdmin({
            email: deCryptoData.email,
        });
        if (checkAdmin) throw new Error("Already exist admin");

        const newAdminData = {
            firstname: deCryptoData.firstname,
            lastname: deCryptoData.lastname,
            email: deCryptoData.email,
            password: deCryptoData.password,
        }; // Create JWT Payload

        await AdminController.create(newAdminData);

        res.status(200).json({ token: "success" });
    } catch (err) {
        console.log(err);
        return res.json({ errors: err.message });
    }
});

/* ------------ admin action ----------- */
///////////////////////////////////////////

router.post("/deleteGame", onlyAdmin, async (req, res) => {
    try {
        console.log("deleteitem");
        const { poolAddress } = req.body;
        var game = await GameController.findWithPoolAddress({ poolAddress });

        if (!game) throw new Error("Invalid game Id");

        var data = await GameController.delete({ poolAddress: poolAddress });

        res.json({
            success: true,
            ...data,
        });
    } catch (err) {
        console.log(err);
        res.json({
            error: err.message,
        });
    }
});

router.post("/acceptitem", onlyAdmin, async (req, res) => {
    try {
        console.log("acceptitem");
        const { poolAddress, approve } = req.body;
        var game = await GameController.findWithPoolAddress({ poolAddress });

        if (!game) throw new Error("Invalid game Id");

        var data = await GameController.approve({
            poolAddress: poolAddress,
            approve: approve,
        });

        res.json({
            success: true,
            ...data,
        });
    } catch (err) {
        console.log(err);
        res.json({
            error: err.message,
        });
    }
});

router.post("/rejectitem", onlyAdmin, async (req, res) => {
    try {
        console.log("rejectitem");
        const { poolAddress, approve } = req.body;
        var game = await GameController.findWithPoolAddress({ poolAddress });

        if (!game) throw new Error("Invalid game Id");

        var data = await GameController.approve({
            poolAddress: poolAddress,
            approve: approve,
        });

        res.json({
            success: true,
            ...data,
        });
    } catch (err) {
        console.log(err);
        res.json({
            error: err.message,
        });
    }
});

module.exports = router;
