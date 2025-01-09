
import specialty from "../models/specialty";
import db from "../models/index"
import { Model, where, Op } from "sequelize";
import CommonUtils from "../Utils/commonUtils";

let createSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = {};
            if (!data.specialty_name || !data.specialty_image || !data.descriptionHTML || !data.descriptionMarkDown) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters!`
                });
            }
            else {
                await db.specialty.create({
                    name: data.specialty_name,
                    image: data.specialty_image,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkDown: data.descriptionMarkDown
                })
                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.specialty.findAll();
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item;
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'OK',
                data
            })

        } catch (error) {
            reject(error);
        }
    })
}


let getDetailSpecialty = (specialtyId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!specialtyId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters!`
                });
            }
            else {
                let data = await db.specialty.findOne({
                    where: { id: specialtyId },
                    attributes: ['name', 'descriptionHTML', 'descriptionMarkDown']
                })
                if (data) {
                    let doctorSpecialty = [];
                    if (location === 'ALL') {
                        doctorSpecialty = await db.Doctor.findAll({
                            where: { specialtyId: specialtyId },
                            attributes: ['doctorId', 'provinceId']
                        })
                    }
                    else {
                        doctorSpecialty = await db.Doctor.findAll({
                            where: {
                                specialtyId: specialtyId
                                , provinceId: location
                            },
                            attributes: ['doctorId', 'provinceId']
                        })
                    }
                    data.doctorSpecialty = doctorSpecialty;
                }
                else {
                    data = {};
                }
                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                    data
                })
            }

        } catch (error) {
            reject(error);
        }
    })
}


let getAllSpecialtyPagination = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let specialties = '';
            let { perPage, page } = data;
            let keyword = data.keyword ? data.keyword : "";
            let tableName = 'specialties';
            const { limit, offset } = CommonUtils.getPagination(+page, +perPage)
            await db.specialty.findAndCountAll({
                limit: limit,
                offset: offset,
                where: {
                    [Op.or]: [
                        { name: { [Op.like]: '%' + keyword + '%' } },
                        { descriptionMarkDown: { [Op.like]: '%' + keyword + '%' } }
                    ]
                }
            }).then(data => {
                specialties = CommonUtils.getPagingData(data, +page, limit, tableName)
            })
            if (specialties && specialties.length > 0) {
                specialties.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item;
                })
            }
            resolve(specialties)
        } catch (error) {
            reject(error);
        }
    })
}


let editSpecialty = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.name || !inputData.descriptionMarkDown) {
                resolve({
                    errCode: 1,
                    message: 'Missing parameter!'
                })
            }
            else {
                let specialty = await db.specialty.findOne({
                    where: { id: inputData.id },
                    raw: false
                })
                if (specialty) {
                    specialty.name = inputData.name;
                    specialty.descriptionHTML = inputData.descriptionHTML;
                    specialty.descriptionMarkDown = inputData.descriptionMarkDown;
                    if (inputData.image) {
                        specialty.image = inputData.image;
                    }
                    await specialty.save();
                }
            }
            resolve({
                errCode: 0,
                message: 'OK'
            })
        }

        catch (e) {
            reject(e);
        }
    })
}


let deleteSpecialty = (specialtyId) => {
    return new Promise(async (resolve, reject) => {
        let clinic = await db.specialty.findOne({
            where: { id: specialtyId }
        })
        if (!clinic) {
            resolve({
                errCode: 2,
                errMessage: `The specialty isn't exist`
            })
        }

        await db.specialty.destroy({
            where: { id: specialtyId }
        });
        resolve({
            errCode: 0,
            message: `The specialty is deleted`
        })
    })
}

module.exports = {
    createSpecialty: createSpecialty,
    getAllSpecialty: getAllSpecialty,
    getDetailSpecialty: getDetailSpecialty,
    getAllSpecialtyPagination: getAllSpecialtyPagination,
    editSpecialty: editSpecialty,
    deleteSpecialty: deleteSpecialty
}
