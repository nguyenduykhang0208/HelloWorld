import userService from "../services/userService"
let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter!'
        })
    }
    let userData = await userService.handleUserLogin(email, password);
    console.log('userData', userData);
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        userData: userData.user ? userData.user : {}
    })
}

let handleGetAllUsers = async (req, res) => {
    // let id = req.query.id; //ALL,ID
    // if (!id) {
    //     return res.status(200).json({
    //         errCode: 1,
    //         message: 'Missing required parameters',
    //         users: []
    //     })
    // }
    // let users = await userService.GetAllUsers(id);
    // return res.status(200).json({
    //     errCode: 0,
    //     message: 'OK',
    //     users
    // })
    let input = req.query; // ALL, id
    if (!input) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters',
            data: []
        })
    }
    if (input.page && input.perPage) {
        let users = await userService.getUsersWithPagination(input);
        return res.status(200).json({
            errCode: 0,
            errMessage: 'OK',
            data: users
        })
    }
    else {
        let users = await userService.getAllUsers(input);
        return res.status(200).json({
            errCode: 0,
            errMessage: 'OK',
            data: users
        })
    }
}


let handleGetDetailUsers = async (req, res) => {
    let id = req.query.id; //ALL,ID
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            message: 'Missing required parameters',
            users: []
        })
    }
    let response = await userService.getDetailUser(id);
    return res.status(200).json(response)
}

let handleCreateNewUser = async (req, res) => {
    let message = await userService.createNewUser(req.body);
    return res.status(200).json(message)
}

let handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            message: 'Missing required parameters!'
        })
    }
    let message = await userService.deleteUser(req.body.id);
    return res.status(200).json(message)
}

let handleEditUser = async (req, res) => {
    let data = req.body;
    let message = await userService.updateUserData(data);
    return res.status(200).json(message)
}

let getAllCode = async (req, res) => {
    try {
        let typeInput = req.query.type;
        let data = await userService.getAllCodeService(typeInput);
        return res.status(200).json(data)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server!'
        })
    }
}


let handlePatientEditAccount = async (req, res) => {
    try {
        let data = await userService.patientEditAccount(req.body);
        return res.status(200).json(data)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server!'
        })
    }
}


let handleCancelAppointMent = async (req, res) => {
    try {
        let data = await userService.cancelAppointMent(req.query.id);
        return res.status(200).json(data)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server!'
        })
    }
}
module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    getAllCode: getAllCode,
    handleGetDetailUsers: handleGetDetailUsers,
    handlePatientEditAccount: handlePatientEditAccount,
    handleCancelAppointMent: handleCancelAppointMent
}