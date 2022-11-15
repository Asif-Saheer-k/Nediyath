
var express = require("express");

const productHelpers = require("../helpers/product-helpers");
var router = express.Router();
var productHelper = require("../helpers/product-helpers");


/* GET users listing. */

const cridential = {
  name: process.env.UESER_NAME,
  password: process.env.PASSWORD,
};

const verifylogin = (req, res, next) => {
  if (req.session.admin) {
    next();
  } else {
    res.render("admin/admin-login", { login: true, admin: true });
  }
};

router.post("/admin-login", (req, res) => {
  if (
    req.body.name == cridential.name &&
    req.body.password == cridential.password
  ) {
    req.session.admin = true;
    res.redirect("/admin");
  } else {
    res.render("admin/admin-login", {
      login: true,
      admin: true,
      loginadminErr: true,
    });
  }
  loginadminErr = false;
});

router.get("/", verifylogin, async function (req, res, next) {
  productHelper.getAllproducts().then((product) => {
    res.render("admin/admin-home", { product, admin: true });
  });
});

router.get("/admin-logout", verifylogin, (req, res) => {
  req.session.admin = false;
  res.redirect("/admin");
});

router.post("/add-product", verifylogin, (req, res) => {
  productHelper.addproduct(req.body, (id) => {
    let image = req.files.image;

    image.mv("./public/product-images/" + id + ".jpg", (err, done) => {
      if (!err) {
        productHelper.getAllproducts().then((product) => {
          res.render("admin/admin-home", { admin: true, product });
        });
      } else {
        console.log(err);
      }
    });
  });
});

// router.get("/products", verifylogin, (req, res) => {
//   productHelpers.getAllproducts().then((products) => {
//     res.render("admin/view-products", { products, admin: true });
//   });
// });
router.get("/delete-product/:id", verifylogin, (req, res) => {
  let proId = req.params.id;
  productHelpers.deleteProduct(proId).then((response) => {
    res.redirect("/admin");
  });
});
router.get("/gallery", verifylogin, (req, res) => {
  productHelper.getAllGAllry().then((product) => {
    res.render("admin/gallary-manage", { product, admin: true });
  });
});

router.post("/add-gallery-image", verifylogin, (req, res) => {
  productHelper.addGallery(req.body, (id) => {
    let image = req.files.image;
    image.mv("./public/gallery-image/" + id + ".jpg", (err, done) => {
      if (!err) {
        productHelper.getAllGAllry().then((product) => {
          res.render("admin/gallary-manage", { admin: true, product });
        });
      } else {
        console.log(err);
      }
    });
  });
});

router.get("/delete-gallery-image/:id", verifylogin, (req, res) => {
  let proId = req.params.id;
  productHelpers.deleteGallery(proId).then((response) => {
    res.redirect("/admin");
  });
});
/* GET users listing. */


module.exports = router;
