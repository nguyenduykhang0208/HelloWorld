import invoiceService from '../services/invoiceService'

let handleGetDetailInvoice = async (req, res) => {
    try {
        let response = await invoiceService.getDetailInvoice(req.query.id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server!'
        });
    }
}


let handleChangeInvoiceStatus = async (req, res) => {
    try {
        let response = await invoiceService.changeInvoiceStatus(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server!'
        });
    }
}
module.exports = {
    handleGetDetailInvoice: handleGetDetailInvoice,
    handleChangeInvoiceStatus: handleChangeInvoiceStatus
}