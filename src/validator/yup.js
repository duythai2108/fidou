import { object, object as OBJECT, ref, string, bool, date } from 'yup'
import {
  notSpecialRegExp,
  passDigitSpecialRegExp,
  passLowerRegExp,
  passUpperRegExp,
  numRegExp,
  passOneDigitRegExp,
  passWebsiteRegExp,
  notAllowNumRegExp
} from '.'
import moment from 'moment'

// ----- AUTH -----
const EMAIL = string()
  .required('Vui lòng nhập email')
  .email('Định dạng email chưa đúng')
  .max(64, 'Email không được vượt quá 64 ký tự')

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
const ACCEPT_POLICY = bool().oneOf([true], 'Đồng ý điều khoản để tiếp tục!')
// ----- END - AUTH -----

// ----- UPDATE PROFILE -----
const FULL_NAME = string()
  .required('Vui lòng nhập tên')
  .matches(notAllowNumRegExp, 'Tên không được chứa số')
  .matches(
    notSpecialRegExp,
    'Tên không được chứa các ký tự đặc biệt(@,#,...etc) '
  )
  .max(32, 'Tên không được vượt quá 32 ký tự')

const COMPANY_NAME = string()
  .required('Vui lòng nhập tên công ty')
  .max(32, 'Tên công ty không được vượt quá 32 ký tự')

const WEBSITE_NAME = string()
  .required('Vui lòng nhập tên website')
  .matches(passWebsiteRegExp, 'Vui lòng nhập đúng định dạng')

const DESCRIPTION = string().required('Vui lòng nhập mô tả')

const DOB = string()
  .required('Vui lòng chọn ngày sinh')
  .test(
    'DOB',
    'Không thể đăng kí cho người dưới 18 tuổi',
    date => moment().diff(moment(date), 'years') >= 18
  )

const VOICE_QUALITY = string().required('Vui lòng chọn chất giọng')

const ADDRESS = string().required('Vui lòng nhập địa chỉ')
const PROVINCE = string().required('Vui lòng chọn thành phố')
const DISTRICT = string().required('Vui lòng chọn quận')
const WARD = string().required('Vui lòng chọn phường')

const FACEBOOK = string().required('Vui lòng nhập Facebook')
const INSTAGRAM = string().required('Vui lòng nhập Instagram')
const LINKEDIN = string().required('Vui lòng nhập Linked In')
const TWITTER = string().required('Vui lòng nhập Twitter')
// ----- END - UPDATE PROFILE -----

const validations = {
  OBJECT,

  EMAIL,
  PHONE_NUMBER,
  PASSWORD,
  CONFIRM_PASSWORD,
  ACCEPT_POLICY,

  FULL_NAME,
  COMPANY_NAME,
  WEBSITE_NAME,
  DESCRIPTION,
  DOB,
  VOICE_QUALITY,

  ADDRESS,
  PROVINCE,
  DISTRICT,
  WARD,

  FACEBOOK,
  INSTAGRAM,
  LINKEDIN,
  TWITTER
}

export default validations
