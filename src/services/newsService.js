
import db from "../models/index"
import { Model, where, Op } from "sequelize";
import CommonUtils from "../Utils/commonUtils";
import e from "express";
let createNews = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = {};
            if (!data.userId || !data.description || !data.image || !data.html_content || !data.markdown_content || !data.title) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters!`
                });
            }
            else {
                await db.News.create({
                    userId: data.userId,
                    title: data.title,
                    image: data.image,
                    html_content: data.html_content,
                    markdown_content: data.markdown_content,
                    description: data.description
                })
                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}


let getAllNews = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let news = '';
            let newsId = data;
            if (newsId == 'ALL') {
                news = await db.News.findAll({
                    order: [['createdAt', 'DESC']]
                });
            }
            if (newsId && newsId !== 'ALL') {
                news = await db.News.findOne({
                    where: { id: newsId }
                })
            }
            resolve(news)
        }
        catch (e) {
            reject(e);
        }
    })
}


let getNewsWithPagination = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.perPage || !data.page) {
                resolve({
                    errCode: 1,
                    message: 'Missing parameter!'
                })
            }
            let list_news = '';
            let { perPage, page } = data;
            let keyword = data.keyword ? data.keyword : "";
            let tableName = 'news';
            const { limit, offset } = CommonUtils.getPagination(+page, +perPage)
            await db.News.findAndCountAll({
                limit: limit,
                offset: offset,
                where: {
                    [Op.or]: [
                        { title: { [Op.like]: '%' + keyword + '%' } },
                        { description: { [Op.like]: '%' + keyword + '%' } },
                        { markdown_content: { [Op.like]: '%' + keyword + '%' } }
                    ]
                }
            }).then(data => {
                list_news = CommonUtils.getPagingData(data, +page, limit, tableName)
            })
            if (list_news?.news && list_news?.news?.length > 0) {
                list_news.news.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item;
                })
            }
            resolve(list_news)
        }
        catch (e) {
            reject(e);
        }
    })
}

let saveDetailPostService = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.title || !inputData.html_content || !inputData.markdown_content || !inputData.description) {
                resolve({
                    errCode: 1,
                    message: 'Missing parameter!'
                })
            }
            else {
                let news = await db.News.findOne({
                    where: { id: inputData.id },
                    raw: false
                })
                if (news) {
                    news.html_content = inputData.html_content;
                    news.markdown_content = inputData.markdown_content;
                    news.description = inputData.description;
                    news.userId = inputData.userId;
                    news.title = inputData.title;
                    if (inputData.image) {
                        news.image = inputData.image;
                    }
                    await news.save();
                }
            }
            resolve({
                errCode: 0,
                message: 'OK'
            })
        }

        catch (e) {
            reject(e);
        }
    })
}


let deletePost = (newsId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let news = await db.News.findOne({
                where: { id: newsId }
            })
            if (!news) {
                resolve({
                    errCode: 2,
                    errMessage: `The post isn't exist`
                })
            }

            await db.News.destroy({
                where: { id: newsId }
            });
            resolve({
                errCode: 0,
                message: `The post is deleted`
            })
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    createNews: createNews,
    saveDetailPostService: saveDetailPostService,
    deletePost: deletePost,
    getAllNews: getAllNews,
    getNewsWithPagination: getNewsWithPagination
}