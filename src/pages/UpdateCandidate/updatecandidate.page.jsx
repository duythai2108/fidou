import React, { useContext, useEffect, useReducer, useState } from 'react'
import Row from '../../components/Row/row.component'
import UpdateTemplate from '../../components/UpdateTemplate/updatetemplate.component'
import { Checkbox } from 'antd'
import './updatecandidate.style.scss'
import API from '../../constans/api'
import { getAuthen, postAuthen, putAuthen } from '../../axios/authenfunction'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { AccountContext } from '../../context/AccountProvider'
import { checkEmail, checkSocial } from '../../Utils/validation'

import { yupResolver } from '@hookform/resolvers/yup'
import yup from '../../validator/yup'
import { useForm } from 'react-hook-form'

const fieldReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE_FIELD':
      console.log(action.payload.value)
      state[action.payload.field] = action.payload.value
      return {
        ...state
      }
    case 'SET_DATA':
      console.log('set data')
      console.log(action.payload)
      return {
        ...state,
        id: action.payload.id,
        description: action.payload.description,
        fullname: action.payload.name,
        facebook: action.payload.facebookUrl,
        instagram: action.payload.instagramUrl,
        twitter: action.payload.twitterUrl,
        linked: action.payload.linkedinUrl,
        accent: action.payload.accent,
        dob: action.payload.dob?.split('T')[0],
        provice: action.payload.provinceName,
        email: action.payload.emailContact,
        phone: action.payload.phoneContact,
        gender: action.payload.gender,
        avatarUrl: action.payload.avatarUrl
      }
    default:
      return state
  }
}

const prepareDataReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_DATA':
      return {
        ...state,
        provices: action.payload.provices,
        sub: action.payload.sub
      }
    default:
      return state
  }
}

//  --- SCHEMA ---
const validationSchema = yup.OBJECT({
  description: yup.DESCRIPTION,
  fullname: yup.FULL_NAME,
  facebook: yup.FACEBOOK,
  instagram: yup.INSTAGRAM,
  twitter: yup.TWITTER,
  linked: yup.LINKEDIN,
  accent: yup.VOICE_QUALITY,
  dob: yup.DOB,
  province: yup.PROVINCE,
  email: yup.EMAIL,
  phone: yup.PHONE_NUMBER
})
//  --- END - SCHEMA ---

