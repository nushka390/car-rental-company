import Express  from "express"
import carRouter from "./car/car.router" 
import CustomerRouter from "./customer/customer.router"
 import insuranceRouter from "./insurance/insurance.router"
 import MaintenanceRouter from"./maintenance/maintenance.router"
 import ReservationRouter from "./reservation table/reservation.router"
 import PaymentRouter from "./payment table/payment.router"
import LocationRouter from "./location table/location.router"

const app = Express();
const PORT = 8085;

app.use(Express.json())

//Routes to our application
 app.use("/api/car",carRouter)
 app.use("/api/customer",CustomerRouter)
 app.use("/api/insurance",insuranceRouter)
 app.use("/api/location",LocationRouter)
 app.use("/api/Maintenance",MaintenanceRouter)
 app.use("/api/Reservation",ReservationRouter)
 app.use("/api/payment",PaymentRouter)
// // carRouter(app)
// //CustomerRouter(app)
// // insuranceRouter(app)
// // LocationRouter(app)
// // MaintenanceRouter(app)
 app.listen(PORT, () => {
    console.log("Server started on http://localhost:${PORT}");
});

