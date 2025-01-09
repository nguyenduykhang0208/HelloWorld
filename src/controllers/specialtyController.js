import specialtyService from '../services/specialtyService'
let handleCreateSpecialty = async (req, res) => {
    try {
        let response = await specialtyService.createSpecialty(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server!'
        });
    }
}
let handleGetAllSpecialty = async (req, res) => {
    try {
        let response = await specialtyService.getAllSpecialty();
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server!'
        });
    }
}

let handleGetDetailSpecialty = async (req, res) => {
    try {
        let response = await specialtyService.getDetailSpecialty(req.query.id, req.query.location);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server!'
        });
    }
}


let handleGetAllSpecialtyPagination = async (req, res) => {
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
            let specialties = await specialtyService.getAllSpecialtyPagination(input);
            return res.status(200).json({
                errCode: 0,
                errMessage: 'OK',
                data: specialties
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


let handleEditSpecialty = async (req, res) => {
    try {
        let message = await specialtyService.editSpecialty(req.body);
        return res.status(200).json(message)
    }
    catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server',
        })
    }
}


let handleDeleteSpecialty = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameters!"
            })
        }
        let message = await specialtyService.deleteSpecialty(req.body.id);
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
    handleCreateSpecialty: handleCreateSpecialty,
    handleGetAllSpecialty: handleGetAllSpecialty,
    handleGetDetailSpecialty: handleGetDetailSpecialty,
    handleGetAllSpecialtyPagination: handleGetAllSpecialtyPagination,
    handleEditSpecialty: handleEditSpecialty,
    handleDeleteSpecialty: handleDeleteSpecialty
}