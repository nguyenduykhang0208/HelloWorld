import db from "../models/index"
import CRUDservice from "../services/CRUDservice"
let getHomePage = (req, res) => {
    return res.render('homePage.ejs')
}

let getAboutPage = (req, res) => {
    return res.render('aboutPage.ejs')
}

let getAllUser = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render('homePage.ejs', { data: JSON.stringify(data) })
    }
    catch (e) {
        console.log(e);
    }
}

let getCRUD = (req, res) => {
    res.render('crud.ejs')
}

let postCRUD = async (req, res) => {
    let msg = await CRUDservice.createNewUser(req.body);
    return res.send('return post crud');
}

let displayCRUD = async (req, res) => {
    let usersData = await CRUDservice.getAllUser();
    return res.render('displayCRUD.ejs', { data: usersData });
}

let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        let userData = await CRUDservice.getUserInfoById(userId);
        if (userData)
            return res.render('editCRUD.ejs', { user: userData });
    }
    else {
        return res.send('User not found!');
    }
}

let putCRUD = async (req, res) => {
    let data = req.body;
    if (data) {
        let message = await CRUDservice.updateUserData(data);
        if (message)
            return res.redirect('/get-crud');
    }
    else {
        return res.send('Update fail!');
    }
}

let deleteCRUD = async (req, res) => {
    let id = req.query.id;
    if (id) {
        await CRUDservice.deleteUserById(id);
        return res.redirect('/get-crud')
    }
    else {
        return res.send('User not found!')
    }
}


module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getAllUser: getAllUser,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayCRUD: displayCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD
}