/** @format */

const { ethers } = require("ethers");
const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const key = "Welcome to ICICB-ADMIN";

const lookupPromise = async (domain) => {
    return new Promise((resolve, reject) => {
        dns.lookup("domain", (err, address, family) => {
            if (err) reject(err);
            resolve(address);
        });
    });
};

/**
 * set delay for delayTimes
 * @param {Number} delayTimes - timePeriod for delay
 */
function delay(delayTimes) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(2);
        }, delayTimes);
    });
}

/**
 * change data type from Number to BigNum
 * @param {Number} value - data that need to be change
 * @param {Number} d - decimals
 */
function toBigNum(value, d) {
    return ethers.utils.parseUnits(value, d);
}

/**
 * change data type from BigNum to Number
 * @param {Number} value - data that need to be change
 * @param {Number} d - decimals
 */
function fromBigNum(value, d) {
    return ethers.utils.formatUnits(value, d);
}

const deCrypto = async (encryptedData) => {
    try {
        const decipher = crypto.createDecipher(algorithm, key);

        let decryptedData =
            decipher.update(encryptedData, "hex", "utf-8") +
            decipher.final("utf8");

        return JSON.parse(decryptedData);
    } catch (err) {
        throw new Error(err.message);
    }
};

module.exports = { delay, toBigNum, fromBigNum, lookupPromise, deCrypto };
