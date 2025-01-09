import { first } from "lodash";
import db from "../models/index"
import emailService from './emailService'
import { v4 as uuidv4 } from 'uuid';
import { where } from "sequelize";

let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/confirm-booking?token=${token}&doctorId=${doctorId}`;
    return result;
}
let createAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.timeType || !data.date_booked_stamp || !data.fullName) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            }
            else {
                let token = uuidv4();

                await emailService.sendSimpleEmail({
                    receiverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: buildUrlEmail(data.doctorId, token)
                })
                // let user = await db.User.findOrCreate({
                //     where: { email: data.email },
                //     defaults: {
                //         email: data.email,
                //         roleId: 'R3',
                //         positionId: 'P10',
                //         gender: data.selectedGender,
                //         address: data.address,
                //         firstName: data.fullName
                //     }
                // });
                // if (user && user[0]) {
                const [demo, created] = await db.booking.findOrCreate({
                    where: { patientId: data.patientId, date_booked_stamp: data.date_booked_stamp, doctorId: data.doctorId },
                    defaults: {
                        statusId: 'S1',
                        patientId: data.patientId,
                        doctorId: data.doctorId,
                        email: data.email,
                        // patientId: user[0].id,
                        birthDay: data.birthDay,
                        timeType: data.timeType,
                        token: token,
                        note: data.note,
                        disease_desc: data.disease_desc,
                        date_booked: data.date_booked,
                        date_booked_stamp: data.date_booked_stamp
                    }
                })
                let schedule = await db.schedules.findOne({
                    where: { timeType: data.timeType, doctorId: data.doctorId, date_time_stamp: data.date_booked_stamp }
                })
                if (schedule) {
                    schedule.currentNumber += 1;
                    // await schedule.save();
                }
                // }
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


let confirmAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!',
                })
            }
            else {
                let appointment = await db.booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })
                if (appointment) {
                    appointment.statusId = 'S2';
                    await appointment.save();
                    resolve({
                        errCode: 0,
                        errMessage: 'Confirm appointment succeed!'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Appointment has been confirmed or not exist!'
                    })
                }
            }
        }
        catch (error) {
            reject(error);
        }
    })
}

let getAppointmentHistory = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!',
                })
            }
            else {
                let appointment = await db.booking.findAll({
                    where: {
                        patientId: userId
                    },
                    order: [
                        ['createdAt', 'DESC']
                    ],
                    include: [
                        { model: db.User, as: 'doctorBookingData', attributes: ['firstName', 'lastName'] },
                        { model: db.allcodes, as: 'timeTypeBooking', attributes: ['value_en', 'value_vi'] },
                        { model: db.allcodes, as: 'statusData', attributes: ['value_en', 'value_vi'] },
                        {
                            model: db.Invoice,
                            include: [
                                { model: db.allcodes, as: 'statusInvoiceData', attributes: ['value_vi', 'value_en'] }
                            ],
                        },
                    ],
                    raw: false,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                    data: appointment
                })
            }
        }
        catch (error) {
            reject(error);
        }
    })
}
module.exports = {
    createAppointment: createAppointment,
    confirmAppointment: confirmAppointment,
    getAppointmentHistory: getAppointmentHistory
}