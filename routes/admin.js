const { response } = require("express");
var express = require("express");
const async = require("hbs/lib/async");

const productHelpers = require("../helpers/product-helpers");
const { countDaySales } = require("../helpers/product-helpers");
var router = express.Router();
var productHelper = require("../helpers/product-helpers");
const userHepers = require("../helpers/user-hepers");
const nodemailer = require("nodemailer");
const TrustedComms = require("twilio/lib/rest/preview/TrustedComms");

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

router.get("/add-product", verifylogin, async (req, res) => {
  let category = await productHelper.getAllcategory();
  res.render("admin/add-product", { admin: true, category });
});
router.get("/edit-product/:id", verifylogin, async (req, res) => {
  let category = await productHelper.getAllcategory();
  let product = await productHelper.getAllproductsDetails(req.params.id);
  console.log(product);
  res.render("admin/edit-product", { product, admin: true, category });
});
router.post("/edit-product/:id", verifylogin, (req, res) => {
  productHelpers.updateProduct(req.params.id, req.body).then(() => {
    let id = req.params.id;
    res.redirect("/admin/");
    if (req.files.image) {
      let image = req.files.image;
      image.mv("./public/product-images/" + id + ".jpg", (err, done) => {});
    }
  });
});

router.get("/view-category", verifylogin, (req, res) => {
  productHelper.getAllcategory().then((category) => {
    console.log(category);
    res.render("admin/view-category", { category, admin: true });
  });
});
router.get("/add-category", verifylogin, (req, res) => {
  res.render("admin/add-category", { admin: true });
});
router.post("/add-category", verifylogin, (req, res) => {
  productHelper.addcategory(req.body).then((id) => {
    let categoryImage = req.files.image;
    categoryImage.mv("./public/category-image/" + id + ".jpg", (err, done) => {
      if (err) {
        console.log(err);
      } else {
        res.render("admin/add-category", { admin: true });
      }
    });
    res.redirect("/admin");
  });
});
router.get("/delete-category/:id", verifylogin, (req, res) => {
  let cateId = req.params.id;
  console.log(cateId);
  productHelper.deleteCategory(cateId).then((response) => {
    res.redirect("/admin/view-category");
  });
});

router.get("/edit-category/:id", verifylogin, async (req, res) => {
  let category = await productHelper.getAllcategoryDetails(req.params.id);
  res.render("admin/edit-category", { category, admin: true });
});

router.post("/edit-category/:id", verifylogin, (req, res) => {
  productHelper.updateCategory(req.params.id, req.body).then(() => {
    res.redirect("/admin");
    console.log(response);
    let id = req.params.id;
    let images = req.files.image;
    console.log("bjbbkbkj");
    if (req.files.image) {
      images.mv("./public/category-image/" + id + ".jpg", (err, done) => {});
    }
  });
});
router.get("/all-users", verifylogin, (req, res) => {
  productHelper.getAllUsers().then((users) => {
    res.render("admin/all-users", { users, admin: true });
  });
});

//admin

