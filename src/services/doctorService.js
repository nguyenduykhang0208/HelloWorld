import { where, transaction, Op } from "sequelize";
import db from "../models/index"
import _ from "lodash"
import { raw } from "body-parser";
require('dotenv').config();
import emailService from "./emailService";
import moment from "moment";
import CommonUtils from "../Utils/commonUtils";
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;
let getTopDoctor = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                limit: limit,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.allcodes, as: 'positionData', attributes: ['value_en', 'value_vi'] },
                    { model: db.allcodes, as: 'genderData', attributes: ['value_en', 'value_vi'] },
                ],
                nest: true,
                raw: true
            })

            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (error) {
            reject(error);
        }
    })
}

let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password', 'image']
                }
            })

            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (error) {
            reject(error);
        }
    })
}


let getAllDoctorsMore = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { page, perPage, keyToSearch, positionId, provinceId } = data;
            const { limit, offset } = CommonUtils.getPagination(+page, +perPage)

            let doctor_arr = '';
            let keyword = keyToSearch ? keyToSearch.trim() : "";
            let tableName = 'doctors';
            await db.User.findAndCountAll({
                limit: limit,
                offset: offset,
                where: {
                    roleId: 'R2',
                    ...(positionId !== 'ALL' && { positionId: positionId })
                    ,
                    [Op.or]: [
                        db.sequelize.literal(`LOWER(CONCAT(firstName,lastName)) LIKE LOWER('%${keyword}%')`)
                    ],
                },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.allcodes, as: 'positionData', attributes: ['value_en', 'value_vi'] },
                    { model: db.allcodes, as: 'genderData', attributes: ['value_en', 'value_vi'] },
                    {
                        model: db.Doctor, attributes: ['doctorId', 'specialtyId', 'clinicId', 'description'],
                        where: {
                            [Op.or]: [
                                { description: { [Op.like]: '%' + keyword + '%' } }
                            ],
                            ...(provinceId !== 'ALL' && { provinceId: provinceId })
                        },
                        include: [
                            { model: db.specialty, as: 'specialtyData', attributes: ['name'] },
                            { model: db.clinics, as: 'clinicData', attributes: ['name'] },
                        ]
                    },
                ],
                raw: false,
                nest: true
            }).then(data => {
                doctor_arr = CommonUtils.getPagingData(data, +page, limit, tableName)
            })
            if (doctor_arr.doctors && doctor_arr.doctors.length > 0) {
                doctor_arr.doctors.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item;
                })
            }

            resolve({
                errCode: 0,
                data: doctor_arr
            })
        } catch (error) {
            reject(error);
        }
    })
}

let checkValidateData = (data) => {
    let isValid = true;
    let dataField = ['doctorId', 'html_content', 'markdown_content',
        'selectedPrice', 'selectedPayment', 'selectedProvince', 'note', 'specialtyId',
        'clinicId'
    ]
    let element = '';
    for (let i = 0; i < dataField.length; i++) {
        if (!data[dataField[i]]) {
            isValid = false;
            element = dataField[i];
            break;
        }
    }
    return {
        isValid: isValid,
        element: element
    }
}

