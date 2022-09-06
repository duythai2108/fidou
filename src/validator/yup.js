import { object, object as OBJECT, ref, string, bool } from 'yup'
import {
  notSpecialRegExp,
  passDigitSpecialRegExp,
  passLowerRegExp,
  passUpperRegExp,
  numRegExp,
  passOneDigitRegExp
} from '.'

const EMAIL = string()
  .required('Vui lòng nhập email')
  .email('Định dạng email chưa đúng')
  .max(64, 'Email không được vượt quá 64 ký tự')

const FULL_NAME = string()
  .required('Vui lòng nhập tên')
  .matches(numRegExp, 'Tên không được chứa số')
  .matches(
    notSpecialRegExp,
    'Tên không được chứa các ký tự đặc biệt(@,#,...etc) '
  )
  .max(32, 'Tên không được vượt quá 32 ký tự')

const PHONE_NUMBER = string()
  .required('Vui lòng nhập số điện thoại')
  .max(11, 'Số điện thoại không được vượt quá 11 ký tự')

const PASSWORD = string()
  .required('Vui lòng nhập mật khẩu')
  .min(10, 'Mật khẩu phải có trên 10 ký tự')
  .matches(passUpperRegExp, 'Mật khẩu phải có ít nhất 1 ký tự viết hoa')
  .matches(passLowerRegExp, 'Mật khẩu phải có ít nhất 1 ký tự viết thường')
  .matches(passOneDigitRegExp, 'Mật khẩu phải có ít nhất 1 số')

const CONFIRM_PASSWORD = string()
  .required('Vui lòng nhập mật khẩu')
  .min(10, 'Mật khẩu phải có trên 10 ký tự')
  .matches(passUpperRegExp, 'Mật khẩu phải có ít nhất 1 ký tự viết hoa')
  .matches(passLowerRegExp, 'Mật khẩu phải có ít nhất 1 ký tự viết thường')
  .matches(passOneDigitRegExp, 'Mật khẩu phải có ít nhất 1 số')
  .oneOf([ref('password'), null], 'Mật khẩu không khớp')

const ADDRESS = string().required('Vui lòng nhập địa chỉ')

const ACCEPT_POLICY = bool().oneOf([true], 'Đồng ý điều khoản để tiếp tục!')

const validations = {
  OBJECT,
  EMAIL,
  FULL_NAME,
  PHONE_NUMBER,
  PASSWORD,
  CONFIRM_PASSWORD,
  ADDRESS,
  ACCEPT_POLICY
}

export default validations
