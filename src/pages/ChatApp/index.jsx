import React, { useContext, useEffect, useState } from 'react'
import UserInfo from '../../components/UserInfo/userinfo.component'
import RoomList from '../../components/RoomList/roomlist.component'
import MessageDetail from '../../components/MessageDetail/messagedetail.component'
import {
  addDoc,
  collection,
  db,
  onSnapshot,
  query,
  where
} from '../../Firebase/config'
import './style.scss'
import { useNavigate } from 'react-router-dom'
import { AccountContext } from '../../context/AccountProvider'
function Chat() {
  let [room, setRoom] = useState([])
  let [onRoom, setOnRoom] = useState('')
  let navigate = useNavigate()

  const accountContext = useContext(AccountContext)
  const { data } = accountContext

  // eslint-disable-next-line react-hooks/exhaustive-deps

  const listenRoom = () => {
    const q = query(
      collection(db, 'room'),
      where('user', 'array-contains-any', [data.account ? data.account.id : ''])
    )

    const unsubscribe = onSnapshot(q, querySnapshot => {
      // Respond to data
      // ...
      let rooms = []
      querySnapshot?.forEach((doc, index) => {
        rooms.push({ ...doc.data(), id: doc.id })
      })
      if (room.length != rooms.length) {
        setRoom(rooms)
      }
    })
  }

  useEffect(() => {
    listenRoom()
  }, [data])
  return (
    <div className="chat">
      <div className="chat__sidebar">
        <UserInfo />
        <RoomList room={room} setOnRoom={setOnRoom} onRoom={onRoom} />
      </div>
      <div className="chat__message">
        {onRoom ? <MessageDetail onRoom={onRoom} /> : <></>}
      </div>
    </div>
  )
}

export default Chat
