
import db from "../models/index"
import { Model, where, Op } from "sequelize";
import CommonUtils from "../Utils/commonUtils";
let createMedicine = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.price || !data.expire || !data.production_date || !data.description
                || !data.quantity
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!',
                })
            }
            else {
                await db.Medicine.create({
                    name: data.name,
                    price: data.price,
                    expire: data.expire,
                    production_date: data.production_date,
                    quantity: data.quantity,
                    description: data.description,
                    image: data.image
                })
                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }
        }
        catch (error) {
            reject(error);
        }
    })
}

let getAllMedicine = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Medicine.findAll();
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


let getAllMedicinePagination = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let medicines = '';
            let { perPage, page } = data;
            let keyword = data.keyword ? data.keyword : "";
            let tableName = 'medicines';
            const { limit, offset } = CommonUtils.getPagination(+page, +perPage)
            await db.Medicine.findAndCountAll({
                limit: limit,
                offset: offset,
                where: {
                    [Op.or]: [
                        { name: { [Op.like]: '%' + keyword + '%' } },
                        { description: { [Op.like]: '%' + keyword + '%' } },
                        { price: { [Op.like]: '%' + keyword + '%' } }
                    ]
                }
            }).then(data => {
                medicines = CommonUtils.getPagingData(data, +page, limit, tableName)
            })
            if (medicines && medicines?.medicines?.length > 0) {
                medicines.medicines.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item;
                })
            }
            resolve(medicines)
        } catch (error) {
            reject(error);
        }
    })
}


let getDetailMedicine = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters!`
                });
            }
            else {
                let data = await db.Medicine.findOne({
                    where: { id: id }
                });
                if (data) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');

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


let editMedicine = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.name || !inputData.description || !inputData.price || !inputData.expire || !inputData.production_date || !inputData.quantity) {
                resolve({
                    errCode: 1,
                    message: 'Missing parameter!'
                })
            }
            else {
                let medicine = await db.Medicine.findOne({
                    where: { id: inputData.id },
                    raw: false
                })
                if (medicine) {
                    medicine.name = inputData.name;
                    medicine.price = inputData.price;
                    medicine.expire = inputData.expire;
                    medicine.production_date = inputData.production_date;
                    medicine.quantity = inputData.quantity;
                    if (inputData.image) {
                        medicine.image = inputData.image;
                    }
                    await medicine.save();
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

let deleteMedicine = (medicineId) => {
    return new Promise(async (resolve, reject) => {
        let medicine = await db.Medicine.findOne({
            where: { id: medicineId }
        })
        if (!medicine) {
            resolve({
                errCode: 2,
                errMessage: `The medicine isn't exist`
            })
        }

        await db.Medicine.destroy({
            where: { id: medicineId }
        });
        resolve({
            errCode: 0,
            message: `The medicine is deleted`
        })
    })
}

module.exports = {
    createMedicine: createMedicine,
    getAllMedicine: getAllMedicine,
    getAllMedicinePagination: getAllMedicinePagination,
    getDetailMedicine: getDetailMedicine,
    deleteMedicine: deleteMedicine,
    editMedicine: editMedicine
}