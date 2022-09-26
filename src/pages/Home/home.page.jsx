import React from 'react'
import { Link } from 'react-router-dom'
import Background from '../../components/Background/background.component'
import DropdownList from '../../components/DropdownList/dropdowlist.component'
import HomeBrand from '../../components/HomeBrand/homeBrand.component'
import HomeInfo from '../../components/HomeInfo/homeInfo.component'
import TalenList from '../../components/TalenList/talenlist.component'
import PATH from '../../constans/path'
function Home() {
  return (
    <div>
      <DropdownList />
      <Background />
      <HomeBrand />
      <HomeInfo />
      <TalenList />
    </div>
  )
}

export default Home
