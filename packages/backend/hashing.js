// packages/backend/hashing.js

import bcrypt from "bcrypt";

const saltRounds = 12;

async function hashPassword(password) {
    return await bcrypt.hash(password, saltRounds);
}

async function comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

// hashPassword("password").then(hash => {
//     console.log("Hashed password: ", hash);
//     comparePassword("password", hash).then(result => {
//         console.log("Password match: ", result);
//     });
// });

export { hashPassword, comparePassword };