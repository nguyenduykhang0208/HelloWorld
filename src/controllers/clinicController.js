import clinicService from '../services/clinicService'
let handleCreateClinic = async (req, res) => {
    try {
        let response = await clinicService.createClinic(req.body);
        console.log(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server!'
        });
    }
}
let handleGetAllClinic = async (req, res) => {
    try {
        let response = await clinicService.getAllClinic();
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server!'
        });
    }
}


let handleGetAllClinicPagination = async (req, res) => {
    try {
        let input = req.query; // ALL, id
        if (!input) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters',
                data: []
            })
        }
        if (input.page && input.perPage) {
            let clinics = await clinicService.getAllClinicPagination(input);
            return res.status(200).json({
                errCode: 0,
                errMessage: 'OK',
                data: clinics
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server!'
        });
    }
}

let handleGetDetailClinic = async (req, res) => {
    try {
        let response = await clinicService.getDetailClinic(req.query.id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server!'
        });
    }
}


let handleEditClinic = async (req, res) => {
    try {
        let message = await clinicService.editClinic(req.body);
        return res.status(200).json(message)
    }
    catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server',
        })
    }
}


let handleDeleteClinic = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameters!"
            })
        }
        let message = await clinicService.deleteClinic(req.body.id);
        return res.status(200).json(message);
    }
    catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
module.exports = {
    handleCreateClinic: handleCreateClinic,
    handleGetAllClinic: handleGetAllClinic,
    handleGetDetailClinic: handleGetDetailClinic,
    handleGetAllClinicPagination: handleGetAllClinicPagination,
    handleEditClinic: handleEditClinic,
    handleDeleteClinic: handleDeleteClinic
}