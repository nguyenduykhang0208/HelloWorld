import newsService from '../services/newsService'
let handleCreateNews = async (req, res) => {
    try {
        let response = await newsService.createNews(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server!'
        });
    }
}

let handleGetAllNews = async (req, res) => {
    // try {
    let inputData = req.query; // ALL, id
    if (!inputData) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters',
            data: []
        })
    }
    if (inputData.page && inputData.perPage) {
        let newsData = await newsService.getNewsWithPagination(inputData);
        return res.status(200).json({
            errCode: 0,
            errMessage: 'OK',
            data: newsData
        })
    }
    else {
        let news = await newsService.getAllNews(inputData.id);
        return res.status(200).json({
            errCode: 0,
            errMessage: 'OK',
            data: news
        })
    }
    // } catch (e) {
    //     return res.status(200).json({
    //         errCode: -1,
    //         errMessage: 'Error from the server',
    //     })
    // }
}


let handleEditPost = async (req, res) => {
    try {
        let message = await newsService.saveDetailPostService(req.body);
        return res.status(200).json(message)
    }
    catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server',
        })
    }
}

let handleDeletePost = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameters!"
            })
        }
        console.log('check id : ', req.body)
        let message = await newsService.deletePost(req.body.id);
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
    handleCreateNews: handleCreateNews,
    handleGetAllNews: handleGetAllNews,
    handleEditPost: handleEditPost,
    handleDeletePost: handleDeletePost
}