let saveDetailDoctor = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = checkValidateData(data);
            if (check.isValid === false) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters: ${check.element}`
                })
            }
            else {
                if (data.action === 'EDIT') {
                    let doctorInfor = await db.Doctor.findOne({
                        where: { doctorId: data.doctorId },
                        raw: false
                    })
                    if (doctorInfor) {
                        doctorInfor.priceId = data.selectedPrice;
                        doctorInfor.provinceId = data.selectedProvince;
                        doctorInfor.paymentId = data.selectedPayment;
                        doctorInfor.clinicId = data.clinicId;
                        // doctorInfor.addressClinic = data.addressClinic;
                        // doctorInfor.nameClinic = data.nameClinic;
                        doctorInfor.html_content = data.html_content;
                        doctorInfor.markdown_content = data.markdown_content;
                        doctorInfor.description = data.description;
                        doctorInfor.note = data.note;
                        doctorInfor.specialtyId = data.specialtyId;
                        await doctorInfor.save();
                    }
                }
                else {
                    await db.Doctor.create({
                        doctorId: data.doctorId,
                        clinicId: data.clinicId,
                        priceId: data.selectedPrice,
                        provinceId: data.selectedProvince,
                        paymentId: data.selectedPayment,
                        html_content: data.html_content,
                        markdown_content: data.markdown_content,
                        description: data.description,
                        note: data.note,
                        specialtyId: data.specialtyId
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save info succeed!'
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getDetailDoctor = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            }
            else {
                let data = await db.User.findOne({
                    where: { id: id, roleId: 'R2' },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.allcodes, as: 'positionData', attributes: ['value_en', 'value_vi'] },
                        {
                            model: db.Doctor, attributes: { exclude: ['id', 'doctorId'] },
                            include:
                                [
                                    { model: db.allcodes, as: 'priceData', attributes: ['value_en', 'value_vi'] },
                                    { model: db.allcodes, as: 'provinceData', attributes: ['value_en', 'value_vi'] },
                                    { model: db.allcodes, as: 'paymentData', attributes: ['value_en', 'value_vi'] }
                                ]
                        }
                    ],
                    nest: true,
                    raw: false
                })
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }
                if (!data) {
                    data = {};
                }
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}


let createSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.schedules || !data.doctorId || !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            } else {
                let schedules = data.schedules;
                if (schedules && schedules.length > 0) {
                    schedules = schedules.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        item.currentNumber = 0;
                        return item;
                    })
                    //check if exists
                    let exist_schedule = await db.schedules.findAll({
                        where: { doctorId: data.doctorId, date_time_stamp: data.date_time_stamp },
                        attributes: ['date', 'doctorId', 'timeType', 'maxNumber', 'date_time_stamp']
                    })

                    let not_exist_schedule = _.differenceWith(schedules, exist_schedule, (a, b) => {
                        return a.timeType === b.timeType && a.date_time_stamp === +b.date_time_stamp
                    });
                    if (not_exist_schedule && not_exist_schedule.length > 0) {
                        await db.schedules.bulkCreate(not_exist_schedule);
                    }
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Create schedule succeed!'
                })
            }
        }
        catch (error) {
            reject(error);
        }
    })
}


let getScheduleByDate = (doctorId, date_time_stamp) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date_time_stamp) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            } else {
                let schedule = await db.schedules.findAll({
                    where: { doctorId: doctorId, date_time_stamp: date_time_stamp, currentNumber: { [Op.lt]: MAX_NUMBER_SCHEDULE } },
                    include: [
                        { model: db.allcodes, as: 'timeTypeData', attributes: ['value_en', 'value_vi'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] }
                    ],
                    nest: true,
                    raw: false
                })

                let dateNow = new Date();
                let currentDate = moment(dateNow).format('DD/MM/YYYY')
                let currentHour = `${dateNow.getHours()}:${dateNow.getMinutes()}`;
                let timeNow = moment(`${currentDate} ${currentHour}`, "DD/MM/YYYY hh:mm").toDate();
                console.log('check timenow: ', timeNow);


                schedule.forEach((sch, index) => {
                    let startTime = sch?.timeTypeData?.value_vi.split('-')[0];
                    let get_sch_time = moment(sch.date, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY');

                    let timeSchedule = moment(`${get_sch_time} ${startTime}`, "DD/MM/YYYY hh:mm").toDate();
                    //isDisable nếu time hiện tại > time kế hoạch
                    sch.setDataValue('isDisable', timeNow > timeSchedule);

                });
                if (!schedule) schedule = [];
                resolve({
                    errCode: 0,
                    data: schedule
                })
            }
        }
        catch (error) {
            reject(error);
        }
    })
}


let getDoctorBookingInfor = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            }
            else {
                let data = await db.Doctor.findOne({
                    where: { doctorId: doctorId },
                    attributes: { exclude: ['id', 'doctorId'] },
                    include:
                        [
                            { model: db.allcodes, as: 'priceData', attributes: ['value_en', 'value_vi'] },
                            { model: db.allcodes, as: 'provinceData', attributes: ['value_en', 'value_vi'] },
                            { model: db.allcodes, as: 'paymentData', attributes: ['value_en', 'value_vi'] }
                        ],
                    raw: false,
                    nest: true
                })
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        }
        catch (error) {
            reject(error);
        }
    })
}


let getDoctorProfile = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            }
            else {
                let data = await db.User.findOne({
                    where: { id: doctorId, roleId: 'R2' },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.allcodes, as: 'positionData', attributes: ['value_en', 'value_vi'] },
                        {
                            model: db.Doctor, attributes: { exclude: ['id', 'doctorId'] },
                            include:
                                [
                                    { model: db.allcodes, as: 'priceData', attributes: ['value_en', 'value_vi'] },
                                    { model: db.allcodes, as: 'provinceData', attributes: ['value_en', 'value_vi'] },
                                    { model: db.allcodes, as: 'paymentData', attributes: ['value_en', 'value_vi'] }
                                ]
                        }
                    ],
                    nest: true,
                    raw: false
                })
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }
                if (!data) {
                    data = {};
                }
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        }
        catch (error) {
            reject(error);
        }
    })
}


let getAllPatient = (doctorId, date, statusId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            }
            else {
                let data = await db.booking.findAll({
                    where: { doctorId: doctorId, statusId: statusId, date_booked_stamp: date },
                    include: [
                        {
                            model: db.User, as: 'patientData',
                            attributes: ['firstName', 'lastName', 'email', 'address', 'gender'],
                            include: [
                                { model: db.allcodes, as: 'genderData', attributes: ['value_en', 'value_vi'] },
                            ],

                        },
                        { model: db.allcodes, as: 'timeTypeBooking', attributes: ['value_en', 'value_vi'] },
                        {
                            model: db.Doctor, as: 'doctorInfoData',
                            include: [
                                { model: db.allcodes, as: 'priceData', attributes: ['value_en', 'value_vi'] },
                                { model: db.User, attributes: ['firstName', 'lastName'] },
                            ]
                        }

                    ],
                    raw: false,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        }
        catch (error) {
            reject(error);
        }
    })
}


let getDetailBooking = (bookingId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!bookingId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            }
            else {
                let data = await db.booking.findOne({
                    where: { id: bookingId },
                    include: [
                        {
                            model: db.User, as: 'patientData',
                            attributes: ['firstName', 'lastName', 'email', 'address', 'gender'],
                            include: [
                                { model: db.allcodes, as: 'genderData', attributes: ['value_en', 'value_vi'] },
                            ],

                        },
                        { model: db.allcodes, as: 'timeTypeBooking', attributes: ['value_en', 'value_vi'] },
                        {
                            model: db.Doctor, as: 'doctorInfoData',
                            include: [
                                { model: db.allcodes, as: 'priceData', attributes: ['value_en', 'value_vi'] },
                                { model: db.User, attributes: ['firstName', 'lastName'] },
                            ]
                        }

                    ],
                    raw: false,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        }
        catch (error) {
            reject(error);
        }
    })
}

let sendBill = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.patientId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            }
            else {
                let appointment = await db.booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        statusId: 'S2',
                        timeType: data.timeType
                    },
                    raw: false
                })
                if (appointment) {
                    appointment.statusId = 'S3';
                    await appointment.save();
                }
                //   await emailService.sendAttachment(data);
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
let createInvoice = (data) => {
    return new Promise(async (resolve, reject) => {
        const t = await db.sequelize.transaction(); // Bắt đầu transaction
        try {
            // Kiểm tra tham số bắt buộc
            if (!data.patientId || !data.doctorId || !data.bookingId || !data.price || !data.status || !data.list_medicines) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                });
            } else {
                // Tạo invoice
                let newInvoice = await db.Invoice.create({
                    patientId: data.patientId,
                    doctorId: data.doctorId,
                    bookingId: data.bookingId,
                    price: data.price,
                    date_stamp_created: data.date_stamp_created,
                    status: data.status,
                    note: data.note
                }, { transaction: t });

                await db.booking.update(
                    { statusId: 'S3' },
                    { where: { id: data.bookingId }, transaction: t }
                );
                let doctor = await db.Doctor.findOne({
                    where: { doctorId: data.doctorId },
                    raw: false
                })

                doctor.count += 1;
                await doctor.save();
                // Duyệt qua danh sách thuốc
                if (Array.isArray(data.list_medicines) && data.list_medicines.length > 0) {
                    for (let item of data.list_medicines) {
                        let medicine = await db.Medicine.findOne({
                            where: { id: item.id },
                            transaction: t
                        });

                        if (!medicine) {
                            throw new Error(`Medicine with id ${item.id} not found`);
                        }

                        // Kiểm tra nếu số lượng thuốc đủ để bán
                        if (medicine.quantity < item.add_quantity) {
                            throw new Error(`Not enough quantity for medicine ${medicine.name}`);
                        }

                        // Tạo detail_invoice
                        await db.detail_invoice.create({
                            invoiceId: newInvoice.id,
                            medicineId: item.id,
                            quantity: item.add_quantity,
                            price: item.price
                        }, { transaction: t });

                        // Cập nhật số lượng thuốc
                        await db.Medicine.update(
                            { quantity: medicine.quantity - item.add_quantity },
                            { where: { id: item.id }, transaction: t }
                        );
                    }
                }

                // Commit transaction nếu thành công
                await t.commit();
                resolve({
                    errCode: 0,
                    errMessage: 'Create invoice successfully!'
                });
            }
        } catch (error) {
            // Rollback transaction nếu có lỗi
            await t.rollback();
            reject(error);
        }
    });
};


let getAllInvoiceByDoctor = (doctorId, date, statusId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let invoices = await db.Invoice.findAll({
                where: { doctorId: doctorId, status: statusId, date_stamp_created: date },
                order: [['createdAt', 'DESC']],
                include: [
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
                        ],

                    },
                    {
                        model: db.allcodes, as: 'statusInvoiceData', attributes: ['value_vi', 'value_en']
                    }
                ],
                raw: false,
                nest: true
            })
            resolve({
                errCode: 0,
                data: invoices
            })
        } catch (error) {
            reject(error);
        }
    })
}



module.exports = {
    getTopDoctor: getTopDoctor,
    getAllDoctors: getAllDoctors,
    saveDetailDoctor: saveDetailDoctor,
    getDetailDoctor: getDetailDoctor,
    createSchedule: createSchedule,
    getScheduleByDate: getScheduleByDate,
    getDoctorBookingInfor: getDoctorBookingInfor,
    getDoctorProfile: getDoctorProfile,
    getAllPatient: getAllPatient,
    sendBill: sendBill,
    getAllDoctorsMore: getAllDoctorsMore,
    getDetailBooking: getDetailBooking,
    createInvoice: createInvoice,
    getAllInvoiceByDoctor: getAllInvoiceByDoctor,
}