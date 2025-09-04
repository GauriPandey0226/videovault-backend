// import multer from "multer";
// import fs from "fs";
// import path from "path";

// const uploadDir = path.join(process.cwd(), "public", "temp");

// // Ensure the directory exists before Multer uses it
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   }
// });

// export const upload = multer({ storage });

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       // cb(null, "./public\temp")
//        cb(null, path.join(process.cwd(), "pub lic/temp"));
//     },
//     filename: function (req, file, cb) {
      
//       // cb(null, file.originalname)
//       cb(null, Date.now() + "-" + file.originalname);
//     }
//   })
  
// export const upload = multer({ 
//     storage, 
// })
import multer from "multer";

//use disk storage for file uploads
//this will save the uploaded files to a temporary directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

export { upload };