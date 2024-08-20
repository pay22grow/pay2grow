const connectToMongo = require("./Database/db");
const express = require("express");
const app = express();
connectToMongo();
const port = process.env.PORT || 3000;

var cors = require("cors");

app.use(cors());
app.use(express.json());

app.use("/api/user/auth", require("./routes/User Api/userCredentials"));
app.use("/api/user/recharge", require("./routes/Other Api/recharge"));
app.use("/api/user/details", require("./routes/User Api/userDetails"));
app.use("/api/admin/auth", require("./routes/Admin Api/adminCredentials"));
app.use("/api/admin/details", require("./routes/Admin Api/adminDetails"));
app.use("/api/admin/edit", require("./routes/Other Api/setPrices"));
app.use("/api/admin/recharge", require("./routes/Admin Api/adminRecharge"));
app.use('/api/invites', require("./routes/Other Api/invite"));
app.use('/api/user/validate', require("./routes/Other Api/authRoutes"));
app.use('/api/admin/validate', require("./routes/Other Api/authRoutes"));
app.use('/api/admin/recharge/address', require("./routes/Other Api/rechargeAddress"));
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
