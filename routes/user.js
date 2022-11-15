var express = require("express");
var router = express.Router();
const nodemailer = require("nodemailer");
const productHelpers = require("../helpers/product-helpers");

require("dotenv").config();

//

/* GET home page. */
router.get("/", async function (req, res, next) {
  productHelpers.getAllproducts().then((product) => {
    res.render("user/index", { product });
  });
});

router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
  } else {
    res.render("user/login", { loginErr: req.session.loginErr });
    req.session.loginErr = false;
  }
});
router.get("/product", (req, res) => {
  productHelpers.getAllproducts().then((product) => {
    res.render("user/view-products", { product });
  });
});
router.get("/gallary", (req, res) => {
  productHelpers.getAllGAllry().then((products) => {
    res.render("user/gallary", { products });
  });
});

router.get("/contact", (req, res) => {
  res.render("user/contact");
});
router.get("/about", (req, res) => {
  res.render("user/about");
});

router.get("/blog-single", (req, res) => {
  res.render("user/blog-page");
});
router.post("/contact", async (req, res) => {
  console.log(req.body, "djjcmc");
  const { name, subject, phone, message, email } = req.body;
  let testAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "asifsaheer7034@gmail.com", // generated ethereal user
      pass: "okwezuwkfxdykqph", // generated ethereal password
    },
  });
  let info = await transporter.sendMail({
    from: email, // sender address
    to: "asifsaheerpangasifsaheer@gmail.com", // list of receivers
    subject: subject, // Subject line
    text: name, // plain text body
    html: `<b>${message}. if you need more information please contact this no ${phone}</b>`, // html body
  });
  res.redirect("/contact");
});
router.get("/", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

router.get("/:id", (req, res) => {
  console.log(req.params.id);
  const category = req.params.id;
  productHelpers.getCategoryWaysProduct(category).then((product) => {   
    res.render("user/category-ways", { product });
  });
});

module.exports = router;
