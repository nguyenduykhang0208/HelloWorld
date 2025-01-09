class CommonUtils {
    static getPagination = (page, perPage) => {
        const limit = perPage ? perPage : 5;
        const offset = page ? (page - 1) * limit : 0;
        return { limit, offset };
    }

    static getPagingData = (data, page, perPage, tableName) => {
        const { count: totalItems, rows } = data;
        const totalPages = Math.ceil(totalItems / perPage)
        const currentPage = page ? +page : 1
        // let tableName = rows
        const result = { totalPages, totalItems, currentPage, perPage }
        result[tableName] = rows
        return result;
    }
}

export default CommonUtils;