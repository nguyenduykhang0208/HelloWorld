const axios = require('axios');
require('dotenv').config();

let handleGetDoctors = async (req, res) => {
    try {
        let doctorId = req.query.doctorId;
        let response = await axios.get(`${process.env.URL_PYTHON}/api?doctorId=${doctorId}`)
        return res.status(200).json({
            errCode: 0,
            errMessage: 'OK',
            data: response.data

        });
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server!'
        });
    }
}
module.exports = {
    handleGetDoctors: handleGetDoctors
}