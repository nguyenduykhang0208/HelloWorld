import doctorService from '../services/doctorService'
let getTopDoctor = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10;
    try {
        let doctorList = await doctorService.getTopDoctor(+limit);
        return res.status(200).json(doctorList);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server!'
        });
    }
}

let handleGetAllDoctors = async (req, res) => {
    try {
        let allDoctors = await doctorService.getAllDoctors();
        return res.status(200).json(allDoctors);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server!'
        });
    }
}
let handleGetAllDoctorsWithMore = async (req, res) => {
    try {
        console.log('11111111111-', req.query)
        let allDoctors = await doctorService.getAllDoctorsMore(req.query);

        return res.status(200).json(allDoctors);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server!'
        });
    }
}

let handleSaveDetailDoctor = async (req, res) => {
    try {
        let response = await doctorService.saveDetailDoctor(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server!'
        });
    }
}


let handleGetDetailDoctor = async (req, res) => {
    try {
        let response = await doctorService.getDetailDoctor(req.query.id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server!'
        });
    }
}


let handleCreateSchedule = async (req, res) => {
    try {
        let response = await doctorService.createSchedule(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server!'
        });
    }
}


let handleGetScheduleByDate = async (req, res) => {
    try {
        let response = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date_time_stamp);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server!'
        });
    }
}

let handleGetDoctorBookingInfor = async (req, res) => {
    try {
        let response = await doctorService.getDoctorBookingInfor(req.query.doctorId);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server!'
        });
    }
}


let handleGetDoctorProfile = async (req, res) => {
    try {
        let response = await doctorService.getDoctorProfile(req.query.doctorId);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server!'
        });
    }
}

let handleGetAllPatient = async (req, res) => {
    try {
        let response = await doctorService.getAllPatient(req.query.doctorId, req.query.date, req.query.statusId);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server!'
        });
    }
}


let handleSendBill = async (req, res) => {
    try {
        let response = await doctorService.sendBill(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server!'
        });
    }
}

let handleGetDetailBooking = async (req, res) => {
    try {
        let response = await doctorService.getDetailBooking(req.query.id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server!'
        });
    }
}

let handleCreateInvoice = async (req, res) => {
    try {
        let response = await doctorService.createInvoice(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server!'
        });
    }
}

let handleGetAllInvoiceByDoctor = async (req, res) => {
    try {
        let response = await doctorService.getAllInvoiceByDoctor(req.query.doctorId, req.query.date, req.query.statusId);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server!'
        });
    }
}

module.exports = {
    getTopDoctor: getTopDoctor,
    handleGetAllDoctors: handleGetAllDoctors,
    handleSaveDetailDoctor: handleSaveDetailDoctor,
    handleGetDetailDoctor: handleGetDetailDoctor,
    handleCreateSchedule: handleCreateSchedule,
    handleGetScheduleByDate: handleGetScheduleByDate,
    handleGetDoctorBookingInfor: handleGetDoctorBookingInfor,
    handleGetDoctorProfile: handleGetDoctorProfile,
    handleGetAllPatient: handleGetAllPatient,
    handleSendBill: handleSendBill,
    handleGetAllDoctorsWithMore: handleGetAllDoctorsWithMore,
    handleGetDetailBooking: handleGetDetailBooking,
    handleCreateInvoice: handleCreateInvoice,
    handleGetAllInvoiceByDoctor: handleGetAllInvoiceByDoctor,
}