import patientService from '../services/patientService'

let handleCreateAppointment = async (req, res) => {
    try {
        let response = await patientService.createAppointment(req.body);
        console.log(req.body)
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server!'
        });
    }
}


let handleConfirmAppointment = async (req, res) => {
    try {
        let response = await patientService.confirmAppointment(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server!'
        });
    }
}


let handleGetHistoryAppointment = async (req, res) => {
    try {
        let response = await patientService.getAppointmentHistory(req.query.userId);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server!'
        });
    }
}
module.exports = {
    handleCreateAppointment: handleCreateAppointment,
    handleConfirmAppointment: handleConfirmAppointment,
    handleGetHistoryAppointment: handleGetHistoryAppointment
}