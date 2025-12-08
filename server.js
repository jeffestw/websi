import express from "express";
import admin from "firebase-admin";

const app = express();
app.use(express.json());

// ✅ ENV’den Service Account alacağız
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// ✅ TEST ENDPOINT
app.get("/", (req, res) => {
    res.send("✅ FCM Push Server Çalışıyor!");
});

// ✅ PUSH GÖNDEREN ENDPOINT
app.post("/send-push", async (req, res) => {
    const { token, title, body, data } = req.body;

    if (!token) {
        return res.status(400).json({ error: "token gerekli" });
    }

    const message = {
        token: token,
        notification: {
            title: title || "Yeni Mesaj",
            body: body || "Sana yeni mesaj geldi"
        },
        data: data || {}
    };

    try {
        const response = await admin.messaging().send(message);
        res.json({ success: true, response });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// ✅ Render otomatik PORT verir
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("✅ Push Server Çalışıyor PORT:", PORT);
});
