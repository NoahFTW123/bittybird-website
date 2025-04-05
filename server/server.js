const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const { db } = require("./firebaseConfig");
const { SquareClient, SquareEnvironment } = require("square");

require("dotenv").config();

const app = express();
const PORT = 5001;

const allowedOrigins = [
  "https://www.bittybird.co",
  "http://localhost:3000",
  "http://localhost:5174",
];

app.use(express.json());

app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
);

app.post("/create", async (req, res) => {
  const { sourceId, amount, currency } = req.body;

  try {
    const idempotencyKey = crypto.randomUUID();

    if (!sourceId || !amount || amount <= 0) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid payment details" });
    }

    const response = await fetch(
      "https://connect.squareupsandbox.com/v2/payments",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
          "Square-Version": "2025-01-15",
        },
        body: JSON.stringify({
          idempotency_key: idempotencyKey, // Prevents duplicate transactions
          source_id: sourceId,
          amount_money: {
            amount: Math.round(amount), // Ensure amount is in cents
            currency: currency || "USD",
          },
          autocomplete: true,
        }),
      }
    );
    const requestBody = {
      idempotency_key: idempotencyKey,
      source_id: sourceId,
      amount_money: {
        amount: Math.round(amount),
        currency: currency || "USD",
      },
      autocomplete: true,
    };

    const data = await response.json();
    console.log("Square API Response:", data);

    if (response.ok) {
      res.json({ success: true, payment: data.payment });
    } else {
      console.error("Square Payment Failed:", data);
      res
        .status(500)
        .json({ success: false, error: data.errors || "Payment failed" });
    }
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .send({ error: "Name, email and a message are required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.OWNER_EMAIL,
      subject: "New Contact Form Message",
      text: `From: ${name}\n${email}\n\nMessage:\n${message}`,
    };

    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ success: true, message: "Message sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(400).send({ error: error.message });
  }
});

app.post("/send-order-email", async (req, res) => {
  const { billingAddress, shippingAddress, cartItems, total } = req.body;

  const formatAddress = (address) => `
    ${address.firstName} ${address.lastName}<br/>
    ${address.address}${address.address2 ? `, ${address.address2}` : ""}<br/>
    ${address.city}, ${address.state} ${address.zipCode}<br/>
    ${address.country}<br/>`
  ;

  const message = `
    <h2>New Order Received</h2>
    <p><strong>Name:</strong> ${billingAddress.firstName} ${billingAddress.lastName}</p>
    <p><strong>Email:</strong> ${billingAddress.email}</p>
    <p><strong>Shipping Address:</strong> ${formatAddress(shippingAddress)}</p>
  
    <h3>Order Details:</h3>
    <ul>
      ${cartItems.map(item => `
        <li>
          <strong>${item.name}</strong> (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}
          ${item.personalization && item.personalization.trim() !== "" ? `
            <ul>
              <li><strong>Personalization:</strong> ${item.personalization}</li>
            </ul>
          ` : ""}
        </li>
      `).join('')}
    </ul>
  
    <p><strong>Total:</strong> $${total.toFixed(2)}</p>
  `;


  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.OWNER_EMAIL,
      subject: "New Contact Form Message",
      html: message,
    };
    await transporter.sendMail(mailOptions);

    res.json({ success: true });
  } catch (err) {
    console.error("Email send error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/reviews", async (req, res) => {
  const { username, rating, review } = req.body; // Check for expected fields

  if (!username || !rating || !review) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newReview = {
      username,
      rating,
      review,
      createdAt: new Date(),
    };

    const docRef = await db.collection("reviews").add(newReview);
    res.status(201).json({ id: docRef.id, ...newReview });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/products", async (req, res) => {
  try {
    const {
      name,
      storageFolder,
      description,
      price,
      tags,
      materials,
      size,
      personalize,
      thumbnail,
      photos,
    } = req.body;

    if (
      !name ||
      !storageFolder ||
      !description ||
      !price ||
      !tags ||
      !materials ||
      !size ||
      !personalize ||
      !thumbnail ||
      !photos
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newProduct = {
      name,
      storageFolder,
      description,
      price,
      tags,
      materials,
      size,
      personalize,
      thumbnail,
      photos,
    };

    const docRef = await db.collection("products").add(newProduct);
    res.status(201).json({ id: docRef.id, ...newProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/products/:id/reviews", async (req, res) => {
  const productId = req.params.id;
  const { username, rating, review } = req.body;

  if (!username || !rating || !review) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Ensure the product exists before allowing a review
    const productRef = db.collection("products").doc(productId);
    const productSnap = await productRef.get();
    if (!productSnap.exists) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Save the review
    const reviewRef = db.collection("reviews");
    const newReview = {
      productId, // Links review to a specific product
      username,
      rating,
      review,
      createdAt: new Date(),
    };

    const docRef = await reviewRef.add(newReview);
    res.status(201).json({ id: docRef.id, ...newReview });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/products", async (req, res) => {
  try {
    const snapshot = await db.collection("products").get();
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // Fetch product
    const productRef = db.collection("products").doc(productId);
    const productSnap = await productRef.get();

    if (!productSnap.exists) {
      return res.status(404).send({ error: "No such document found." });
    }

    const product = { id: productSnap.id, ...productSnap.data() };

    // Fetch reviews for the product
    const reviewsRef = db
      .collection("reviews")
      .where("productId", "==", productId);
    const reviewsSnapshot = await reviewsRef.get();
    const reviews = reviewsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ ...product, reviews });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/products/filter", async (req, res) => {
  try {
    const { tag } = req.query;
    if (!tag) {
      return res.status(400).json({ error: "Tag parameter is required" });
    }

    const snapshot = await db
      .collection("products")
      .where("tags", "array-contains", tag)
      .get();
    const filteredProducts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(filteredProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/products/:id/reviews", async (req, res) => {
  const productId = req.params.id;

  try {
    // Check if the product exists
    const productRef = db.collection("products").doc(productId);
    const productSnap = await productRef.get();

    if (!productSnap.exists) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Fetch reviews for the product (requires index)
    const reviewsSnapshot = await db
      .collection("reviews")
      .where("productId", "==", productId)
      .orderBy("createdAt", "desc") // Requires composite index!
      .get();

    const reviews = reviewsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error retrieving reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

app.get("/reviews", async (req, res) => {
  try {
    const snapshot = await db.collection("reviews").get();
    const reviews = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      storageFolder,
      description,
      price,
      tags,
      materials,
      size,
      personalize,
      thumbnail,
      photos,
    } = req.body;

    const productRef = db.collection("products").doc(id);
    await productRef.update({
      name,
      storageFolder,
      description,
      price,
      tags,
      materials,
      size,
      personalize,
      thumbnail,
      photos,
    });

    res.json({
      name,
      storageFolder,
      description,
      price,
      tags,
      materials,
      size,
      personalize,
      thumbnail,
      photos,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("products").doc(id).delete();
    res.json({ message: "Product deleted successfully", id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/products/:id/reviews", async (req, res) => {
  const productId = req.params.id;
  try {
    const reviewsSnapshot = await db
      .collection("reviews")
      .where("productId", "==", productId)
      .get();

    const reviews = reviewsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error retrieving review", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
