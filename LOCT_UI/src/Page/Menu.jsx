import React, { useState, useEffect, useRef } from 'react';
import './Menu.css';
import Logo from '../Images/LOCTSystem.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint, faQrcode } from '@fortawesome/free-solid-svg-icons';
import IconButton from "@mui/material/IconButton";
import { FaSignOutAlt } from 'react-icons/fa';
import PopupConfirm from '../Common/Popconfirm';

function Menu() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSubMenu, setActiveSubMenu] = useState(null);
    const navRef = useRef();

    const toggleSidebar = (path) => {

        if (path !== null && path !== '') {
            window.location.href = path;
        } else {
            setIsOpen(!isOpen);

        }

    };

    const handleSubMenuToggle = (index) => {
        setActiveSubMenu(activeSubMenu === index ? null : index);
    };

    const handleClickOutside = (event) => {
        if (navRef.current && !navRef.current.contains(event.target)) {
            setIsOpen(false);
            setActiveSubMenu(null);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const [visible, setVisible] = useState(false);
    const [strMessage, setstrMessage] = useState('');

    const handleConfirm = () => {
        setVisible(false);
        localStorage.setItem("emp_id", '');
        localStorage.setItem("emp_name", '');
        localStorage.setItem("emp_fname", '');
        localStorage.setItem("emp_sname", '');
        localStorage.setItem("emp_user", '');
        localStorage.setItem("emp_fac_code", '');
        localStorage.setItem("emp_fac_desc", '');
        localStorage.setItem("emp_cc", '');
        localStorage.setItem("emp_status", '');
        window.location.href = `/LOCTSystem`;

    };

    const handleCancel = () => {
        setVisible(false);
    };

    const showConfirm = (Message) => {
        setstrMessage(Message);
        setVisible(true);

    };

    const handleLogout = () => {

    };

    const menuItems = [
        {
            name: 'Transaction Function',
            ckicon: '',
            subMenu: [
                { name: 'LOCT/IECT Issue', link: '/LOCTSystem/Transaction?P_TYPE=ISSUE' },
                { name: 'LOCT/IECT Approve', link: '/LOCTSystem/Transaction?P_TYPE=APPROVE' }
            ]
        },
        {
            name: 'Monitoring Function',
            ckicon: '',
            subMenu: [
                { name: 'LOCT/IECT Master List', link: '/LOCTSystem/Transaction?P_TYPE=MASTERLIST' }
            ]
        },
        {
            name: 'Report Function',
            ckicon: '',
            subMenu: [
                { name: 'Summary Report', link: '/LOCTSystem/Report/Group?P_REPORT_BY=SUMALL' },
                { name: 'Summary Report By Factory', link: '/LOCTSystem/Report/Group?P_REPORT_BY=FACTORY' },
                { name: 'Summary Report By CC', link: '/LOCTSystem/Report/Group?P_REPORT_BY=CC' },
                { name: 'Summary Report By Center', link: '/LOCTSystem/Report/Group?P_REPORT_BY=CENTER' },
                { name: 'Summary Report By Leader', link: '/LOCTSystem/Report/Group?P_REPORT_BY=LEADER' },
                { name: 'Detail Report Of Leader', link: '/LOCTSystem/Report/Group?P_REPORT_BY=DETAILLEADER' },
                { name: 'Detail Report Of Operator', link: '/LOCTSystem/Report/Group?P_REPORT_BY=DETAILOPERATOR' }
            ]
        },
        { name: 'Print Report', ckicon: 'PT', link: '/LOCTSystem/Report/Print' },
        { name: 'QR Code', ckicon: 'QR', link: '/LOCTSystem/Report/QRcode' }
    ];

    return (
        <div>
            <div className='header'>
                <div className="hamburger" onClick={() => toggleSidebar('')}>
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                </div>
                <nav className="navbar" ref={navRef}>
                    <div className="logo" onClick={() => toggleSidebar('/LOCTSystem/Home')}><img src={Logo} alt="Logo" className='hlogo' /> LOCT/IECT</div>
                    <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
                        <div className='d-First'>
                            {menuItems.map((item, index) => (
                                <>
                                    {Array.isArray(item.subMenu) ? (
                                        <li key={index} onClick={() => handleSubMenuToggle(index)}>{item.name}
                                            {activeSubMenu === index && (
                                                <ul className="sub-menu">
                                                    {item.subMenu.map((subItem, subIndex) => (
                                                        <li key={subIndex} onClick={() => toggleSidebar(subItem.link)}>
                                                            {subItem.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    ) : (<li key={index} onClick={() => toggleSidebar(item.link)} className={item.ckicon === 'PT' ? 'hide-on-mobile' : ''}>{
                                        (item.ckicon === 'PT' ? <FontAwesomeIcon icon={faPrint} /> :
                                            item.ckicon === 'QR' ? <FontAwesomeIcon icon={faQrcode} /> : null
                                        )} {item.name}</li>)}
                                </>
                            ))}
                        </div>
                        <div className='d-End'>
                            {localStorage.getItem("emp_id")} : {localStorage.getItem("emp_user")}
                            <IconButton color="inherit" onClick={() => showConfirm('Do you want logout?')}>
                                <FaSignOutAlt />
                            </IconButton></div>
                    </ul>
                </nav>
               
            </div>
            <PopupConfirm
                visible={visible}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                message={strMessage}
            />

        </div>
    );
}

export default Menu