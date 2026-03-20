require('dotenv').config({ path: '.env.local' });

// Do NOT print secrets to the terminal. Only indicate presence of the URI.
if (process.env.NODE_ENV !== 'production') {
  if (process.env.MONGODB_URI) {
    console.log('[DEBUG] MONGODB_URI is set (value hidden)');
  } else {
    console.log('[WARN] MONGODB_URI is not set');
  }
}

const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

const dbConnect = require("./src/lib/mongodb").default;
const Message = require("./src/models/Message");
const Chat = require("./src/models/Chat");
const Booking = require("./src/models/Booking").default;

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const PORT = process.env.PORT || 3000;

app.prepare().then(async () => {
  // MongoDB connection
  await dbConnect();
  console.log("✅ MongoDB connected");

  // Create HTTP server for Next.js
  const server = createServer((req, res) => {
    handle(req, res);
  });

  // Attach Socket.io
  const io = new Server(server, {
    path: "/api/socket",
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  global.io = io;

  // === SOCKET CONNECTION HANDLER ===
  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

    // Join a chat room
    socket.on("join-chat", (chatId) => {
      if (chatId) {
        socket.join(chatId);
        console.log(`👥 User ${socket.id} joined chat room ${chatId}`);
      }
    });

    // Send a message
    socket.on("send-message", async (msg) => {
      if (msg.chatId && msg.content && msg.sender) {
        try {
          const message = await Message.create({
            chatId: msg.chatId,
            sender: msg.sender,
            content: msg.content.trim(),
          });

          await Chat.findByIdAndUpdate(msg.chatId, {
            lastMessage: message.content,
            updatedAt: new Date(),
          });

          io.to(msg.chatId).emit("new-message", message);
          console.log(`📨 Message saved & broadcasted to chat ${msg.chatId}`);
        } catch (error) {
          console.error("❌ Error saving/sending message:", error);
          socket.emit("error", "Failed to send message");
        }
      }
    });

    // Join user-specific room
    socket.on("join-user-room", (userId) => {
      if (userId) {
        socket.join(`user-${userId}`);
        console.log(`👤 User ${socket.id} joined user room user-${userId}`);
      }
    });

    // New booking notification - populate all needed fields
    socket.on("new-booking-notification", async (data) => {
      try {
        const { bookingId, guideId } = data;
        console.log(`📨 Processing new booking notification: ${bookingId} for guide: ${guideId}`);
        
        const booking = await Booking.findById(bookingId)
          .populate('tourist', 'firstName lastName profileImage email')
          .populate('guide', 'firstName lastName profileImage email');

        if (booking) {
          const notification = {
            type: "new-booking",
            message: `New booking request from ${booking.tourist.firstName} ${booking.tourist.lastName}`,
            booking: booking,
            timestamp: new Date()
          };

          io.to(`user-${guideId}`).emit("booking-notification", notification);
          console.log(`✅ New booking notification sent to guide user-${guideId}`);
        } else {
          console.error(`❌ Booking ${bookingId} not found`);
        }
      } catch (error) {
        console.error("❌ Error sending new booking notification:", error);
      }
    });

    // Booking status update notifications
    socket.on("booking-status-update", async (data) => {
      try {
        const { bookingId, status, guideId, touristId } = data;
        console.log(`📨 Processing booking status update: ${bookingId} -> ${status}`);
        
        const booking = await Booking.findById(bookingId)
          .populate('tourist', 'firstName lastName profileImage email')
          .populate('guide', 'firstName lastName profileImage email');

        if (!booking) {
          console.error(`❌ Booking ${bookingId} not found for status update`);
          return;
        }

        let notifications = [];

        switch (status) {
          case "confirmed":
            notifications.push({
              userId: touristId,
              message: `Your booking with ${booking.guide.firstName} ${booking.guide.lastName} has been confirmed!`,
              type: "booking-confirmed"
            });
            break;

          case "declined":
            notifications.push({
              userId: touristId,
              message: `Your booking request was declined by ${booking.guide.firstName} ${booking.guide.lastName}`,
              type: "booking-declined"
            });
            break;

          case "completed":
            notifications.push({
              userId: touristId,
              message: `${booking.guide.firstName} ${booking.guide.lastName} marked your tour as completed`,
              type: "booking-completed"
            });
            break;

          case "cancelled":
            // Notify both guide and tourist
            notifications.push({
              userId: guideId,
              message: `Booking with ${booking.tourist.firstName} ${booking.tourist.lastName} was cancelled`,
              type: "booking-cancelled"
            });
            notifications.push({
              userId: touristId,
              message: `Your booking with ${booking.guide.firstName} ${booking.guide.lastName} was cancelled`,
              type: "booking-cancelled"
            });
            break;

          // Payment notifications
          case "advance-paid":
            notifications.push({
              userId: guideId,
              message: `${booking.tourist.firstName} ${booking.tourist.lastName} paid an advance of $${booking.advanceAmount || (booking.totalCost * 0.2)}`,
              type: "payment-received"
            });
            break;

          case "remaining-paid":
            const remaining = booking.totalCost - (booking.advanceAmount || 0);
            notifications.push({
              userId: guideId,
              message: `${booking.tourist.firstName} ${booking.tourist.lastName} paid the remaining balance of $${remaining.toFixed(2)}`,
              type: "payment-completed"
            });
            break;

          default:
            console.log(`⚠️ Unknown status: ${status}`);
            return;
        }

        // Send notifications
        notifications.forEach(notification => {
          const payload = {
            type: notification.type,
            message: notification.message,
            booking: booking,
            timestamp: new Date()
          };

          io.to(`user-${notification.userId}`).emit("booking-notification", payload);
          console.log(`✅ Notification sent to user-${notification.userId}: ${notification.message}`);
        });

      } catch (error) {
        console.error("❌ Error sending booking status update:", error);
      }
    });

    // Booking reminder with better date handling
    socket.on("booking-reminder", async (data) => {
      try {
        const { bookingId } = data;
        const booking = await Booking.findById(bookingId)
          .populate('tourist', 'firstName lastName profileImage email')
          .populate('guide', 'firstName lastName profileImage email');

        if (booking && booking.status === 'confirmed') {
          const tourDate = new Date(booking.date);
          const today = new Date();
          const daysUntilTour = Math.ceil((tourDate - today) / (1000 * 60 * 60 * 24));

          if (daysUntilTour === 1) {
            // Notify tourist
            io.to(`user-${booking.tourist._id}`).emit("booking-notification", {
              type: "tour-reminder",
              message: `Your tour with ${booking.guide.firstName} ${booking.guide.lastName} is tomorrow!`,
              booking,
              timestamp: new Date()
            });

            // Notify guide
            io.to(`user-${booking.guide._id}`).emit("booking-notification", {
              type: "tour-reminder",
              message: `You have a tour with ${booking.tourist.firstName} ${booking.tourist.lastName} tomorrow!`,
              booking,
              timestamp: new Date()
            });

            console.log(`⏰ Tour reminders sent for booking ${bookingId}`);
          }
        }
      } catch (error) {
        console.error("❌ Error sending booking reminder:", error);
      }
    });

    // Handle connection errors
    socket.on("error", (error) => {
      console.error("❌ Socket error:", error);
    });

    // Disconnect
    socket.on("disconnect", (reason) => {
      console.log(`❌ User disconnected: ${socket.id}, reason: ${reason}`);
    });

    // Listen for new reviews submitted by tourists
    socket.on("new-review", (data) => {
      const { guideId, review } = data;

      if (!guideId || !review) {
        console.error("Invalid new-review payload", data);
        return;
      }

      // Emit the new review event to the guide's room
      io.to(`user-${guideId}`).emit("new-review", review);
      console.log(`✅ New review sent to guide user-${guideId}`);
    });


  });

  // Global error handler
  io.engine.on("connection_error", (err) => {
    console.error("❌ Socket.IO connection error:", err);
  });

  // Start the server
  server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`🔌 Socket.IO available at ws://localhost:${PORT}/api/socket`);
  });
});