import { Collapse, Dropdown, Menu, Modal, Select } from 'antd'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithPopup } from 'firebase/auth'
import {
  auth,
  database,
  dbQuery,
  ggProvider,
  onValue,
  ref,
  storageRef
} from '../../Firebase/config.js'
import { getAuthen, postAuthen } from '../../axios/authenfunction'
import InfoIcon from '@mui/icons-material/Info'
import API from '../../constans/api'
import PATH from '../../constans/path'
import 'antd/dist/antd.css'
import './header.style.scss'
import {
  AppstoreOutlined,
  BarsOutlined,
  BellOutlined,
  CaretDownOutlined,
  ClearOutlined,
  LoginOutlined,
  MailOutlined,
  SearchOutlined,
  SettingOutlined
} from '@ant-design/icons'
import EmailIcon from '@mui/icons-material/Email'
import { checkEmail, checkEqual, checkLength } from '../../Utils/validation.js'
import Swal from 'sweetalert2'
import { AccountContext } from '../../context/AccountProvider.jsx'
import path from '../../constans/path'
import { equalTo, orderByChild } from 'firebase/database'
import { async } from '@firebase/util'

import { yupResolver } from '@hookform/resolvers/yup'
import yup from '../../validator/yup'
import { useForm } from 'react-hook-form'

//  --- SCHEMA FOR REGISTER AND LOGIN. ---
const validationSchemaRegister = yup.OBJECT({
  email: yup.EMAIL,
  phone: yup.PHONE_NUMBER,
  password: yup.PASSWORD,
  rePassword: yup.CONFIRM_PASSWORD,
  acceptCheckbox: yup.ACCEPT_POLICY
})
const validationSchemaLogin = yup.OBJECT({
  username: yup.EMAIL,
  passwordLogin: yup.PASSWORD
})
//  --- END - SCHEMA FOR REGISTER AND LOGIN. ---

