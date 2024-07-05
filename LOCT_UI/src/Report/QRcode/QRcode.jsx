import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../Page/Menu';
import PageLoad from '../../Page/PageLoad';
import QRCode from 'qrcode.react';

function QRcode() {
    const [currentUrl, setCurrentUrl] = useState('');

    useEffect(() => {
        setCurrentUrl(window.location.hostname + '/LOCTSystem');
    }, []);

    return (
        <div>
            <Header></Header>
            <div className='Aear' style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                <div className='AearLeftRightTM'></div>
                <div className='AearCenterTM' >
                    <div style={{ display: 'flex', justifyContent: 'left',alignItems: 'flex-end' }}>
                        <div style={{ backgroundColor: '#ffffff', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px',marginRight: '10px' }}><QRCode value={currentUrl} size={300} /></div>
                        <div style={{fontFamily: 'calibri Light', fontSize: '16px',display: 'block', width: '100%', borderBottom: '1px solid #000'}}>
                            <div style={{fontFamily: 'Tw Cen MT', fontWeight: 'bold', fontSize: '30px'}}>LOCT/IECT System</div>
                            <div>{currentUrl}</div>
                        </div>
                    </div>

                </div>
                <div className='AearLeftRightTM'></div>
            </div>
        </div>
    )
}

export default QRcode