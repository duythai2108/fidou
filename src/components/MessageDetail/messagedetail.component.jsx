import { Button } from 'antd'
import React, { useContext, useEffect, useRef } from 'react'
import Header from './header.component'
import Message from './message.component'
import {
  onSnapshot,
  collection,
  db,
  query,
  where,
  addDoc,
  doc,
  updateDoc
} from '../../Firebase/config'
import './messagedetail.style.scss'
import { useState } from 'react'
import Progressbar from '../progressbar/progressbar.component'
import { AccountContext } from '../../context/AccountProvider'
import { orderBy, Query, Timestamp } from 'firebase/firestore'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import Swal from 'sweetalert2'
import { uploadFile } from '../../Firebase/service'
import { getAuthen } from '../../axios/authenfunction'
import API from '../../constans/api'
import { async } from '@firebase/util'
import { ORDER_STATUS } from '../../constans/enum'
import { textAlign } from '@mui/system'
import myAxios from '../../axios/config'

function MessageDetail({ onRoom }) {
  let [listMessage, setListMessage] = useState([])

  const accountContext = useContext(AccountContext)
  let { data } = accountContext
  let [message, setMessage] = useState('')
  let [user, setUser] = useState([])
  let messagesEndRef = useRef(null)
  let [order, setOrder] = useState()
  let [schedule, setSchedule] = useState()

  const [candidate, setCandidate] = React.useState(null)

  useEffect(() => {
    console.log('user: ', user)
  }, [user])

  const finishOrder = () => {
    setOrder({ ...order, status: 2 })
  }

  useEffect(() => {
    const fetchUser = async () => {
      await onRoom.user.forEach(async id => {
        console.log('run')
        // console.log(id == data.account.id);
        const isExist = user.filter(item => item.id == id).length > 0
        if (id == data.account.id && !isExist) {
          user.push(data.information)
          setUser([...user])
        } else if (!isExist) {
          if (id) {
            myAxios
              .get(`${API['GET_CANDIDATE_INFO']}${id}`)
              .then(res => {
                setCandidate(res.data?.data)
              })
              .catch(error => {
                setCandidate(null)
              })
          }
          if (data.account.role == '0' && !isExist) {
            await getAuthen(API['GET_ENTERPRISE_INFO'] + id).then(response => {
              user.push(response.data.data)
              setUser([...user])
            })
          }
        }
      })
    }

    const fetchOrder = () => {
      getAuthen(API['GET_ORDER'] + onRoom.orderId, true)
        .then(response => {
          setOrder(response.data.data)
        })
        .catch(error => {})
    }

    fetchUser()
    fetchOrder()
    setListMessage([])
    const q = query(collection(db, 'message'), where('roomId', '==', onRoom.id))
    const unsubscribe = onSnapshot(q, orderBy('timeCreate'), querySnapshot => {
      let newList = querySnapshot.docs.map(doc => {
        return doc.data()
      })

      newList.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return a.timeCreate.seconds - b.timeCreate.seconds
      })
      setListMessage(newList)
    })

    getScheudule()

    return () => {
      unsubscribe()
    }
  }, [onRoom])

  const sentMessage = (type, url) => {
    const date = new Date()
    const dateString =
      date.getDate() +
      '/' +
      date.getMonth() +
      '/' +
      date.getFullYear() +
      ' ' +
      date.getHours() +
      ':' +
      date.getMinutes()

    if (type == 'text' && message.trim().length > 0) {
      addDoc(collection(db, 'message'), {
        message,
        roomId: onRoom.id,
        time: dateString,
        userId: data.account.id,
        timeCreate: new Date(),
        type
      })
      setMessage('')
    } else if (type == 'file') {
      addDoc(collection(db, 'message'), {
        roomId: onRoom.id,
        time: dateString,
        userId: data.account.id,
        timeCreate: new Date(),
        file: url,
        type
      })

      const q = query(
        collection(db, 'file'),
        where('orderId', '==', onRoom.orderId)
      )
      const unsubscribe = onSnapshot(q, querySnapshot => {
        let newList = querySnapshot.docs.map(doc => {
          return { ...doc.data(), id: doc.id }
        })
        if (newList.length == 0) {
          addDoc(collection(db, 'file'), {
            orderId: onRoom.orderId,
            file: url
          })
        } else {
          const washingtonRef = doc(db, 'file', newList[0].id)
          updateDoc(washingtonRef, {
            orderId: onRoom.orderId,
            file: url
          }).then(response => {
            console.log('response: ', response)
          })
        }
        unsubscribe()
      })
    }
  }

  const candidateId =
    data.account?.role == 1
      ? onRoom.user.filter(item => item != data.account.id)[0]
      : data.account.id

  const enterpriseId =
    data.account?.role == 0
      ? onRoom.user.filter(item => item != data.account.id)[0]
      : data.account.id

  const getScheudule = () => {
    getAuthen(API['GET_SCHEDULE_ORDER'] + `${onRoom.orderId}`)
      .then(response => {
        let date = new Date(response.data.data.scheduledTime)
        response.data.data.scheduledTime =
          date.toDateString() + ' ' + date.toLocaleTimeString()
        setSchedule(response.data.data)
      })
      .catch(error => {
        setSchedule()
      })
  }

  return (
    <div className="message-detail">
      <Header
        orderId={onRoom.orderId}
        title={onRoom.title}
        description={onRoom.description}
        status={order?.status}
        onRoom={onRoom}
        candidateId={candidateId}
        setSchedule={setSchedule}
        finishOrder={finishOrder}
      />
      {/* <Progressbar /> */}

      <h1 style={{ color: 'white', textAlign: 'center' }}>
        {ORDER_STATUS[order?.status]?.title}
      </h1>

      {schedule ? (
        <h3 style={{ color: 'white', textAlign: 'center' }}>
          Đã đặt lịch hẹn lúc {schedule?.scheduledTime.toString()}
        </h3>
      ) : (
        <></>
      )}

      <div className="message-detail__message">
        {listMessage.map((item, index) => {
          // console.log(item)
          return (
            <Message
              candidate={candidate}
              user={user.filter(user => user?.id == item.userId)[0]}
              key={index}
              text={item.message}
              createAt={item.time}
              isMe={item.userId === data.account.id}
              type={item.type}
              src={item.file}
              status={order?.status}
            />
          )
        })}
        <div ref={messagesEndRef}></div>
        {messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })}
      </div>
      {order?.status == 1 ? (
        <div className="message-detail__input">
          <input
            type="text"
            value={message}
            onChange={e => {
              setMessage(e.target.value)
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && e.target.value != '') {
                sentMessage('text')
              }
            }}
          />

          <AttachFileIcon
            style={{ marginRight: '10px' }}
            onClick={() => {
              Swal.fire({
                title: 'Đăng file',
                showDenyButton: true,
                html: "<input type='file' id='file-chat'/>",
                confirmButtonText: 'Save',
                denyButtonText: `Don't save`
              }).then(result => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                  const file = document.getElementById('file-chat')
                  const url = uploadFile(
                    file.files[0],
                    data.account?.id + new Date(),
                    'audio/mpeg'
                  )

                  url.then(response => {
                    sentMessage('file', response)
                  })
                }
              })
            }}
          />
          <Button
            ghost
            onClick={() => {
              sentMessage('text')
            }}
          >
            Gửi
          </Button>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default MessageDetail