function UpdateCandidate() {
  let { id } = useParams()
  const CheckboxGroup = Checkbox.Group
  let [plainOptions, setPlainOptions] = useState([])
  const [defaultCheckedList, setDefaultCheckedList] = useState([])
  const navigate = useNavigate()

  const accountContext = useContext(AccountContext)
  let { data, dispatch } = accountContext

  let [prepareData, prepareDateDispatch] = useReducer(prepareDataReducer, {
    provices: [],
    sub: []
  })

  let [fields, fieldsDispatch] = useReducer(fieldReducer, {
    id: null,
    description: null,
    fullname: null,
    facebook: null,
    instagram: null,
    twitter: null,
    linked: null,
    accent: null,
    dob: null,
    provice: null,
    email: null,
    phone: null,
    gender: ''
  })

  //  --- APPLY SCHEMA TO FORM ---
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(validationSchema),
    defaultValues: fields
  })
  //  --- END - APPLY SCHEMA TO FORM ---

  useEffect(() => {
    if (data.account) {
      getAuthen(API['GET_CANDIDATE_INFO'] + `${data.account.id}`)
        .then(response => {
          fieldsDispatch({
            type: 'SET_DATA',
            payload: response.data.data
          })
          setCheckedList(response.data.data.subCategorieNames)
          const temp = { ...response.data.data }
          temp.dob = response.data.data?.dob?.split('T')[0]
          reset(temp)
        })
        .catch(() => {
          reset({
            description: '',
            fullname: '',
            facebook: '',
            instagram: '',
            twitter: '',
            linked: '',
            accent: '',
            dob: '',
            province: '',
            email: '',
            phone: ''
          })
        })
    }
    console.log(data)
  }, [data])

  useEffect(() => {
    async function fetchData() {
      const [proviceRequest, subRequest] = await Promise.all([
        getAuthen(API['GET_PROVICES']),
        getAuthen(API['GET_SUBCATEGORY'])
      ])

      prepareDateDispatch({
        type: 'FETCH_DATA',
        payload: {
          provices: proviceRequest.data.data,
          sub: subRequest.data.data
        }
      })

      setPlainOptions(subRequest.data.data.map(item => item.name))
    }
    fetchData()
  }, [data])

  const [checkedList, setCheckedList] = useState(defaultCheckedList)
  const [indeterminate, setIndeterminate] = useState(true)
  const [checkAll, setCheckAll] = useState(false)

  const onChange = list => {
    setCheckedList(list)
    setIndeterminate(!!list.length && list.length < plainOptions.length)
    setCheckAll(list.length === plainOptions.length)
  }

  const onCheckAllChange = e => {
    setCheckedList(e.target.checked ? plainOptions : [])
    setIndeterminate(false)
    setCheckAll(e.target.checked)
  }

  useEffect(() => {
    console.log(data)
  }, [data])

  const handelUpdateCandidateDataV2 = data => {
    let subCategoryIds = []
    checkedList.forEach(item => {
      prepareData.sub
        .filter(item2 => item2.name === item)
        .forEach(category => {
          subCategoryIds.push(category.id)
        })
    })

    const index = prepareData.provices.findIndex(
      item => item.name == data.province
    )

    const payload = {
      description: data.description,
      name: data.fullname,
      gender: Number(fields.gender),
      dob: new Date(data.dob),
      avatarUrl: fields.avatarUrl,
      accent: Number(data.accent),
      phoneContact: data.phone,
      emailContact: data.email,
      facebookUrl: data.facebook,
      twitterUrl: data.twitter,
      instagramUrl: data.instagram,
      linkedinUrl: data.linked,
      provinceCode: prepareData.provices[index]?.code,
      subCategoryIds: subCategoryIds
    }

    payload.dob = payload.dob.toISOString()

    if (fields.id == null) {
      postAuthen(API['POST_CANDIDATE_INFO'], payload, true)
        .then(response => {
          Swal.fire(
            'Thông báo',
            'Bạn đã cập nhật thông tin thành công!',
            'success'
          ).then(result => {
            console.log(result)
            dispatch({
              type: 'SET_INFOMATION',
              payload: response.data.data
            })
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              console.log('go to home')
              navigate('/')
            }
          })
        })
        .catch(error => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Vui lòng điền đầy đủ tất cả thông tin!'
          })
        })
    } else {
      putAuthen(API['POST_CANDIDATE_INFO'], payload, true)
        .then(response => {
          dispatch({
            type: 'SET_INFOMATION',
            payload: response.data.data
          })
          Swal.fire(
            'Thông báo',
            'Bạn đã cập nhật thông tin thành công!',
            'success'
          )
        })
        .catch(error => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Vui lòng điền đầy đủ tất cả thông tin!'
          })
        })
    }
  }

  const handelUpdateCandidateData = e => {
    let subCategoryIds = []
    checkedList.forEach(item => {
      prepareData.sub
        .filter(item2 => item2.name === item)
        .forEach(category => {
          subCategoryIds.push(category.id)
        })
    })

    const index = prepareData.provices.findIndex(
      item => item.name == fields.provice
    )
    console.log('index: ' + index)
    console.log('provice code: ' + prepareData.provices[index])

    const payload = {
      description: fields.description,
      name: fields.fullname,
      gender: Number(fields.gender),
      dob: new Date(fields.dob),
      avatarUrl: fields.avatarUrl,
      accent: Number(fields.accent),
      phoneContact: fields.phone,
      emailContact: fields.email,
      facebookUrl: fields.facebook,
      twitterUrl: fields.twitter,
      instagramUrl: fields.instagram,
      linkedinUrl: fields.linked,
      provinceCode: prepareData.provices[index]?.code,
      subCategoryIds: subCategoryIds
    }

    if (!(new Date() - payload.dob > 567648000000)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Không thể đăng kí cho người dưới 18 tuổi!'
      })
      return
    } else {
      payload.dob = payload.dob.toISOString()
    }

    console.clear()
    console.log(payload)

    for (const [key, value] of Object.entries(payload)) {
      if (value == null) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `Vui lòng điền ${key}!`
        })
        console.log(key)
        return
      }
    }

    // if(!payload.name.match(/^([a-zA-Z]+\s)*[a-zA-Z]+$/)){
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Tên không được chứa kí tự đặc biệt hoặc số!",
    //   });
    //   return;
    // }

    // if(!checkSocial(payload.facebookUrl)){
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Facebook không hợp lệ!",
    //   });
    //   return;
    // }

    // if(!checkSocial(payload.instagramUrl)){
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Instagram không hợp lệ!",
    //   });
    //   return;
    // }

    // if(!checkSocial(payload.twitterUrl)){
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Twitter không hợp lệ!",
    //   });
    //   return;
    // }

    // if(!checkSocial(payload.linkedinUrl)){
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Linked In không hợp lệ!",
    //   });
    //   return;
    // }

    // if (!checkEmail(payload.emailContact)) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Email chưa đúng  định dạng!",
    //   });
    //   return;
    // }

    if (fields.id == null) {
      postAuthen(API['POST_CANDIDATE_INFO'], payload, true)
        .then(response => {
          Swal.fire(
            'Thông báo',
            'Bạn đã cập nhật thông tin thành công!',
            'success'
          ).then(result => {
            console.log(result)
            dispatch({
              type: 'SET_INFOMATION',
              payload: response.data.data
            })
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              console.log('go to home')
              navigate('/')
            }
          })
        })
        .catch(error => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Vui lòng điền đầy đủ tất cả thông tin!'
          })
        })
    } else {
      putAuthen(API['POST_CANDIDATE_INFO'], payload, true)
        .then(response => {
          dispatch({
            type: 'SET_INFOMATION',
            payload: response.data.data
          })
          Swal.fire(
            'Thông báo',
            'Bạn đã cập nhật thông tin thành công!',
            'success'
          )
        })
        .catch(error => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Vui lòng điền đầy đủ tất cả thông tin!'
          })
        })
    }
  }
  return (
    <div className="updatecandidate">
      <UpdateTemplate
        saveFunction={handleSubmit(handelUpdateCandidateDataV2)}
        fieldsDispatch={fieldsDispatch}
        fields={fields}
        imgField={'avatarUrl'}
      >
        <div className="box">
          <Row justifyContent={'center'}>
            <h3>Thông tin</h3>
          </Row>
          <Row justifyContent={'between'}>
            <div className={`item ${!!errors.fullname ? 'item__error' : ''}`}>
              <label htmlFor="">Họ và tên: </label>
              <input
                {...register('fullname')}
                type="text"
                value={fields.fullname}
                onChange={e => {
                  fieldsDispatch({
                    type: 'CHANGE_FIELD',
                    payload: {
                      field: 'fullname',
                      value: e.target.value
                    }
                  })
                }}
              />
              <p>{errors.fullname?.message}</p>
            </div>
            <div className={`item`}>
              <label htmlFor="">Giới tính: </label>
              <select
                name=""
                id=""
                onChange={e => {
                  fieldsDispatch({
                    type: 'CHANGE_FIELD',
                    payload: {
                      field: 'gender',
                      value: e.target.value
                    }
                  })
                }}
              >
                <option disabled selected value>
                  -- Chọn --
                </option>
                <option value="0" selected={fields.gender == 0}>
                  Nam
                </option>
                <option value="1" selected={fields.gender == 1}>
                  Nữ
                </option>
                <option value="2" selected={fields.gender == 2}>
                  Khác
                </option>
              </select>
            </div>
          </Row>

          <Row justifyContent={'between'}>
            <div className={`item ${!!errors.dob ? 'item__error' : ''}`}>
              <label htmlFor="">Ngày sinh: </label>
              <input
                {...register('dob')}
                type="date"
                value={fields.dob}
                onChange={e => {
                  fieldsDispatch({
                    type: 'CHANGE_FIELD',
                    payload: {
                      field: 'dob',
                      value: e.target.value
                    }
                  })
                }}
              />
              <p>{errors.dob?.message}</p>
            </div>
            <div className={`item ${!!errors.province ? 'item__error' : ''}`}>
              <label htmlFor="">Thành phố: </label>
              <select
                {...register('province')}
                onChange={e => {
                  fieldsDispatch({
                    type: 'CHANGE_FIELD',
                    payload: {
                      field: 'provice',
                      value: e.target.value
                    }
                  })
                }}
                value={fields.provice}
              >
                <option disabled selected value="">
                  -- Chọn --
                </option>
                {prepareData.provices?.map((item, index) => {
                  return (
                    <option
                      value={item.name}
                      key={index}
                      selected={fields.provice == item.name}
                    >
                      {item.name}
                    </option>
                  )
                })}
              </select>
              <p>{errors.province?.message}</p>
            </div>
          </Row>

          <Row justifyContent={'between'}>
            <div className={`item ${!!errors.phone ? 'item__error' : ''}`}>
              <label htmlFor="">Số điện thoại: </label>
              <input
                {...register('phone')}
                type="text"
                value={fields.phone}
                onChange={e => {
                  fieldsDispatch({
                    type: 'CHANGE_FIELD',
                    payload: {
                      field: 'phone',
                      value: e.target.value
                    }
                  })
                }}
              />
              <p>{errors.phone?.message}</p>
            </div>
            <div className={`item ${!!errors.email ? 'item__error' : ''}`}>
              <label htmlFor="">Email liên hệ: </label>
              <input
                {...register('email')}
                type="text"
                value={fields.email}
                onChange={e => {
                  fieldsDispatch({
                    type: 'CHANGE_FIELD',
                    payload: {
                      field: 'email',
                      value: e.target.value
                    }
                  })
                }}
              />
              <p>{errors.email?.message}</p>
            </div>
          </Row>

          <Row>
            <div className={`item full ${!!errors.email ? 'item__error' : ''}`}>
              <label htmlFor="">Mô tả: </label>
              <textarea
                {...register('description')}
                cols="10"
                rows="5"
                value={fields.description}
                onChange={e => {
                  fieldsDispatch({
                    type: 'CHANGE_FIELD',
                    payload: {
                      field: 'description',
                      value: e.target.value
                    }
                  })
                }}
              ></textarea>
              <p>{errors.description?.message}</p>
            </div>
          </Row>
        </div>

        <div className="box">
          <Row justifyContent={'center'}>
            <h3>Kĩ năng</h3>
          </Row>
          <Row justifyContent={'center'}>
            <div className={`item full ${!!errors.email ? 'item__error' : ''}`}>
              <label htmlFor="">Chất giọng: </label>
              <select
                {...register('accent')}
                onChange={e => {
                  fieldsDispatch({
                    type: 'CHANGE_FIELD',
                    payload: {
                      field: 'accent',
                      value: e.target.value
                    }
                  })
                }}
              >
                <option disabled selected value="">
                  -- Chọn --
                </option>
                <option value="0" selected={fields.accent == 0}>
                  Miền bắc
                </option>
                <option value="1" selected={fields.accent == 1}>
                  Miền trung
                </option>
                <option value="2" selected={fields.accent == 2}>
                  Miền nam
                </option>
                <option value="3" selected={fields.accent == 3}>
                  Miền tây
                </option>
              </select>
              <p>{errors.accent?.message}</p>
            </div>
          </Row>

          <Row justifyContent={'center'}>
            <CheckboxGroup
              options={plainOptions}
              value={checkedList}
              onChange={onChange}
            />
            {/* <Checkbox
              indeterminate={indeterminate}
              onChange={onCheckAllChange}
              checked={checkAll}
            >
              Check all
            </Checkbox> */}
          </Row>
        </div>

        <div className="box">
          <Row justifyContent={'center'}>
            <h3>Mạng xã hội</h3>
          </Row>
          <Row justifyContent={'between'}>
            <div className={`item ${!!errors.facebook ? 'item__error' : ''}`}>
              <label htmlFor="">Facebook: </label>
              <input
                {...register('facebook')}
                type="text"
                value={fields.facebook}
                onChange={e => {
                  fieldsDispatch({
                    type: 'CHANGE_FIELD',
                    payload: {
                      field: 'facebook',
                      value: e.target.value
                    }
                  })
                }}
              />
              <p>{errors.facebook?.message}</p>
            </div>
            <div className={`item ${!!errors.instagram ? 'item__error' : ''}`}>
              <label htmlFor="">Instagram: </label>
              <input
                {...register('instagram')}
                type="text"
                value={fields.instagram}
                onChange={e => {
                  fieldsDispatch({
                    type: 'CHANGE_FIELD',
                    payload: {
                      field: 'instagram',
                      value: e.target.value
                    }
                  })
                }}
              />
              <p>{errors.instagram?.message}</p>
            </div>
          </Row>
          <Row justifyContent={'between'}>
            <div className={`item ${!!errors.linked ? 'item__error' : ''}`}>
              <label htmlFor="">Linked In: </label>
              <input
                {...register('linked')}
                type="text"
                value={fields.linked}
                onChange={e => {
                  fieldsDispatch({
                    type: 'CHANGE_FIELD',
                    payload: {
                      field: 'linked',
                      value: e.target.value
                    }
                  })
                }}
              />
              <p>{errors.linked?.message}</p>
            </div>
            <div className={`item ${!!errors.twitter ? 'item__error' : ''}`}>
              <label htmlFor="">Twitter: </label>
              <input
                {...register('twitter')}
                type="text"
                value={fields.twitter}
                onChange={e => {
                  fieldsDispatch({
                    type: 'CHANGE_FIELD',
                    payload: {
                      field: 'twitter',
                      value: e.target.value
                    }
                  })
                }}
              />
              <p>{errors.twitter?.message}</p>
            </div>
          </Row>
        </div>
      </UpdateTemplate>
    </div>
  )
}

export default UpdateCandidate
