import medicineService from '../services/medicineService'
let handleCreateMedicine = async (req, res) => {
    try {
        let response = await medicineService.createMedicine(req.body);
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

let handleGetAllMedicine = async (req, res) => {
    try {
        let response = await medicineService.getAllMedicine();
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server!'
        });
    }
}


let handleGetAllMedicinePagination = async (req, res) => {
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
            let medicines = await medicineService.getAllMedicinePagination(input);
            return res.status(200).json({
                errCode: 0,
                errMessage: 'OK',
                data: medicines
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

let handleGetDetailMedicine = async (req, res) => {
    try {
        let response = await medicineService.getDetailMedicine(req.query.id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server!'
        });
    }
}


let handleEditMedicine = async (req, res) => {
    try {
        let message = await medicineService.editMedicine(req.body);
        return res.status(200).json(message)
    }
    catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server',
        })
    }
}


let handleDeleteMedicine = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameters!"
            })
        }
        let message = await medicineService.deleteMedicine(req.body.id);
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
    handleCreateMedicine: handleCreateMedicine,
    handleGetAllMedicine: handleGetAllMedicine,
    handleGetAllMedicinePagination: handleGetAllMedicinePagination,
    handleGetDetailMedicine: handleGetDetailMedicine,
    handleEditMedicine: handleEditMedicine,
    handleDeleteMedicine: handleDeleteMedicine
}