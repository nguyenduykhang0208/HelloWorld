import { where, transaction } from "sequelize";
import db from "../models/index"
import _ from "lodash"
import { raw } from "body-parser";
require('dotenv').config();
import emailService from "./emailService";

let getDetailInvoice = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters!`
                });
            }
            else {
                let data = await db.Invoice.findOne({
                    where: { id: id },
                    include: [
                        {
                            model: db.detail_invoice, as: 'detailInvoice',
                            include: [
                                { model: db.Medicine, as: 'medicineData', attributes: ['name'] },
                            ],
                        },
                        {
                            model: db.Patient, as: 'patientInvoiceData',
                            include: [
                                { model: db.User, attributes: ['firstName', 'lastName'] },
                            ],

                        },
                        {
                            model: db.Doctor, as: 'doctorInvoiceData',
                            include: [
                                { model: db.User, attributes: ['firstName', 'lastName'] },
                                { model: db.allcodes, as: 'priceData', attributes: ['value_vi', 'value_en'] }
                            ],

                        },
                        {
                            model: db.allcodes, as: 'statusInvoiceData', attributes: ['value_vi', 'value_en']
                        }
                    ],
                    raw: false,
                    nest: true
                });
                if (!data) {
                    data = {};
                }
                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                    data
                })
            }
        }
        catch (error) {
            reject(error);
        }
    })
}



let changeInvoiceStatus = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let invoice = await db.Invoice.findOne({
                where: { id: data.id },
                raw: false
            });
            if (invoice) {
                invoice.status = data.status;
                await invoice.save();
                resolve({
                    errCode: 0,
                    errMessage: 'Update the status succeed!'
                })
            }
            else {
                resolve({
                    errCode: 1,
                    errMessage: `Invoice's not found!`
                });
            }

        } catch (error) {
            reject(error);
        }
    })
}
module.exports = {
    getDetailInvoice: getDetailInvoice,
    changeInvoiceStatus: changeInvoiceStatus
}