function Header() {
  let navigate = useNavigate()
  let accountContext = useContext(AccountContext)
  let { dispatch, data } = accountContext
  const [registerData, setRegisterData] = useState({
    accessToken: '',
    account: {
      phoneNumber: '',
      email: '',
      password: '',
      role: 0
    }
  })

  //  --- APPLY SCHEMA TO FORM ---
  const {
    register: registerR,
    handleSubmit: handleSubmitR,
    formState: { errors: errorsR }
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(validationSchemaRegister)
  })
  const {
    register: registerL,
    handleSubmit: handleSubmitL,
    formState: { errors: errorsL }
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(validationSchemaLogin)
  })
  //  --- END - APPLY SCHEMA TO FORM ---

  const { Panel } = Collapse
  const [isModalVisibleLogin, setIsModalVisibleLogin] = useState(false)
  const [isModalVisibleSignup, setIsModalVisibleSignup] = useState(false)
  const [isShowMenu, setIsShowMenu] = useState(false)
  const [isSignUpSuccess, setIsSignUpSuccess] = useState(false)
  const [signUpUser, setSignUpUser] = useState({})
  const [role, setRole] = useState(1)
  const [category, setCategory] = useState([])
  const [selectCategory, setSelectCategory] = useState('')
  // const [account, setAccount] = useState({});
  let email = useRef(null)
  let phone = useRef(null)
  let password = useRef(null)
  let rePassword = useRef(null)
  let username = useRef(null)
  let passwordLogin = useRef(null)
  let acceptCheckbox = useRef(null)
  let phonegg = useRef(null)
  let passwordgg = useRef(null)
  let repasswordgg = useRef(null)
  let searchInput = useRef(null)
  const [notification, setNotification] = useState([])
  useEffect(() => {
    console.log('fetch noti')
    setNotification()
    const account = JSON.parse(localStorage.getItem('account'))
    const fetch = async () => {
      const starCountRef = dbQuery(
        storageRef(database, 'Notifications/JobHaveNewApplicant'),
        orderByChild('TargetAccountId'),
        equalTo(account.id)
      )
      onValue(starCountRef, async snapshot => {
        const data = snapshot.val()
        let newData = notification
        if (data) {
          for (const [key, value] of Object.entries(data)) {
            let candidate = {}
            await getAuthen(API['GET_CANDIDATE_INFO'] + value.CandidateId, true)
              .then(response => {
                candidate = response.data.data
              })
              .catch()
            let job = {}
            await getAuthen(API['GET_JOB'] + value.JobId, true)
              .then(response => {
                job = response.data.data
              })
              .catch()
            if (newData.filter(item => item.fid == key).length == 0) {
              newData.push({
                ...value,
                type: 'newJob',
                Candidate: candidate,
                job: job,
                fid: key
              })
            }
          }
          newData.reverse()
          setNotification([...newData])
        }
      })

      const fetchInvite = dbQuery(
        storageRef(database, 'Notifications/CandidateInvited'),
        orderByChild('TargetAccountId'),
        equalTo(account.id)
      )
      onValue(fetchInvite, async snapshot => {
        const data = snapshot.val()
        console.log(data)
        let newData = notification
        for (const [key, value] of Object.entries(data)) {
          await getAuthen(API['GET_ENTERPRISE_INFO'] + value.EnterpriseId, true)
            .then(response => {
              const enterprise = response.data.data

              if (newData.filter(item => item.fid == key).length == 0) {
                newData.push({
                  ...value,
                  type: 'invite',
                  enterprise: enterprise,
                  fid: key
                })
              }
            })
            .catch()
        }
        newData.reverse()
        setNotification([...newData])
      })

      const fetchSchedule = dbQuery(
        storageRef(database, 'Notifications/ConversationSchedule'),
        orderByChild('TargetAccountId'),
        equalTo(account.id)
      )
      onValue(fetchSchedule, async snapshot => {
        const data = snapshot.val()
        let newData = notification
        for (const [key, value] of Object.entries(data)) {
          await getAuthen(API['GET_ENTERPRISE_INFO'] + value.EnterpriseId, true)
            .then(response => {
              const enterprise = response.data.data
              if (newData.filter(item => item.fid == key).length == 0) {
                newData.push({
                  ...value,
                  type: 'schedule',
                  enterprise: enterprise,
                  fid: key
                })
              }
            })
            .catch()
        }
        newData.reverse()
        setNotification([...newData])
      })
    }

    const fetchCategory = () => {
      getAuthen(API['GET_CATEGORY'])
        .then(response => {
          setCategory(response.data.data)
        })
        .catch()
    }

    fetch()
    fetchCategory()
  }, [data])

  useEffect(() => {
    console.clear()
    console.log(notification)
  }, [notification])

  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <Link
              to={
                (data.account?.role == 0
                  ? PATH['PROFILE_PAGE']
                  : PATH['COMPANY_PAGE']) + `/${data.account?.id}`
              }
            >
              H??? s?? c???a b???n
            </Link>
          )
        },
        {
          key: '2',
          label: (
            <Link
              to={
                data.account?.role == 0
                  ? path['UPDATE_PROFILE_PAGE'] + `/candidate`
                  : path['UPDATE_PROFILE_PAGE'] + `/enterprise`
              }
            >
              Ch???nh s???a th??ng tin c?? nh??n
            </Link>
          )
        },
        {
          key: '3',
          label: <Link to={'/myjob'}>Qu???n l?? c??ng vi???c</Link>
        },
        {
          key: '4',
          label: <Link to={'/wallet'}>Qu???n l?? v??</Link>
        },
        {
          key: '5',
          label: (
            <Link
              to={PATH['HOME_PAGE']}
              onClick={e => {
                e.preventDefault()
                localStorage.removeItem('account')
                dispatch({
                  type: 'LOG_OUT'
                })
                navigate(PATH['HOME_PAGE'])
              }}
            >
              ????ng xu???t
            </Link>
          )
        }
      ]}
    />
  )

  const showModal = () => {
    setIsModalVisibleLogin(true)
  }

  const showModalSignup = () => {
    setIsShowMenu(false)
    setIsModalVisibleSignup(true)
  }

  const handleCancelSignup = () => {
    setIsShowMenu(false)
    setIsModalVisibleSignup(false)
  }

  const handleCancel = () => {
    setIsModalVisibleLogin(false)
  }

  const handleLoginGoogle = async () => {
    const user = await signInWithPopup(auth, ggProvider)
    const isFirstLogin =
      auth.currentUser.metadata.creationTime ===
      auth.currentUser.metadata.lastSignInTime
    let userInfo = user.user
    const { displayName, email, photoURL, uid, providerData } = userInfo
    console.log(userInfo)
    if (isFirstLogin) {
    }
  }

  const handleSignUpGoogle = async () => {
    const user = await signInWithPopup(auth, ggProvider)
    const isFirstLogin =
      auth.currentUser.metadata.creationTime ===
      auth.currentUser.metadata.lastSignInTime
    let userInfo = user.user
    const { displayName, email, photoURL, uid, providerData, accessToken } =
      userInfo
    console.log(userInfo)
    setSignUpUser({
      image: photoURL,
      fullname: displayName,
      email: email
    })
    setIsSignUpSuccess(true)
  }

  const handleSubmitSignUpGoogle = () => {}

  const handleSignUpV2 = data => {
    postAuthen(API['CREATE_ACCOUNT'], {
      phoneNumber: data.phone,
      email: data.email,
      password: data.password,
      role: role
    }).then(result => {
      if (result.status == 201) {
        setIsModalVisibleSignup(false)
        Swal.fire({
          icon: 'success',
          title: 'Th??ng b??o',
          text: '????ng k?? t??i kho???n th??nh c??ng',
          showCancelButton: true,
          confirmButtonText: '????ng nh???p'
        })
          .then(res => {
            if (res.isConfirmed) {
              setIsModalVisibleLogin(true)
            }
          })
          .catch(error => {
            console.log(error)
          })
      }
    })
  }

  const handleLoginV2 = data => {
    postAuthen(API['LOGIN'], {
      email: data.username,
      password: data.passwordLogin,
      isUsePhoneNumber: false
    })
      .then(result => {
        if (result.status == 200) {
          let { data } = result.data
          localStorage.setItem('account', JSON.stringify(data))
          localStorage.setItem('token', JSON.stringify(data.jwtToken))
          dispatch({
            type: 'SET_ACCOUNT',
            payload: data
          })
          // setAccount(data);
          // setInfomation(data);
        }
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'T??i kho???n ho???c m???t kh???u kh??ng ????ng!'
        })
      })
  }

  const handleSearch = () => {
    navigate(
      `/search/candidate?search=1&CategoryId=${selectCategory}&SearchText=${searchInput.current.value}`
    )
  }

  // const getDataAccount = () => {
  //   return JSON.parse(localStorage.getItem("account"));
  // };

  const { Option } = Select

  return (
    <>
      <div className="space"></div>
      <header className="header">
        <div className="header__left">
          <div className="header__logo">
            <Link to={PATH['HOME_PAGE']}>
              <img src="/images/logo.png" alt="" />
            </Link>
          </div>
          <div className="header__search">
            <div className="header__search__service">
              <Select
                defaultValue=""
                suffixIcon={<CaretDownOutlined />}
                dropdownMatchSelectWidth={150}
                onChange={e => {
                  setSelectCategory(e)
                }}
              >
                <Option value="">T???t c??? d???ch v???</Option>
                {category.map(item => {
                  return <Option value={item.id}>{item.name}</Option>
                })}
              </Select>
            </div>
            <div className="header__search__input">
              <input
                type="text"
                placeholder="T??m ki???m ???ng c??? vi??n"
                ref={searchInput}
              />
            </div>
            <div className="header__search__icon" onClick={handleSearch}>
              <SearchOutlined />
            </div>
          </div>
        </div>
        <div className="header__right">
          {data.account ? (
            <>
              <Dropdown overlay={menu} placement="bottom">
                <div className="header__right__info">
                  <div className="avatar">
                    <img
                      src={
                        data.information
                          ? data.information.avatarUrl
                            ? data.information.avatarUrl
                            : data.information.logoUrl
                          : 'https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg'
                      }
                      alt=""
                    />
                  </div>
                  <div className="name">
                    <span>
                      {data.information
                        ? data.information.name
                        : data.account.email}
                    </span>
                  </div>

                  <Link to={PATH['CHAT_PAGE']}>
                    <EmailIcon />
                  </Link>
                </div>
              </Dropdown>

              <Menu mode="horizontal" defaultSelectedKeys={['mail']}>
                <Menu.SubMenu
                  key="SubMenu"
                  title={'Th??ng b??o'}
                  icon={<BellOutlined />}
                >
                  {notification ? (
                    notification.map((item, index) => {
                      if (item.type == 'newJob') {
                        return (
                          <>
                            <Menu.Item key={index} icon={<LoginOutlined />}>
                              {item.Candidate?.name} mu???n ???ng tuy???n v??o d??? ??n{' '}
                              {item.job.name}
                            </Menu.Item>
                          </>
                        )
                      }

                      if (item.type == 'invite') {
                        return (
                          <>
                            <Menu.Item
                              key={index}
                              icon={<LoginOutlined />}
                              onClick={() => {
                                if (!item.IsRead) {
                                  navigate(`/job/${item.JobId}?action=accept`)
                                } else {
                                  Swal.fire('???? ch???p nh???n ho???c t??? ch???i')
                                }
                              }}
                            >
                              {item.enterprise?.name} mu???n m???i b???n v??o d??? ??n{' '}
                              {item.job?.name}
                            </Menu.Item>
                          </>
                        )
                      }

                      if (item.type == 'schedule') {
                        const date = new Date(item.ScheduledTime)
                        return (
                          <>
                            <Menu.Item key={index} icon={<LoginOutlined />}>
                              {item.enterprise?.name} ???? h???n l???ch v???i b???n l??c{' '}
                              {date.toDateString()}
                            </Menu.Item>
                          </>
                        )
                      }
                    })
                  ) : (
                    <Menu.Item key="two" icon={<ClearOutlined />}>
                      Ch??a c?? th??ng b??o n??o!
                    </Menu.Item>
                  )}
                </Menu.SubMenu>
              </Menu>
            </>
          ) : (
            <>
              <div className="header__right__login">
                {/* <Link to={PATH['LOGIN_PAGE']}>
          Log In
        </Link> */}
                <button onClick={showModal}>????ng nh???p </button>
                <Modal
                  title="????ng nh???p v??o Fidou"
                  visible={isModalVisibleLogin}
                  footer={null}
                  onCancel={handleCancel}
                  className="modal"
                >
                  <div
                    className={`modal__input ${
                      !!errorsL.username ? 'modal__input__error' : ''
                    }`}
                  >
                    <p>
                      T??i kho???n ho???c Email
                      <span style={{ color: 'red' }}>*</span>
                    </p>
                    <input type="text" {...registerL('username')} />
                    <p>{errorsL.username?.message}</p>
                  </div>
                  <div
                    className={`modal__input ${
                      !!errorsL.passwordLogin ? 'modal__input__error' : ''
                    }`}
                  >
                    <p>
                      M???t kh???u<span style={{ color: 'red' }}>*</span>
                    </p>
                    <input type="password" {...registerL('passwordLogin')} />
                    <p>{errorsL.passwordLogin?.message}</p>
                  </div>
                  <p className="modal__forgot">
                    <Link to={''}>Qu??n m???t kh???u?</Link>
                  </p>

                  <button
                    className="modal__button"
                    type="button"
                    onClick={handleSubmitL(handleLoginV2)}
                  >
                    ????ng nh???p
                  </button>

                  <div className="modal__or">
                    <span>Ho???c</span>
                  </div>

                  <button className="modal__google" onClick={handleLoginGoogle}>
                    <img src="images/google-icon.webp" alt="" />
                    <span>????ng nh???p v???i Google</span>
                  </button>
                </Modal>
              </div>
              <div className="header__right__signup">
                <button onClick={showModalSignup}>????ng k??</button>
                <Modal
                  title="????ng k?? t??i kho???n"
                  visible={isModalVisibleSignup}
                  footer={null}
                  onCancel={handleCancelSignup}
                  className="modal"
                >
                  <div className={`${isSignUpSuccess ? 'hide' : ''}`}>
                    <div
                      className={`modal__input ${
                        !!errorsR.email ? 'modal__input__error' : ''
                      }`}
                    >
                      <p>
                        Email <span style={{ color: 'red' }}>*</span>
                      </p>
                      <input type="text" {...registerR('email')} />
                      <p>{errorsR.email?.message}</p>
                    </div>
                    <div
                      className={`modal__input ${
                        !!errorsR.phone ? 'modal__input__error' : ''
                      }`}
                    >
                      <p>
                        S??? ??i???n tho???i<span style={{ color: 'red' }}>*</span>
                      </p>
                      <input type="text" {...registerR('phone')} />
                      <p>{errorsR.phone?.message}</p>
                    </div>
                    <div
                      className={`modal__input ${
                        !!errorsR.password ? 'modal__input__error' : ''
                      }`}
                    >
                      <p>
                        M???t kh???u<span style={{ color: 'red' }}>*</span>
                      </p>
                      <input type="password" {...registerR('password')} />
                      <p>{errorsR.password?.message}</p>
                    </div>
                    <div
                      className={`modal__input ${
                        !!errorsR.rePassword ? 'modal__input__error' : ''
                      }`}
                    >
                      <p>
                        Nh???p l???i m???t kh???u<span style={{ color: 'red' }}>*</span>
                      </p>
                      <input type="password" {...registerR('rePassword')} />
                      <p>{errorsR.rePassword?.message}</p>
                    </div>
                    <p style={{ marginTop: '10px' }}>T??i mu???n</p>
                    <div className="select">
                      <h3
                        onClick={() => {
                          setRole(1)
                        }}
                        className={role == 1 ? 'active' : ''}
                      >
                        Thu?? ???ng vi??n
                      </h3>
                      <h3
                        onClick={() => {
                          setRole(0)
                        }}
                        className={role == 0 ? 'active' : ''}
                      >
                        T??m c??ng vi???c
                      </h3>
                    </div>
                    <div
                      className={`policyWrapper ${
                        !!errorsR.acceptCheckbox ? 'policyWrapper__error' : ''
                      }`}
                    >
                      <div className="policy">
                        <input
                          type="checkbox"
                          name=""
                          id="checkbox"
                          {...registerR('acceptCheckbox')}
                        />
                        <label htmlFor="checkbox">Ch???p nh???n ??i???u kho???n.</label>
                        <Link
                          to="/policy"
                          onClick={() => {
                            setIsModalVisibleSignup(false)
                          }}
                        >
                          <InfoIcon fontSize="small" />
                        </Link>
                      </div>
                      <p>{errorsR.acceptCheckbox?.message}</p>
                    </div>
                    <button
                      className="modal__button"
                      type="button"
                      onClick={handleSubmitR(handleSignUpV2)}
                    >
                      ????ng k??
                    </button>
                    <div className="modal__or">
                      <span>Ho???c</span>
                    </div>
                    <button
                      className="modal__google"
                      onClick={handleSignUpGoogle}
                    >
                      <img src="images/google-icon.webp" alt="" />
                      <span>????ng k?? v???i Google</span>
                    </button>
                  </div>

                  <div className={`${isSignUpSuccess ? '' : 'hide'}`}>
                    <div className={`modal__input`}>
                      <p>Please take a moment to complete your account.</p>
                      <div className="info">
                        <div className="info__image">
                          <img src={`${signUpUser.image}`} alt="" />
                        </div>

                        <div className="info__name">
                          <h4>{signUpUser.fullname}</h4>
                          <p>{signUpUser.email}</p>
                        </div>
                      </div>
                      <p style={{ marginTop: '10px' }}>I want to</p>
                      <div className="select">
                        <h3
                          onClick={() => {
                            setRole(1)
                          }}
                          className={role == 1 ? 'active' : ''}
                        >
                          Thu?? ???ng vi??n
                        </h3>
                        <h3
                          onClick={() => {
                            setRole(0)
                          }}
                          className={role == 0 ? 'active' : ''}
                        >
                          T??m c??ng vi???c
                        </h3>
                      </div>

                      <div className={`modal__input `}>
                        <p>S??? ??i???n tho???i</p>
                        <input type="text" ref={phonegg} />
                      </div>
                      <div className={`modal__input `}>
                        <p>M???t kh???u</p>
                        <input type="password" ref={passwordgg} />
                      </div>
                      <div className={`modal__input `}>
                        <p>Nh???p l???i m???t kh???u </p>
                        <input type="password" ref={repasswordgg} />
                      </div>
                    </div>

                    <button
                      style={{ marginTop: '20px' }}
                      className="modal__button"
                      onClick={handleSubmitSignUpGoogle}
                    >
                      ????ng k??
                    </button>
                  </div>
                </Modal>
              </div>
            </>
          )}
        </div>
        <div className="header__bar">
          <BarsOutlined
            onClick={() => {
              setIsShowMenu(true)
            }}
          />
        </div>

        <div
          className={`header__overlay ${isShowMenu ? 'show' : ''}`}
          onClick={() => {
            setIsShowMenu(false)
          }}
        ></div>

        <div className={`header__menu ${isShowMenu ? 'show' : ''}`}>
          <Collapse ghost defaultActiveKey={['1']}>
            <Panel header="Voice Over" key="1" className="header__menu__panel">
              <Link to="/">Animation</Link>
              <Link to="/">Animation</Link>
              <Link to="/">Animation</Link>
              <Link to="/">Animation</Link>
              <Link to="/">Animation</Link>
              <Link to="/">Animation</Link>
            </Panel>
            <Panel header="Audio Production" key="2">
              <Link to="/">Animation</Link>
              <Link to="/">Animation</Link>
              <Link to="/">Animation</Link>
              <Link to="/">Animation</Link>
              <Link to="/">Animation</Link>
              <Link to="/">Animation</Link>
            </Panel>
            <Panel header="Music" key="3">
              <Link to="/">Animation</Link>
              <Link to="/">Animation</Link>
              <Link to="/">Animation</Link>
              <Link to="/">Animation</Link>
              <Link to="/">Animation</Link>
              <Link to="/">Animation</Link>
            </Panel>
          </Collapse>
          <button
            onClick={() => {
              setIsShowMenu(false)
              showModal()
            }}
          >
            ????ng nh???p
          </button>
          <button
            onClick={() => {
              setIsShowMenu(false)
              showModalSignup()
            }}
            className="menu-signup"
          >
            ????ng k??
          </button>
        </div>
      </header>
    </>
  )
}

export default Header
