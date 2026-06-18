/**
 * Định nghĩa Regex kiểm tra định dạng email và số điện thoại
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9]{9,11}$/;

/**
 * Middleware kiểm tra hợp lệ dữ liệu Đăng ký
 */
const validateRegister = (req, res, next) => {
  const { fullName, email, phone, password, role } = req.body;
  const errors = {};

  // Kiểm tra fullName
  if (!fullName || fullName.trim() === '') {
    errors.fullName = 'Họ và tên không được để trống';
  } else if (fullName.trim().length < 2 || fullName.trim().length > 100) {
    errors.fullName = 'Họ và tên phải từ 2 đến 100 ký tự';
  }

  // Kiểm tra email
  if (!email || email.trim() === '') {
    errors.email = 'Email không được để trống';
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Email không đúng định dạng';
  }

  // Kiểm tra số điện thoại
  if (!phone || phone.trim() === '') {
    errors.phone = 'Số điện thoại không được để trống';
  } else if (!PHONE_REGEX.test(phone.trim())) {
    errors.phone = 'Số điện thoại phải chứa 9-11 chữ số';
  }

  // Kiểm tra mật khẩu
  if (!password || password.length < 6) {
    errors.password = 'Mật khẩu phải chứa ít nhất 6 ký tự';
  }

  // Kiểm tra role nếu có truyền lên (chỉ cho phép các role hợp lệ)
  if (role && !['customer', 'staff', 'admin'].includes(role)) {
    errors.role = 'Vai trò tài khoản không hợp lệ';
  }

  // Nếu có lỗi, trả về mã lỗi 400 Bad Request
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Dữ liệu không hợp lệ',
      errors
    });
  }

  next();
};

/**
 * Middleware kiểm tra hợp lệ dữ liệu Đăng nhập
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = {};

  // Kiểm tra email
  if (!email || email.trim() === '') {
    errors.email = 'Email không được để trống';
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Email không đúng định dạng';
  }

  // Kiểm tra mật khẩu
  if (!password) {
    errors.password = 'Mật khẩu không được để trống';
  }

  // Nếu có lỗi, trả về mã lỗi 400 Bad Request
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Dữ liệu không hợp lệ',
      errors
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin
};
