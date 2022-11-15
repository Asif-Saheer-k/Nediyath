var db = require("../confiq/connection");
var collection = require("../confiq/collection");

var objectId = require("mongodb").ObjectId;

var promise = require("promise");



module.exports = {
  /******************** */
  addproduct: (product, callback) => {
    db.get()
      .collection("product")
      .insertOne(product)
      .then(async (data) => {
        console.log(data);
        let products = await db
          .get()
          .collection(collection.PRODUCT_COLLECTION)
          .find()
          .toArray();
        callback(data.insertedId);
      });
  },
  addGallery: (product, callback) => {
    db.get()
      .collection("gallery")
      .insertOne(product)
      .then(async (data) => {
        let products = await db
          .get()
          .collection(collection.PRODUCT_COLLECTION)
          .find()
          .toArray();
        callback(data.insertedId);
      });
  },

  getAllproducts: () => {
    return new Promise(async (resolve, reject) => {
      let products = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .find()
        .toArray();
      resolve(products);
    });
  },
  getAllGAllry: () => {
    return new Promise(async (resolve, reject) => {
      let products = await db
        .get()
        .collection(collection.GALLERY_COLLECTION)
        .find()
        .toArray();
      resolve(products);
    });
  },
  deleteProduct: (proid) => {
    return new promise((resolve, reject) => {
      console.log(objectId(proid));
      db.get()
        .collection(collection.PRODUCT_COLLECTION)
        .deleteOne({ _id: objectId(proid) })
        .then((response) => {
          resolve(response);
        });
    });
  },
  deleteGallery: (proid) => {
    return new promise((resolve, reject) => {
      db.get()
        .collection(collection.GALLERY_COLLECTION)
        .deleteOne({ _id: objectId(proid) })
        .then((response) => {
          resolve(response);
        });
    });
  },

  getCategoryWaysProduct:(id)=>{
    return new promise((resolve, reject) => {
      db.get()
        .collection(collection.PRODUCT_COLLECTION)
        .find({category:id }).toArray()
        .then((response) => {
          resolve(response);
        });
    });

  }  
}         

  /******************** */

 
