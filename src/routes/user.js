const express = require("express");
const route = express.Router();
const createError = require("http-errors");
const User = require("../app/models/User.model");
const UserController = require("../app/controllers/UserController");
const { userValidate } = require("../helpers/validation");
const {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../helpers/jwt_service");

// route.post("/register", async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     const { error } = userValidate(req.body);

//     if (error) {
//       throw createError(error.details[0].message);
//     }
//     const isExists = await User.findOne({
//       username: email,
//     });
//     if (isExists) {
//       throw createError.Conflict(`${email} is exist!!`);
//     }

//     const user = new User({
//       username: email,
//       password,
//     });
//     const saveUser = await user.save();

//     saveUser && res.redirect("/user/user-login");
//     // return res.json({
//     //     status: 'okay',
//     //     element: saveUser
//     // })
//     console.log("Register OK");
//   } catch (error) {
//     next(error);
//   }
// });


route.post("/register", async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      // Kiểm tra dữ liệu nhập vào
      const { error } = userValidate(req.body);
      if (error) {
        // Nếu có lỗi, trả về thông báo lỗi
        return res.status(422).json({ status: 'error', message: error.details[0].message });
      }
  
      // Kiểm tra xem email (tên người dùng) đã tồn tại hay chưa
      const isExists = await User.findOne({ username: email });
      if (isExists) {
        // Nếu email đã tồn tại, trả về thông báo lỗi
        return res.status(409).json({ status: 'error', message: `${email} is already registered!` });
      }
  
      // Tạo người dùng mới
      const user = new User({
        username: email,
        password, 
      });
  
      // Lưu người dùng vào database
      const saveUser = await user.save();
  
      if (saveUser) {
        // Nếu đăng ký thành công, trả về thông báo thành công
        return res.status(200).json({ status: 'success', message: 'Register Successfully' });
      }
  
      // Trong trường hợp không xác định, trả về lỗi server
      throw createError(500, "Internal Server Error");
  
    } catch (error) {
      // Xử lý các lỗi khác và trả về thông báo lỗi
      console.error(error.message);
      return res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
  });
  


route.post("/refresh-token", async (req, res, next) => {
  try {
    console.log(req.body);
    const { refreshToken } = req.body;
    const { userId } = await verifyRefreshToken(refreshToken);
    const accessToken = await signAccessToken(userId);
    const refrToken = await signRefreshToken(userId);
    res.json({
      accessToken,
      refreshToken: refrToken,
    });
  } catch (error) {
    next(error);
  }
});
route.post("/login", async (req, res, next) => {
  try {
    const { error } = userValidate(req.body);
    if (error) {
      throw createError(error.details[0].message);
    }
    const { email, password } = req.body;
    const user = await User.findOne({
      username: email,
    });
    if (!user) {
      throw createError.NotFound("User is not register");
    }
    const isValid = await user.isCheckPassword(password);
    if (!isValid) {
      throw createError.Unauthorized("Password is not correct!!!");
    }

    isValid && res.redirect("/courses/create");

    const accessToken = await signAccessToken(user._id);
    const refreshToken = await signRefreshToken(user._id);

    // res.json({
    //     accessToken,
    //     refreshToken
    // })
    //  res.send(user);

    console.log("Login OK");
  } catch (error) {
    next(error);
  }
});
route.post("/logout", (req, res, next) => {
  res.send("Function logout");
});

route.get("/user-register", UserController.search);
route.get("/user-login", UserController.login);

// route.get('/getLists', verifyAccessToken, (req, res, next) => {
//     console.log(req.headers);
//     const listUser = [
//         {
//             email: 'buituankhai2001@gmail.com'
//         },
//         {
//             email: 'khaibadao15@gmail.com'
//         }
//     ]
//     res.send(
//         { listUser }
//     )

// })

module.exports = route;
