import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { User, Booking, Flight } from './schemas.js';

const app = express();
const PORT = 6001;

// Middleware
app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/FlightBookingMERN', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log(`MongoDB connected & server running at http://localhost:${PORT}`);

  // ================== ROUTES ==================

  // Register
  app.post('/register', async (req, res) => {
    const { username, email, usertype, password } = req.body;
    let approval = 'approved';
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'User already exists' });

      if (usertype === 'flight-operator') approval = 'not-approved';

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, usertype, password: hashedPassword, approval });
      const userCreated = await newUser.save();

      return res.status(201).json(userCreated);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server Error' });
    }
  });

  // Login
  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ message: 'Invalid email or password' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

      return res.json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server Error' });
    }
  });

  // Approve or Reject Operators
  app.post('/approve-operator', async (req, res) => {
    try {
      const user = await User.findById(req.body.id);
      user.approval = 'approved';
      await user.save();
      res.json({ message: 'approved!' });
    } catch (err) {
      res.status(500).json({ message: 'Server Error' });
    }
  });

  app.post('/reject-operator', async (req, res) => {
    try {
      const user = await User.findById(req.body.id);
      user.approval = 'rejected';
      await user.save();
      res.json({ message: 'rejected!' });
    } catch (err) {
      res.status(500).json({ message: 'Server Error' });
    }
  });

  // Fetch Users
  app.get('/fetch-users', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: 'Error occurred' });
    }
  });

  app.get('/fetch-user/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: 'Error occurred' });
    }
  });

  // Add Flight
  app.post('/add-flight', async (req, res) => {
    const { flightName, flightId, origin, destination, departureTime, arrivalTime, basePrice, totalSeats } = req.body;
    try {
      const flight = new Flight({ flightName, flightId, origin, destination, departureTime, arrivalTime, basePrice, totalSeats });
      await flight.save();
      res.json({ message: 'Flight added' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to add flight' });
    }
  });

  // Update Flight
  app.put('/update-flight', async (req, res) => {
    try {
      const flight = await Flight.findById(req.body._id);
      Object.assign(flight, req.body);
      await flight.save();
      res.json({ message: 'Flight updated' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to update flight' });
    }
  });

  // Fetch Flights
  app.get('/fetch-flights', async (req, res) => {
    try {
      const flights = await Flight.find();
      res.json(flights);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch flights' });
    }
  });

  app.get('/fetch-flight/:id', async (req, res) => {
    try {
      const flight = await Flight.findById(req.params.id);
      res.json(flight);
    } catch (err) {
      res.status(500).json({ message: 'Flight not found' });
    }
  });

  // Search Flights
  app.post('/search-flights', async (req, res) => {
    const { origin, destination } = req.body;
    try {
      const flights = await Flight.find({ origin, destination });
      res.json(flights);
    } catch (err) {
      res.status(500).json({ message: 'Search failed' });
    }
  });

  // Book Ticket
  app.post('/book-ticket', async (req, res) => {
    const { user, flight, flightName, flightId, departure, destination, email, mobile, passengers, totalPrice, journeyDate, journeyTime, seatClass } = req.body;
    try {
      const bookings = await Booking.find({ flight, journeyDate, seatClass });
      const numBookedSeats = bookings.reduce((acc, booking) => acc + booking.passengers.length, 0);

      const seatCode = { 'economy': 'E', 'premium-economy': 'P', 'business': 'B', 'first-class': 'A' };
      const coach = seatCode[seatClass];
      let seats = Array.from({ length: passengers.length }, (_, i) => `${coach}-${numBookedSeats + i + 1}`).join(", ");

      const booking = new Booking({ user, flight, flightName, flightId, departure, destination, email, mobile, passengers, totalPrice, journeyDate, journeyTime, seatClass, seats });
      await booking.save();

      res.json({ message: 'Booking successful!' });
    } catch (err) {
      res.status(500).json({ message: 'Booking failed' });
    }
  });

  // Cancel Booking
  app.put('/cancel-ticket/:id', async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);
      booking.bookingStatus = 'cancelled';
      await booking.save();
      res.json({ message: 'Booking cancelled' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to cancel' });
    }
  });

  // Fetch Bookings
  app.get('/fetch-bookings', async (req, res) => {
    try {
      const bookings = await Booking.find();
      res.json(bookings);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch bookings' });
    }
  });

  // Start server
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });

})
.catch(err => console.error(`❌ DB Connection Error: ${err}`));
