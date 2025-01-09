import { Model, where, Op } from "sequelize";
import db from "../models/index"
import bcrypt from "bcryptjs"
import { raw } from "body-parser";
const salt = bcrypt.genSaltSync(10);
import CommonUtils from "../Utils/commonUtils";
let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                let user = await db.User.findOne({
                    where: { email: email },
                    attributes: ['id', 'email', 'roleId', 'password', 'firstName', 'lastName', 'image'],
                    raw: true
                })
                if (user) {
                    let check = await bcrypt.compareSync(password, user.password)
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'OK!';
                        delete user.password;
                        if (user.image) {
                            user.image = new Buffer(user.image, 'base64').toString('binary');
                        }
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = `Wrong password!`;
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User isn't exist.`
                }
            } else {
                userData.errCode = 1;
                userData.errMessage = `Your's email isn't exist. Please try another email!`
            }
            resolve(userData)
        } catch (e) {
            reject(e)
        }
    })

}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            })
            if (user) {
                resolve(true)
            }
            else {
                resolve(false)
            }
        } catch (e) {
            reject(e)
        }
    })
}

let GetAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                });
            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users);
        } catch (error) {
            reject(error)
        }
    })
}


let getUsersWithPagination = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.perPage || !data.page) {
                resolve({
                    errCode: 1,
                    message: 'Missing parameter!'
                })
            }
            let users = '';
            let { perPage, page } = data;
            let keyword = data.keyword ? data.keyword : "";
            let tableName = 'users';
            const { limit, offset } = CommonUtils.getPagination(+page, +perPage)
            await db.User.findAndCountAll({
                limit: limit,
                offset: offset,
                where: {
                    [Op.or]: [
                        { email: { [Op.like]: '%' + keyword + '%' } },
                        { firstName: { [Op.like]: '%' + keyword + '%' } },
                        { lastName: { [Op.like]: '%' + keyword + '%' } },
                        { address: { [Op.like]: '%' + keyword + '%' } },
                        { phoneNumber: { [Op.like]: '%' + keyword + '%' } }
                    ]
                }
            }).then(data => {
                users = CommonUtils.getPagingData(data, +page, limit, tableName)
            })
            resolve(users)
        }
        catch (e) {
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

let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Your email is already in use!'
                })
            }
            else {
                let hashPasswordFromBcrypt = await (hashUserPassword(data.password));
                if (data?.isPatient === true) {
                    let newUser = await db.User.create({
                        email: data.email,
                        password: hashPasswordFromBcrypt,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        gender: data.gender,
                        phoneNumber: data.phoneNumber,
                        address: data.address,
                        roleId: 'R3',
                        positionId: 'P10',
                        image: ''
                    })

                    await db.Patient.create({
                        patientId: newUser.id,
                        birthDay: data.birthDay,
                        phoneNumber2: data.phoneNumber2
                    });
                }
                else {
                    await db.User.create({
                        email: data.email,
                        password: hashPasswordFromBcrypt,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        gender: data.gender,
                        phoneNumber: data.phoneNumber,
                        address: data.address,
                        roleId: data.roleId,
                        positionId: data.positionId,
                        image: data.avatar
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let user = await db.User.findOne({
            where: { id: userId },
            raw: false
        })
        if (!user) {
            resolve({
                errCode: 2,
                errMessage: `The user ins't exist!`
            })
        }
        await user.destroy();
        resolve({
            errCode: 0,
            errMessage: `The user is deleted`
        })
    })
}

let patientEditAccount = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userId = data.id;
            if (!userId || !data.gender || !data.firstName || !data.lastName) {
                resolve({
                    errCode: 2,
                    errMessage: `Missing required parameters!`
                });
            }
            let user = await db.User.findOne({
                where: { id: userId },
                raw: false
            });
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.phoneNumber = data.phoneNumber;
                user.gender = data.gender;
                if (data.avatar) {
                    user.image = data.avatar;
                }

                await user.save();
                let patientData = await db.Patient.findOne({
                    where: { patientId: userId },
                    raw: false

                })

                patientData.birthDay = data.birthDay;
                patientData.phoneNumber2 = data.phoneNumber2;
                patientData.note = data.note;
                await patientData.save();

                resolve(
                    {
                        errCode: 0,
                        errMessage: 'Update the user succeed!'
                    }
                )
            }
            else {
                resolve({
                    errCode: 1,
                    errMessage: `User's not found!`
                });
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
            if (!userId || !data.roleId || !data.positionId || !data.gender) {
                resolve({
                    errCode: 2,
                    errMessage: `Missing required parameters!`
                });
            }
            let user = await db.User.findOne({
                where: { id: userId },
                raw: false
            });
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.phoneNumber = data.phoneNumber;
                user.gender = data.gender;
                user.positionId = data.positionId;
                user.roleId = data.roleId;
                if (data.avatar) {
                    user.image = data.avatar;
                }
                await user.save();
                resolve(
                    {
                        errCode: 0,
                        errMessage: 'Update the user succeed!'
                    }
                )
            }
            else {
                resolve({
                    errCode: 1,
                    errMessage: `User's not found!`
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = {};
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters!`
                });
            }
            else {
                let allcode = await db.allcodes.findAll({
                    where: { type: typeInput }
                });
                res.errCode = 0;
                res.data = allcode;
                resolve(res);
            }
        } catch (error) {
            reject();
        }
    })
}


let getDetailUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = {};
            let data = {};
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters!`
                });
            }
            else {
                let user = await db.User.findOne({
                    where: { id: id }
                });
                if (user) {
                    res.user = user;
                    let patientData = await db.Patient.findOne({
                        where: { patientId: user.id }
                    });
                    if (patientData) {
                        res.user.patientData = patientData;
                    }
                }
                res.errCode = 0;
                res.errMessage = 'OK';
                resolve(res);
            }
        } catch (error) {
            reject();
        }
    })
}


let cancelAppointMent = (appointmentId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = {};
            if (!appointmentId) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters!`
                });
            }
            else {
                let appointment = await db.booking.findOne({
                    where: { id: appointmentId },
                    raw: false
                });
                if (appointment) {
                    appointment.statusId = 'S4';
                    await appointment.save();
                }
                res.errCode = 0;
                res.errMessage = 'OK';
                resolve(res);
            }
        } catch (error) {
            reject();
        }
    })
}
module.exports = {
    handleUserLogin: handleUserLogin,
    GetAllUsers: GetAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData,
    getAllCodeService: getAllCodeService,
    getDetailUser: getDetailUser,
    patientEditAccount: patientEditAccount,
    getUsersWithPagination: getUsersWithPagination,
    cancelAppointMent: cancelAppointMent
}