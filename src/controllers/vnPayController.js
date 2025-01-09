import vnPayService from '../services/vnPayService'

const createPaymentUrl = (req, res) => {
    try {
        let ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        let vnpUrl = vnPayService.createPaymentUrl(req.body, ipAddr);

        res.status(200).json({
            errCode: 0,
            message: 'Create payment URL successfully!',
            data: vnpUrl
        });
    } catch (error) {
        res.status(500).json({
            errCode: 1,
            message: 'Error creating payment URL!',
            error: error.message
        });
    }
};

const vnpayReturn = (req, res) => {
    try {
        let isVerified = vnPayService.verifyPayment(req.query);

        if (isVerified) {
            res.status(200).json({
                errCode: 0,
                message: 'Payment verified successfully!',
                data: req.query
            });
        } else {
            res.status(200).json({
                errCode: 1,
                message: 'Payment verification failed!'
            });
        }
    } catch (error) {
        res.status(500).json({
            errCode: 1,
            message: 'Error verifying payment!',
            error: error.message
        });
    }
};

module.exports = {
    createPaymentUrl,
    vnpayReturn
};