router.get("/block-user/:id", verifylogin, (req, res) => {
  let id = req.params.id;
  console.log(id);
  req.session.destroy();
  productHelpers.blockUsers(id).then((resp) => {
    if (resp) {
      res.redirect("/admin/all-users");
    } else {
      console.log("failed");
    }
  });
});
router.get("/unblock-user/:id", verifylogin, (req, res) => {
  const id = req.params.id;
  productHelper.unblockUser(id).then((resp) => {
    if (resp) {
      res.redirect("/admin/all-users");
      console.log(resp);
    } else {
      console.log("failed");
    }
  });
});
router.get("/delete-users/:id", verifylogin, (req, res) => {
  let id = req.params.id;
  productHelper.deleteUsers(id).then((response) => {
    res.redirect("/admin/all-users");
  });
});
router.get("/all-orders", verifylogin, (req, res) => {
  productHelper.getAllorders().then((orders) => {
    res.render("admin/all-orders", { orders, admin: true });
  });
});
router.post("/updateStatus", verifylogin, async (req, res) => {
  let orderStatus = req.body.status;
  let orderId = req.body.orderId;
  let user = req.body.user;
  console.log(user);
  let userDetails = await userHepers.finduseremail(user);

  if (orderStatus == "canceled") {
    productHelper.canceledUpdate(orderId).then((res) => {
      console.log("caancled");
      console.log(res);
    });
  } else if (orderStatus == "Delived") {
    userHepers.placedUpdate(orderId).then((response) => {});
  } else if (orderStatus == "order confirmed") {
    userHepers.placedUpdatecon(orderId).then((response) => {});
  } else if (orderStatus == "shipped") {
    userHepers.placedUpdateship(orderId).then((response) => {});
  } else if (orderStatus == "Arriving") {
    userHepers.placedUpdatesArriv(orderId).then((response) => {
      console.log("placed");
    });
  }
  console.log(orderId);
  productHelper.upadateStatus(orderId, orderStatus).then((response) => {
    console.log(response);
    res.json({ status: true });
  });
});
router.get("/order-product-details/:id", verifylogin, async (req, res) => {
  let orderId = req.params.id;
  let products = await userHepers.getOrderProducts(orderId);
  console.log("bxvxvxvcxc");
  console.log(products);
  res.render("admin/admin-order-product", { admin: true, products });
});
router.get("/add-banner", verifylogin, (req, res) => {
  res.render("admin/add-banneer", { admin: true });
});
router.post("/add-banner", verifylogin, (req, res) => {
  productHelper.addBanner(req.body).then((id) => {
    console.log(id);
    let image = req.files.image;
    image.mv("./public/banner-images/" + id + ".jpg", (err, done) => {});
  });
  res.redirect("/admin/");
});
router.get("/view-banner", verifylogin, async (req, res) => {
  let banneer = await productHelper.getAllBanner();
  console.log(banneer);
  res.render("admin/view-banner", { admin: true, banneer });
});
router.get("/edit-banner/:id", verifylogin, async (req, res) => {
  let id = req.params.id;
  console.log(id);
  let banner = await productHelper.getEditBanner(id);
  console.log(banner);
  res.render("admin/edit-banner", { banner, admin: true });
});
router.post("/edit-banner/:id", verifylogin, (req, res) => {
  let id = req.params.id;
  console.log(req.body);
  productHelper.updateBanner(req.body, id).then((response) => {
    res.redirect("/admin");
    if (req.files.image) {
      let image = req.files.image;
      image.mv("./public/banner-images/" + id + ".jpg", (err, done) => {});
    }
  });
});
router.post("/delete-banner", verifylogin, (req, res) => {
  let id = req.body.bannerId;
  console.log(id);
  productHelper.deletebanner(id).then((response) => {
    res.json(response);
  });
});
router.get("/getChartDates", verifylogin, async (req, res) => {
  console.log("kgjhgjhfhj");
  let month = await productHelper.countsalemonth();
  console.log("amene");
  let dailySales = await productHelper.countDaySales();
  console.log("amene");
  let yearlySales = await productHelpers.getYearlySale();
  console.log(month, "bhgjhfghjgf");
  res.json({ dailySales, yearlySales, month });
});
router.get("/view-coupon", verifylogin, async (req, res) => {
  let coupon = await productHelper.findcoupon();
  res.render("admin/view-coupon", { admin: true, coupon });
});
router.post("/view-coupon", verifylogin, (req, res) => {
  console.log(req.body);
  productHelper.addcoupon(req.body).then((response) => {
    res.redirect("/admin/view-coupon");
  });
});
router.get("/sales-reports", verifylogin, async (req, res) => {
  let orders = await productHelper.getAllorders();
  res.render("admin/sales-reports", { admin: true, orders });
});
module.exports = router;
