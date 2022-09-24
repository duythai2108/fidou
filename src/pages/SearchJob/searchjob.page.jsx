import React, { useContext, useEffect, useReducer, useState } from 'react'
import { getAuthen, getParam } from '../../axios/authenfunction'
import Job from '../../components/Job/job.component'
import JobDetail from '../../components/JobDetail/jobdetail.component'
import API from '../../constans/api'
import { AccountContext } from '../../context/AccountProvider'
import './searchjob.style.scss'

import { yupResolver } from '@hookform/resolvers/yup'
import yup from '../../validator/yup'
import { useForm } from 'react-hook-form'

const queryReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIELD':
      state[action.payload.field] = action.payload.value
      return {
        ...state
      }
    default:
      return state
  }
}

//  --- SCHEMA ---
const validationSchema = yup.OBJECT({
  min: yup.MIN_PRICE,
  max: yup.MAX_PRICE,
  minAge: yup.MIN_AGE,
  maxAge: yup.MAX_AGE
})
//  --- END - SCHEMA ---

const SearchJob = () => {
  let [categories, setCategories] = useState([])
  let [subCategories, setSubCategories] = useState([])
  let [candidates, setCandidates] = useState([])
  const accountContext = useContext(AccountContext)
  const { data } = accountContext
  let [query, queryDispatch] = useReducer(queryReducer, {
    category: '',
    subCategory: '',
    min: '',
    max: '',
    tone: '',
    gender: '',
    minAge: '',
    maxAge: ''
  })

  //  --- APPLY SCHEMA TO FORM ---
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(validationSchema),
    defaultValues: query
  })
  //  --- END - APPLY SCHEMA TO FORM ---

  const search = hookFormData => {
    console.log(
      `TinNguyen:  ===> file: searchjob.page.jsx ===> line 65 ===> hookFormData`,
      hookFormData
    )
    let fullQuery = '?'

    if (query.category != '') {
      fullQuery += `&CategoryId=${query.category}`
    }

    if (query.gender != '') {
      fullQuery += `&Gender=${query.gender}`
    }

    if (query.subCategory != '') {
      fullQuery += `&SubCategoryId=${query.subCategory}`
    }

    if (hookFormData && hookFormData.min) {
      fullQuery += `&MinPrice=${hookFormData.min}`
    }

    if (hookFormData && hookFormData.max) {
      fullQuery += `&MaxPrice=${hookFormData.max}`
    }

    if (hookFormData && hookFormData.minAge) {
      fullQuery += `&MinAge=${hookFormData.minAge}`
    }

    if (hookFormData && hookFormData.maxAge) {
      fullQuery += `&MaxAge=${hookFormData.maxAge}`
    }

    if (query.tone != '') {
      fullQuery += `&Tone=${query.tone}`
    }

    getParam(API['GET_JOB_FILTER'], fullQuery).then(response => {
      console.log(response.data.data)
      setCandidates(response.data.data)
    })
  }

  useEffect(() => {
    console.log(query)
  }, [query])

  useEffect(() => {
    getAuthen(API['GET_SUBCATEGORY']).then(response => {
      setCategories(response.data.data)
    })
    getAuthen(API['GET_CATEGORY']).then(response => {
      setSubCategories(response.data.data)
    })
    search()
  }, [])

  return (
    <div className="search-job">
      <div className="left">
        <div className="item">
          <h3>Tất cả dịch vụ</h3>
          <div className="list-service">
            <h4
              className={query?.category == '' ? 'active' : ''}
              onClick={() => {
                queryDispatch({
                  type: 'SET_FIELD',
                  payload: {
                    field: 'category',
                    value: ''
                  }
                })
              }}
            >
              Tất cả
            </h4>
            {subCategories.map((item, index) => {
              return (
                <h4
                  className={query?.category == item.id ? 'active' : ''}
                  onClick={() => {
                    queryDispatch({
                      type: 'SET_FIELD',
                      payload: {
                        field: 'category',
                        value: item.id
                      }
                    })
                  }}
                >
                  {item.name}
                </h4>
              )
            })}
          </div>
        </div>

        <div className="item">
          <h3>Kĩ năng</h3>
          <select
            name=""
            id=""
            onChange={e => {
              queryDispatch({
                type: 'SET_FIELD',
                payload: {
                  field: 'subCategory',
                  value: e.target.value
                }
              })
            }}
            value={query.subCategory}
          >
            <option selected value="">
              Tất cả
            </option>
            {categories
              .filter(
                i => i.categoryId == query.category || query.category == ''
              )
              .map((category, index) => {
                return (
                  <option value={category.id} key={index}>
                    {category.name}
                  </option>
                )
              })}
          </select>
        </div>

        <div className="item">
          <h3>Giá từ</h3>
          <input
            {...register('min')}
            className={`${!!errors.min ? 'errorInput' : ''}`}
            type="number"
            value={query?.min}
            onChange={e => {
              queryDispatch({
                type: 'SET_FIELD',
                payload: {
                  field: 'min',
                  value: e.target.value
                }
              })
            }}
          />
          <p className="errorMessage">{errors.min?.message}</p>
        </div>

        <div className="item">
          <h3>Đến</h3>
          <input
            {...register('max')}
            className={`${!!errors.max ? 'errorInput' : ''}`}
            type="number"
            value={query?.max}
            onChange={e => {
              queryDispatch({
                type: 'SET_FIELD',
                payload: {
                  field: 'max',
                  value: e.target.value
                }
              })
            }}
          />
          <p className="errorMessage">{errors.max?.message}</p>
        </div>

        <div className="item">
          <h3>Độ tuổi từ </h3>
          <input
            {...register('minAge')}
            className={`${!!errors.minAge ? 'errorInput' : ''}`}
            type="number"
            onChange={e => {
              queryDispatch({
                type: 'SET_FIELD',
                payload: {
                  field: 'minAge',
                  value: e.target.value
                }
              })
            }}
          />
          <p className="errorMessage">{errors.minAge?.message}</p>
          <h3>đến</h3>
          <input
            {...register('maxAge')}
            className={`${!!errors.maxAge ? 'errorInput' : ''}`}
            type="number"
            onChange={e => {
              queryDispatch({
                type: 'SET_FIELD',
                payload: {
                  field: 'maxAge',
                  value: e.target.value
                }
              })
            }}
          />
          <p className="errorMessage">{errors.maxAge?.message}</p>
        </div>

        <div className="item">
          <h3>Giới tính</h3>
          <select
            name=""
            id=""
            value={query.gender}
            onChange={e => {
              queryDispatch({
                type: 'SET_FIELD',
                payload: {
                  field: 'gender',
                  value: e.target.value
                }
              })
            }}
          >
            <option selected value="">
              Tất cả
            </option>
            <option value="0">Nam</option>
            <option value="1">Nữ</option>
          </select>
        </div>

        <div className="item">
          <h3>Tone</h3>
          <select
            name=""
            id=""
            onChange={e => {
              queryDispatch({
                type: 'SET_FIELD',
                payload: {
                  field: 'tone',
                  value: e.target.value
                }
              })
            }}
          >
            <option selected value="">
              Tất cả
            </option>
            <option value="0">Giọng trầm</option>
            <option value="1">Giọng vừa</option>
            <option value="2">Giọng cao</option>
          </select>
        </div>

        <button className="button" onClick={handleSubmit(search)}>
          Tìm kiếm
        </button>
      </div>
      <div className="right">
        <h2>Danh sách công việc</h2>
        {candidates.map((item, index) => {
          return (
            <Job
              title={item.name}
              description={item.description}
              key={index}
              day={item.dayDuration}
              hours={item.hourDuration}
              minute={item.minuteDuration}
              price={item.price}
              id={item.id}
              listTalen={item.orders}
              jobId={item.id}
              jobName={item.name}
              tone={item.tone}
              gender={item.gender}
              minAg={item.minAge}
              maxAge={item.maxAge}
              jobStatus={item.jobStatus}
              showAddtofavorite={data?.account?.role == '0'}
            />
          )
        })}
      </div>
    </div>
  )
}

export default SearchJob
