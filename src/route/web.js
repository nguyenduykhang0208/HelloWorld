import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController"
import patientController from "../controllers/patientController"
import specialtyController from "../controllers/specialtyController";
import clinicController from "../controllers/clinicController";
import newsController from "../controllers/NewsController";
import medicineController from "../controllers/medicineController";
import invoiceController from "../controllers/invoiceController";
import RecommendController from "../controllers/RecommendController";
import vnPayController from "../controllers/vnPayController";
let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getAllUser);
    router.get('/crud', homeController.getCRUD);

    router.post('/post-crud', homeController.postCRUD);
    router.get('/get-crud', homeController.displayCRUD);
    router.get('/edit-crud', homeController.getEditCRUD);
    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);

    router.post('/api/login', userController.handleLogin)

    router.get('/api/get-all-users', userController.handleGetAllUsers)
    router.post('/api/create-new-user', userController.handleCreateNewUser)
    router.get('/api/get-detail-user', userController.handleGetDetailUsers)
    router.post('/api/patient-edit-account', userController.handlePatientEditAccount)
    router.put('/api/edit-user', userController.handleEditUser)
    router.delete('/api/delete-user', userController.handleDeleteUser)
    router.get('/api/allcode', userController.getAllCode);
    router.post('/api/cancel-appointment', userController.handleCancelAppointMent)


    router.post('/api/create-news', newsController.handleCreateNews);
    router.get('/api/get-all-news', newsController.handleGetAllNews);
    router.post('/api/edit-post', newsController.handleEditPost);
    router.post('/api/delete-post', newsController.handleDeletePost);

    router.get('/api/top-doctor', doctorController.getTopDoctor);

    router.get('/api/get-all-doctors', doctorController.handleGetAllDoctors);
    router.get('/api/get-all-doctors-with-more', doctorController.handleGetAllDoctorsWithMore);
    router.get('/api/get-detail-booking', doctorController.handleGetDetailBooking);

    router.post('/api/save-detail-doctor', doctorController.handleSaveDetailDoctor);
    router.get('/api/get-detail-doctor', doctorController.handleGetDetailDoctor);
    router.post('/api/create-schedule', doctorController.handleCreateSchedule);
    router.get('/api/get-doctor-schedule-by-date', doctorController.handleGetScheduleByDate);
    router.get('/api/get-doctor-booking-info', doctorController.handleGetDoctorBookingInfor);
    router.get('/api/get-doctor-profile', doctorController.handleGetDoctorProfile);
    router.get('/api/get-all-patient', doctorController.handleGetAllPatient);
    router.post('/api/send-bill', doctorController.handleSendBill);
    router.post('/api/create-invoice', doctorController.handleCreateInvoice);
    router.get('/api/get-all-invoice-by-doctor', doctorController.handleGetAllInvoiceByDoctor);


    router.post('/api/patient-book-appointment', patientController.handleCreateAppointment);
    router.post('/api/confirm-book-appointment', patientController.handleConfirmAppointment);
    router.get('/api/history-appointment', patientController.handleGetHistoryAppointment);
    router.post('/api/create-specialty', specialtyController.handleCreateSpecialty);
    router.get('/api/get-all-specialty', specialtyController.handleGetAllSpecialty);
    router.get('/api/get-detail-specialty-by-id', specialtyController.handleGetDetailSpecialty);
    router.get('/api/get-all-specialty-pagination', specialtyController.handleGetAllSpecialtyPagination);
    router.post('/api/edit-specialty', specialtyController.handleEditSpecialty);
    router.post('/api/delete-specialty', specialtyController.handleDeleteSpecialty);

    router.post('/api/create-clinic', clinicController.handleCreateClinic);
    router.post('/api/edit-clinic', clinicController.handleEditClinic);
    router.post('/api/delete-clinic', clinicController.handleDeleteClinic);
    router.get('/api/get-all-clinic', clinicController.handleGetAllClinic);
    router.get('/api/get-all-clinic-pagination', clinicController.handleGetAllClinicPagination);
    router.get('/api/get-detail-clinic', clinicController.handleGetDetailClinic);

    router.get('/api/get-recommend-doctor', RecommendController.handleGetDoctors);

    router.post('/api/create-medicine', medicineController.handleCreateMedicine);
    router.get('/api/get-all-medicine', medicineController.handleGetAllMedicine);
    router.get('/api/get-all-medicine-pagination', medicineController.handleGetAllMedicinePagination);
    router.get('/api/get-detail-medicine', medicineController.handleGetDetailMedicine);
    router.post('/api/edit-medicine', medicineController.handleEditMedicine);
    router.post('/api/delete-medicine', medicineController.handleDeleteMedicine);

    router.get('/api/get-detail-invoice', invoiceController.handleGetDetailInvoice);
    router.post('/api/change-invoice-status', invoiceController.handleChangeInvoiceStatus);

    router.post('/create_payment_url', vnPayController.createPaymentUrl);
    router.get('/vnpay_return', vnPayController.vnpayReturn);
    return app.use("/", router);
}

module.exports = initWebRoutes;