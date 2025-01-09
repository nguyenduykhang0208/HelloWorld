
import db from "../models/index"
import { Model, where, Op } from "sequelize";
import CommonUtils from "../Utils/commonUtils";

let createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = {};
            if (!data.name || !data.address || !data.image || !data.descriptionHTML || !data.descriptionMarkDown) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters!`
                });
            }
            else {
                await db.clinics.create({
                    name: data.name,
                    address: data.address,
                    image: data.image,
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

let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.clinics.findAll();
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


let getAllClinicPagination = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let clinics_arr = '';
            let { perPage, page } = data;
            let keyword = data.keyword ? data.keyword : "";
            let tableName = 'clinics';
            const { limit, offset } = CommonUtils.getPagination(+page, +perPage)
            await db.clinics.findAndCountAll({
                limit: limit,
                offset: offset,
                where: {
                    [Op.or]: [
                        { name: { [Op.like]: '%' + keyword + '%' } },
                        { address: { [Op.like]: '%' + keyword + '%' } },
                        { descriptionMarkDown: { [Op.like]: '%' + keyword + '%' } }
                    ]
                }
            }).then(data => {
                clinics_arr = CommonUtils.getPagingData(data, +page, limit, tableName)
            })
            if (clinics_arr?.clinics && clinics_arr?.clinics.length > 0) {
                clinics_arr?.clinics.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item;
                })
            }
            resolve(clinics_arr)
        } catch (error) {
            reject(error);
        }
    })
}


let getDetailClinic = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters!`
                });
            }
            else {
                let data = await db.clinics.findOne({
                    where: { id: id },
                    attributes: ['name', 'image', 'address', 'descriptionHTML', 'descriptionMarkDown']
                });
                if (data) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');

                    let doctorClinic = [];
                    doctorClinic = await db.Doctor.findAll({
                        where: { clinicId: id },
                        attributes: ['doctorId', 'provinceId']
                    })
                    data.doctorClinic = doctorClinic;
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


let editClinic = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.name || !inputData.address || !inputData.descriptionMarkDown) {
                resolve({
                    errCode: 1,
                    message: 'Missing parameter!'
                })
            }
            else {
                let clinic = await db.clinics.findOne({
                    where: { id: inputData.id },
                    raw: false
                })
                console.log('check clinic: ', clinic)
                if (clinic) {
                    clinic.name = inputData.name;
                    clinic.address = inputData.address;
                    clinic.descriptionHTML = inputData.descriptionHTML;
                    clinic.descriptionMarkDown = inputData.descriptionMarkDown;
                    if (inputData.image) {
                        clinic.image = inputData.image;
                    }
                    await clinic.save();
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


let deleteClinic = (clinicId) => {
    return new Promise(async (resolve, reject) => {
        let clinic = await db.clinics.findOne({
            where: { id: clinicId }
        })
        if (!clinic) {
            resolve({
                errCode: 2,
                errMessage: `The clinic isn't exist`
            })
        }

        await db.clinics.destroy({
            where: { id: clinicId }
        });
        resolve({
            errCode: 0,
            message: `The clinic is deleted`
        })
    })
}


module.exports = {
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getDetailClinic: getDetailClinic,
    getAllClinicPagination: getAllClinicPagination,
    editClinic: editClinic,
    deleteClinic: deleteClinic
}
