import Express  from "express"
import carRouter from "./car/car.router" 
import CustomerRouter from "./customer/customer.router"
 import insuranceRouter from "./insurance/insurance.router"
 import MaintenanceRouter from"./maintenance/maintenance.router"
 import ReservationRouter from "./reservation table/reservation.router"
 import PaymentRouter from "./payment table/payment.router"
import LocationRouter from "./location table/location.router"
import BookingRouter from "./booking table/booking.router";
import user from "./auth/auth.router"
import cors from 'cors'

export const app = Express();
const PORT = 8085;

app.use(Express.json())

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true // if using cookies or sessions
}));

//Routes to our application
 app.use("/api/car",carRouter)
 app.use("/api/customer",CustomerRouter)
 app.use("/api/insurance",insuranceRouter)
 app.use("/api/location",LocationRouter)
 app.use("/api/Maintenance",MaintenanceRouter)
 app.use("/api/Reservation",ReservationRouter)
 app.use("/api/payment",PaymentRouter)
 app.use("/api/booking/",BookingRouter)
 app.use("/api/auth", user);


app.get('/api/locations', (req, res) => {
  res.json([
    { id: 1, name: 'Nairobi' },
    { id: 2, name: 'Mombasa' }
  ]);
});

// // carRouter(app)
// //CustomerRouter(app)
// // insuranceRouter(app)
// // LocationRouter(app)
// // MaintenanceRouter(app)
 app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});

