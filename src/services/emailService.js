require('dotenv').config();
import nodemailer from 'nodemailer'

let sendSimpleEmail = async (data) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_APP_PWD,
        },
    });

    const info = await transporter.sendMail({
        from: '"HealthCare Booking" <khangnguyen282002@gmail.com>', // sender address
        to: data.receiverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        html: getBodyHTMLEmail(data), // html body
    });
}

let getBodyHTMLEmail = (data) => {
    let result = '';
    if (data.language === 'vi') {
        result = `
            <h3>Xin chào ${data.patientName}</h3>
            <p>Bạn nhận được email này vì đã đặt lịch khám bệnh trên HealthCare</p>
            <p>Thông tin đặt lệnh khám bệnh:</p>
            <div><b>Thời gian: ${data.time}</b></div>
            <div><b>Bác sĩ: ${data.doctorName}</b></div>
           <p>Nếu các thông tin trên là chính xác, vui lòng nhấn vào link bên dưới để xác nhận đặt lịch</p>
           <div>
            <a href=${data.redirectLink} target=_blank>Click here!</a>
           </div>
           <div>Cảm ơn bạn đã lựa chọn sử dụng dịch vụ của chúng tôi!</div>
        `
    }
    if (data.language === 'en') {
        result = `
            <h3>Hello ${data.patientName}</h3>
            <p>You received this email because you scheduled a medical appointment on HealthCare.</p>
            <p>Appointment details:</p>
            <div><b>Time: ${data.time}</b></div>
            <div><b>Doctor: ${data.doctorName}</b></div>
            <p>If the above information is correct, please click the link below to confirm your appointment:</p>
            <div>
            <a href=${data.redirectLink} target=_blank>Click here!</a>
            </div>
            <div>Thank you for choosing our service!</div>
        `
    }
    return result;
}
let getBodyHTMLAttachment = (data) => {
    let result = '';
    if (data.language === 'vi') {
        result = `
            <h3>Xin chào ${data.patientName}</h3>
            <p>Đây là thông tin và các hóa đơn đính kèm sau khám tại HealthCare</p>
           
           <div>Cảm ơn bạn đã lựa chọn sử dụng dịch vụ của chúng tôi!</div>
        `
    }
    if (data.language === 'en') {
        result = `
            <h3>Hello ${data.patientName}</h3>
            <p>Here is the information and attached units after examination at HealthCare</p>
            
            <div>Thank you for choosing our service!</div>
        `
    }
    return result;
}
let sendAttachment = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_APP_PWD,
                },
            });

            const info = await transporter.sendMail({
                from: '"HealthCare Booking" <khangnguyen282002@gmail.com>', // sender address
                to: data.email, // list of receivers
                subject: "Thông tin đặt lịch khám bệnh", // Subject line
                html: getBodyHTMLAttachment(data), // html body,
                attachments: {   // encoded string as an attachment
                    filename: `hd-${data.patientId}-${data.patientName}-${new Date().getTime()}.png`,
                    content: data.image.split('base64,')[1],
                    encoding: 'base64'
                }
            });
            resolve()
        }
        catch (error) {
            reject(error);
        }
    })
}
module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttachment: sendAttachment
}