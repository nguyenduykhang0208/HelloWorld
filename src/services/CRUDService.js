import bcrypt from "bcryptjs"
import db from "../models/index"
import { raw } from "body-parser";
const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswordFromBcrypt = await (hashUserPassword(data.password));
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                gender: data.gender === '1' ? true : false,
                phoneNumber: data.phoneNumber,
                address: data.address,
                roleId: data.roleId,
            })
            resolve('Create a new user success!');
        } catch (e) {
            reject(e);
        }
    })
}

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    })
}

let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = db.User.findAll({
                raw: true
            });
            resolve(users);
        } catch (e) {
            reject(e);
        }
    })
}

let getUserInfoById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = db.User.findOne({
                where: { id: userId },
                raw: true
            });
            if (user) {
                resolve(user);
            }
            else {
                resolve({});
            }
        } catch (e) {
            reject(e);
        }
    })
}

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userId = data.id;
            let user = await db.User.findOne({
                where: { id: userId }
            });
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();
                resolve(
                    {
                        message: 'Update success'
                    }
                )
            }
            else {
                resolve({});
            }
        } catch (e) {
            reject(e);
        }
    })
}


let deleteUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId }
            });
            if (user) {
                await user.destroy();
                resolve();
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getUserInfoById: getUserInfoById,
    updateUserData: updateUserData,
    deleteUserById: deleteUserById,
    hashUserPassword: hashUserPassword
}