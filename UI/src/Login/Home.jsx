import React from 'react'
import Header from '../Page/Menu';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPlus, faPlusCircle, faPlusSquare, faCheck } from '@fortawesome/free-solid-svg-icons';
import IconButton from "@mui/material/IconButton";
import { FaSignOutAlt } from 'react-icons/fa';

function Home() {

  const handleMenu = (path, reqType) => {
    if (reqType === 'LOCT' || reqType === 'IECT') {
      localStorage.setItem('TYPE_ACTION', 'ADD')
      localStorage.setItem('TYPEDOC', reqType)
      localStorage.setItem('LOCT_IECT_NO', '')
    }

    window.location.href = path;
  };

  return (
    <div>
      <Header></Header>
      <div className='Aear'>
        <div className='AearLeftRight'></div>
        <div className='AearCenter'>
          <div className='cHead'>LOCT / IECT System</div>
          <div className='cHome' onClick={() => handleMenu('/LOCTSystem/Transaction?P_TYPE=ISSUE','')}>
            <div className='dHomeAppF'>
              <FontAwesomeIcon icon={faHome} style={{ fontSize: '30px', backgroundColor: '#818892', padding: '0.2rem', borderRadius: '4px', color: '#fff' }} />
            </div>
            <div className='dHomeAppE'>
              <div>Home</div>
              <div>LOCT/IECT Home Page</div>
            </div>
          </div>
          <div className='cNew'>
            <div className='cNLOCT' onClick={() => handleMenu(`/LOCTSystem/Transaction/Maintain`,'LOCT')}>
              <div className='dNewF'>
                <FontAwesomeIcon icon={faPlus} style={{ fontSize: '30px', backgroundColor: '#a0712e', padding: '0.2rem', borderRadius: '4px', color: '#fff' }} />
              </div>
              <div className='dNewE'>
                <div>LOCT</div>
                <div>Issue New LOCT & SGT</div>
              </div>
            </div>
            <div className='cNIECT' onClick={() => handleMenu(`/LOCTSystem/Transaction/Maintain`,'IECT')}>
              <div className='dNewF'>
                <FontAwesomeIcon icon={faPlus} style={{ fontSize: '30px', backgroundColor: '#49d3ac', padding: '0.2rem', borderRadius: '4px', color: '#fff' }} />
              </div>
              <div className='dNewE'>
                <div>IECT</div>
                <div>Issue New IECT & SGT</div>
              </div>
            </div>
          </div>
          <div className='cApprove' onClick={() => handleMenu('/LOCTSystem/Transaction?P_TYPE=APPROVE','')}>
            <div className='dHomeAppF'>
              <FontAwesomeIcon icon={faCheck} style={{ fontSize: '30px', backgroundColor: '#f05151', padding: '0.2rem', borderRadius: '4px', color: '#fff' }} />
            </div>
            <div className='dHomeAppE'>
              <div>Approve</div>
              <div>LOCT/IECT Approve</div>
            </div>
          </div>
        </div>
        <div className='AearLeftRight'></div>

      </div>
    </div>
  )
}

export default Home