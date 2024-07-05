import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { Header } from 'antd/es/layout/layout';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import {tahoma} from './fonts';

const username = import.meta.env.VITE_API_USER;
const password = import.meta.env.VITE_API_PASS;
const token = btoa(`${username}:${password}`);

function GetFactory() {
    const [facList, setfacList] = useState([]);
    const FactoryList = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API}/common/getFactory`,
                {
                    headers: {
                        'Authorization': `Basic ${token}`,
                    },
                });
            const data = await response.data;
            if (data.length > 0) {
                setfacList(data);
            } else {
                alert(data)
            }
        } catch (error) {
            console.error("Error Factory.", error);
            alert(error.message);
        }
    };
    return { FactoryList, facList }
}

function GetCostCenter() {
    const [ccList, setccList] = useState([]);
    const CostCenterList = async (factory) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API}/common/getCostCenter?P_FACTORY=${factory}`,
                {
                    headers: {
                        'Authorization': `Basic ${token}`,
                    },
                });
            const data = await response.data;
            if (data.length > 0) {
                setccList(data);
            } else {
                alert(data)
            }
        } catch (error) {
            console.error("Error Factory.", error);
            alert(error.message);
        }
    };
    return { CostCenterList, ccList }
}

function GetYearMonth() {
    const currentYear = new Date().getFullYear();
    const yearList = Array.from({ length: 3 }, (_, i) => {
        const year = currentYear - i;
        return { value: year, label: year };
    });
    const monthList = [
        { value: '04', label: 'April' },
        { value: '05', label: 'May' },
        { value: '06', label: 'June' },
        { value: '07', label: 'July' },
        { value: '08', label: 'August' },
        { value: '09', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' },
        { value: '01', label: 'January' },
        { value: '02', label: 'February' },
        { value: '03', label: 'March' },
    ];

    return { yearList, monthList }
}

function PrintOut_Fn() {
    const tableRef = useRef(null);
    const [loading, setloading] = useState(false);
    const [isMode, setisMode] = useState(false);
    const [isVisible, setisVisible] = useState(false);

    const [STC_FORM, setSTC_FORM] = useState({
        LTD_LD_LOGIN: '',
        LTD_LD_EMP_ID: '',
        LTD_FACTORY: null,
        LTD_CC: null,
        LTD_APP_FISCALYR: '',
        LTD_YEAR: null,
        LTD_MONTH: null,
        LTD_MGR_EMP_ID: '',
        LTD_MGR_EMP_NAME: '',
        LTD_MEMBER_AMOUNT: '',
        LTD_MODIFY_BY: ''
    });

    const handleChangeFac = (event) => {
        setSTC_FORM(prevState => ({
            ...prevState,
            ['LTD_FACTORY']: event
        }));

    };

    const handleChangeCC = (event) => {
        setSTC_FORM(prevState => ({
            ...prevState,
            ['LTD_CC']: event
        }));
    };

    const handleChangeFisical = (event) => {
        if (isMode) {
            OnCheckData(event.value, STC_FORM.LTD_MONTH.value)
        } else {
            setSTC_FORM(prevState => ({
                ...prevState,
                ['LTD_YEAR']: event
            }));
        }

    };

    const handleChangeMonth = (event) => {
        if (isMode) {
            OnCheckData(STC_FORM.LTD_YEAR.value, event.value)
        } else {
            setSTC_FORM(prevState => ({
                ...prevState,
                ['LTD_MONTH']: event
            }));
        }
    };

    const handleInputChangeText = (e) => {
        const { name, value } = e.target;
        if (name === 'LTD_MEMBER_AMOUNT') {
            if (/^\d*$/.test(value)) {
                setSTC_FORM(prevState => ({
                    ...prevState,
                    [name]: value
                }));
            }
        } else if (name === 'LTD_MGR_EMP_ID' && value.length === 7) {
            GetDataUser(value);
        } else {
            setSTC_FORM(prevState => ({
                ...prevState,
                [name]: value
            }));
        }

    };

    const OnCheckData = async (year, month) => {
        setloading(true)

        if (year !== '' && month !== '') {
            try {
                let MM_YYYY;
                MM_YYYY = month + '_' + year;
                const response = await axios.get(`${import.meta.env.VITE_API}/report/getTeamDetail?P_EMP_ID=${STC_FORM.LTD_LD_EMP_ID}&P_APP_FISICAL=${MM_YYYY}`,
                    {
                        headers: {
                            'Authorization': `Basic ${token}`,
                        },
                    }
                );
                const data = await response.data;
                if (data.length > 0) {
                    setSTC_FORM({
                        LTD_LD_LOGIN: data[0]['LTD_LD_LOGIN'],
                        LTD_LD_EMP_ID: data[0]['LTD_LD_EMP_ID'],
                        LTD_FACTORY: data[0]['LTD_FACTORY'],
                        LTD_CC: data[0]['LTD_CC'],
                        LTD_APP_FISCALYR: data[0]['LTD_APP_FISCALYR'],
                        LTD_YEAR: data[0]['LTD_YEAR'],
                        LTD_MONTH: data[0]['LTD_MONTH'],
                        LTD_MGR_EMP_ID: data[0]['LTD_MGR_EMP_ID'],
                        LTD_MGR_EMP_NAME: data[0]['LTD_MGR_EMP_NAME'],
                        LTD_MEMBER_AMOUNT: data[0]['LTD_MEMBER_AMOUNT'],
                        LTD_MODIFY_BY: localStorage.getItem("emp_user")
                    })
                } else {
                    alert('ไม่พบข้อมูลการพิมพ์ Report ในเดือนที่คุณเลือก')
                }
                setloading(false)
            } catch (error) {
                setloading(false)
                console.error("Error RequesterORType:", error);
                alert(error.message);
            }
        }

    }

    const OnSearch = async () => {
        setloading(true)
        try {
            const responseU = await axios.get(`${import.meta.env.VITE_API}/report/getCheckRole?P_EMP_ID=${STC_FORM.LTD_LD_EMP_ID}`,
                {
                    headers: {
                        'Authorization': `Basic ${token}`,
                    },
                }
            );
            const dataU = await responseU.data;
            if (dataU === 'AP') {
                if (localStorage.getItem("emp_id") === STC_FORM.LTD_LD_EMP_ID) {
                    setisMode(false)
                } else {
                    setisMode(true)
                }

                const response = await axios.get(`${import.meta.env.VITE_API}/report/getTeamDetail?P_EMP_ID=${STC_FORM.LTD_LD_EMP_ID}&P_APP_FISICAL=`,
                    {
                        headers: {
                            'Authorization': `Basic ${token}`,
                        },
                    }
                );
                const data = await response.data;
                if (data.length > 0) {
                    setSTC_FORM({
                        LTD_LD_LOGIN: data[0]['LTD_LD_LOGIN'],
                        LTD_LD_EMP_ID: data[0]['LTD_LD_EMP_ID'],
                        LTD_FACTORY: data[0]['LTD_FACTORY'],
                        LTD_CC: data[0]['LTD_CC'],
                        LTD_APP_FISCALYR: data[0]['LTD_APP_FISCALYR'],
                        LTD_YEAR: data[0]['LTD_YEAR'],
                        LTD_MONTH: data[0]['LTD_MONTH'],
                        LTD_MGR_EMP_ID: data[0]['LTD_MGR_EMP_ID'],
                        LTD_MGR_EMP_NAME: data[0]['LTD_MGR_EMP_NAME'],
                        LTD_MEMBER_AMOUNT: data[0]['LTD_MEMBER_AMOUNT'],
                        LTD_MODIFY_BY: localStorage.getItem("emp_user")
                    })
                } else {
                    setSTC_FORM({
                        LTD_LD_LOGIN: localStorage.getItem("emp_user"),
                        LTD_LD_EMP_ID: STC_FORM.LTD_LD_EMP_ID,
                        LTD_FACTORY: { value: localStorage.getItem("emp_fac_code"), label: localStorage.getItem("emp_fac_desc") },
                        LTD_CC: null,
                        LTD_APP_FISCALYR: '',
                        LTD_YEAR: null,
                        LTD_MONTH: null,
                        LTD_MGR_EMP_ID: '',
                        LTD_MGR_EMP_NAME: '',
                        LTD_MEMBER_AMOUNT: '',
                        LTD_MODIFY_BY: localStorage.getItem("emp_user")
                    })
                }
                setisVisible(true)
            } else {
                alert('ไม่พบข้อมูลของหัวหน้างาน กรุณาตรวจสอบใหม่อีกครั้ง')
                setisVisible(false)
            }
            setloading(false)
        } catch (error) {
            setloading(false)
            console.error("Error RequesterORType:", error);
            alert(error.message);
        }
    }

    const OnRest = async () => {
        setisMode(false)
        setisVisible(false)
        setSTC_FORM({
            LTD_LD_LOGIN: '',
            LTD_LD_EMP_ID: '',
            LTD_FACTORY: null,
            LTD_CC: null,
            LTD_APP_FISCALYR: '',
            LTD_YEAR: null,
            LTD_MONTH: null,
            LTD_MGR_EMP_ID: '',
            LTD_MGR_EMP_NAME: '',
            LTD_MEMBER_AMOUNT: '',
            LTD_MODIFY_BY: ''
        })
        // alert(window.location.hostname)
        // alert(window.location.href)

    }

    
    const Print = (tableHeader, tableData) => {
        const doc = new jsPDF({
            orientation: 'landscape', // ตั้งค่าแนวนอน (landscape) หรือแนวตั้ง (portrait)
            unit: 'mm', // หน่วยเป็นมิลลิเมตร
            format: 'a4', // ขนาดกระดาษ A4
            compress: true, // บีบอัดเอกสารเพื่อลดขนาดไฟล์
            fontSize: 12, // ตั้งค่าขนาดตัวอักษรเริ่มต้น
            lineHeight: 1.2, // ความสูงของบรรทัด
            autoSize: false, // ปรับขนาดเอกสารอัตโนมัติ
            margin: { top: 30, right: 10, bottom: 10, left: 10 } // กำหนดขอบกระดาษ
        });
        
        doc.addFileToVFS('tahoma.ttf', tahoma);
        doc.addFont('tahoma.ttf', 'Tahoma', 'normal');
        doc.setFont('Tahoma');

        // doc.text('LOCT Result อิอิ', 50, 155);
        let startY = 10
        doc.autoTable({
            startY: startY,
            head: [
                [{ content: `LOCT Result (${tableHeader.P_RES_OF_MONTH})`, colSpan: 3, styles: { halign: 'left' } }]
            ],
            body: [
                [{ content: 'Accept/Acknowledge By', styles: { halign: 'right' } }, { content: tableHeader.P_MGR_NAME }, { content: `Process/Cost Center : ${tableHeader.P_PROC_CC} | Result of Month : ${tableHeader.P_RES_OF_MONTH} | Fiscal Year : ${tableHeader.P_RES_OF_YEAR}` }],
                [{ content: 'Total Operator', styles: { halign: 'right' } }, { content: tableHeader.P_AMOUNT_UNDER }, { content: `Total MH Saving : ${tableHeader.P_TOTAL_MH} | Total Cost Saving : ${tableHeader.P_TOTAL_MC} | Total Item : ${tableHeader.P_COUNT_ISS} Items` }],
                [{ content: 'Participate Member', styles: { halign: 'right' } }, { content: tableHeader.P_PERSON_ISS }, { content: `Line Leader : ${tableHeader.P_LEADER}` }]
            ],
            theme: 'grid', // ใช้ theme 'grid' เพื่อให้มีเส้นขอบ
            headStyles: {
                fontSize: 12,
                fillColor: [41, 128, 185], // สีพื้นหลังของหัวตาราง
                textColor: [255, 255, 255], // สีข้อความในหัวตาราง
                fontStyle: 'bold', // ลักษณะตัวอักษร
                lineWidth: 0.5, // ความหนาของเส้นขอบ
                lineColor: [0, 0, 0] // สีขอบของเส้นขอบ
            },
            styles: {
                font: 'Tahoma',
                cellPadding: 2,
                fontSize: 7,
                textColor: [0, 0, 0], // สีข้อความเป็นสีดำ
                fillColor: [255, 255, 255], // สีพื้นหลังเป็นสีขาว
                lineColor: [0, 0, 0], // สีขอบเป็นสีดำ
            },
        });

        // กำหนดตำแหน่งเริ่มต้นของตาราง
  
        startY = doc.previousAutoTable.finalY + 2;
        // สร้างตารางในเอกสาร PDF          
        doc.autoTable({
            startY: startY,
            head: [
                [{ content: 'No', styles: { halign: 'center', cellWidth: 5 } },
                { content: 'OPR\nIssue Date', styles: { halign: 'center', cellWidth: 14 } },
                { content: 'SGT\nIssue', styles: { halign: 'center', cellWidth: 10 } },
                { content: 'Implement Activity', colSpan: 2, styles: { halign: 'center' } },
                { content: 'MH\nSaving', styles: { halign: 'center', cellWidth: 10 } },
                { content: 'Cost Saving\n(THB)', styles: { halign: 'center', cellWidth: 10 } },
                { content: 'Approve Date', styles: { halign: 'center', cellWidth: 14 } },
                { content: 'OPR\nName-Surname', colSpan: 2, styles: { halign: 'center' } },
                { content: 'Subject', styles: { halign: 'center', cellWidth: 42 } },
                { content: 'Before', styles: { halign: 'center', cellWidth: 42 } },
                { content: 'After', styles: { halign: 'center', cellWidth: 42 } }]
            ],
            body: tableData.map(row => {
                let sgtIssueContent = row.P_FLAG_SGT === 'Y' ? 'V' : 'X';

                if (row.P_FLAG_EVA !== 'Implement') {
                    return [row.P_NO,
                    row.P_ISS_DATE,
                        sgtIssueContent,
                    { content: `${row.P_FLAG_EVA}`, colSpan: 2 },
                    row.P_MH,
                    row.P_MC,
                    row.P_APP_DATE,
                    { content: row.P_ISS_ID, styles: { halign: 'center', cellWidth: 13 } },
                    { content: row.P_ISS_NAME, styles: { halign: 'left', cellWidth: 37 } },
                    { content: `${row.P_SUBJECT}`, styles: { halign: 'left', overflow: 'linebreak' } },
                    { content: `${row.P_BEFORE}`, styles: { halign: 'left', overflow: 'linebreak' } },
                    { content: `${row.P_AFTER}`, styles: { halign: 'left', overflow: 'linebreak' } }];
                } else {
                    return [row.P_NO,
                    row.P_ISS_DATE,
                        sgtIssueContent,
                    { content: row.P_FLAG_EVA, styles: { halign: 'center', cellWidth: 15 } },
                    { content: row.P_DATE_EVA, styles: { halign: 'center', cellWidth: 15 } },
                    row.P_MH,
                    row.P_MC,
                    row.P_APP_DATE,
                    { content: row.P_ISS_ID, styles: { halign: 'center', cellWidth: 13 } },
                    { content: row.P_ISS_NAME, styles: { halign: 'left', cellWidth: 37 } },
                    { content: `${row.P_SUBJECT}`, styles: { halign: 'left', overflow: 'linebreak' } },
                    { content: `${row.P_BEFORE}`, styles: { halign: 'left', overflow: 'linebreak' } },
                    { content: `${row.P_AFTER}`, styles: { halign: 'left', overflow: 'linebreak' } }];
                }

            }),
            theme: 'grid', // ใช้ theme 'grid' เพื่อให้มีเส้นขอบ
            headStyles: {
                fillColor: [41, 128, 185], // สีพื้นหลังของหัวตาราง
                textColor: [255, 255, 255], // สีข้อความในหัวตาราง
                lineWidth: 0.5, // ความหนาของเส้นขอบ
                lineColor: [0, 0, 0], // สีขอบของเส้นขอบ
                valign: 'middle'
            },
            styles: {
                font: 'Tahoma',
                fontSize: 6,
                cellPadding: 1,
                textColor: [0, 0, 0], // สีข้อความเป็นสีดำ
                fillColor: [255, 255, 255], // สีพื้นหลังเป็นสีขาว
                lineColor: [0, 0, 0], // สีขอบเป็นสีดำ
                halign: 'center'
            }
        });

        const dateR = new Date();
        const yearR = dateR.getFullYear();
        const monthR = String(dateR.getMonth() + 1).padStart(2, '0');
        const dayR = String(dateR.getDate()).padStart(2, '0');
        const hoursR = String(dateR.getHours()).padStart(2, '0');
        const minutesR = String(dateR.getMinutes()).padStart(2, '0');
        const secondsR = String(dateR.getSeconds()).padStart(2, '0');
        const typeReport = 'LeaderPrint_';
        const Filename = typeReport + yearR + monthR + dayR + hoursR + minutesR + secondsR + '.pdf';

        doc.save(Filename);
    }

    const OnSave = async () => {

        let STC;
        STC = STC_FORM;
        STC.LTD_APP_FISCALYR = STC_FORM.LTD_MONTH.value + '_' + STC_FORM.LTD_YEAR.value;
        setloading(true);
        try {

            const response = await axios.post(
                `${import.meta.env.VITE_API}/report/setTeamDetail`, STC,
                {
                    headers: {
                        'Authorization': `Basic ${token}`,
                    },
                }
            );
            const data = await response.data;
            if (response.status === 200) {
                setloading(false);
            } else {
                setloading(false);
                alert(data);
            }

        } catch (error) {
            setloading(false);
            console.error("Error RequesterORType:", error);
            alert(error.message);
        }

    };

    const OnPrint = async () => {
        if (STC_FORM.LTD_FACTORY === null) {
            alert('Please select factory')
            return
        }

        if (STC_FORM.LTD_YEAR === null) {
            alert('Please select fisical year')
            return
        }

        if (STC_FORM.LTD_MONTH === null) {
            alert('Please select month')
            return
        }

        if (STC_FORM.LTD_MEMBER_AMOUNT === '') {
            alert('Please fill in total Operator.')
            return
        }

        if (STC_FORM.LTD_MGR_EMP_ID === '') {
            alert('Please fill in accept or acknowledge by')
            return
        }

        if (STC_FORM.LTD_MGR_EMP_NAME === '') {
            alert('Please enter the correct accept or acknowledge by')
            return
        }

        let P_CC = '';
        if (STC_FORM.LTD_CC !== null) {
            P_CC = STC_FORM.LTD_CC.value
        }


        if (!isMode) {
            OnSave()
        }
        // window.open(`/LOCTSystem/Print?P_LEADER_ID=${STC_FORM.LTD_LD_EMP_ID}&P_APP_MONTH=${STC_FORM.LTD_MONTH.value + '_' + STC_FORM.LTD_YEAR.value}&P_FACTORY=${STC_FORM.LTD_FACTORY.label}&P_CC=${P_CC}`, '_blank')
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API}/report/dataHeaderPrint?P_LEADER_ID=${STC_FORM.LTD_LD_EMP_ID}&P_APP_MONTH=${STC_FORM.LTD_MONTH.value + '_' + STC_FORM.LTD_YEAR.value}&P_FACTORY=${STC_FORM.LTD_FACTORY.label}&P_CC=${P_CC}`,
                {
                    headers: {
                        'Authorization': `Basic ${token}`,
                    },
                }
            );
            const data = await response.data;

            if (data.length > 0) {
                const tableHeader = data;
                const response2 = await axios.get(
                    `${import.meta.env.VITE_API}/report/dataDetailPrint?P_LEADER_ID=${STC_FORM.LTD_LD_EMP_ID}&P_APP_MONTH=${STC_FORM.LTD_MONTH.value + '_' + STC_FORM.LTD_YEAR.value}&P_FACTORY=${STC_FORM.LTD_FACTORY.label}&P_CC=${P_CC}`,
                    {
                        headers: {
                            'Authorization': `Basic ${token}`,
                        },
                    }
                );
                const data2 = await response2.data;
                if (data2.length > 0) {
                    const tableData = data2;
                    Print(tableHeader[0], tableData)


                } else {
                    alert('Error Detail Data Not Found....')
                }

            } else {
                alert('Error Data Not Found....')
            }

        } catch (error) {
            console.error("Error RequesterORType:", error);
            alert(error.message);
        }
    }

    const GetDataUser = async (empID) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API}/transaction/getDataEmp?P_EMP_ID=${empID}`,
                {
                    headers: {
                        'Authorization': `Basic ${token}`,
                    },
                }
            );
            const data = await response.data;

            if (data.length > 0) {
                setSTC_FORM(prevState => ({
                    ...prevState,
                    ['LTD_MGR_EMP_ID']: data[0]['EMP_ID'],
                    ['LTD_MGR_EMP_NAME']: data[0]['EMP_F_NAME'].charAt(0).toUpperCase() + data[0]['EMP_F_NAME'].slice(1).toLowerCase() + ' ' + data[0]['EMP_S_NAME'].charAt(0).toUpperCase() + data[0]['EMP_S_NAME'].slice(1).toLowerCase()
                }));
            }
            setloading(false)


        } catch (error) {
            setloading(false)
            console.error("Error RequesterORType:", error);
            alert(error.message);
        }

    };

    return {
        loading,
        isMode,
        setloading,
        STC_FORM,
        handleChangeFac,
        handleChangeCC,
        handleChangeFisical,
        handleChangeMonth,
        handleInputChangeText,
        isVisible,
        OnSearch,
        OnRest,
        OnPrint

    }
}

export { GetFactory, GetCostCenter, GetYearMonth, PrintOut_Fn }