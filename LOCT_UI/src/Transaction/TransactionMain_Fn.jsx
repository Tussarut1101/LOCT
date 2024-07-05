import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { Header } from 'antd/es/layout/layout';
import * as XLSX from 'xlsx';

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

function base64ToFile(base64String, filename, mimeType) {
    let setmimeType = ``;

    if (mimeType === 'jpeg' || mimeType === 'png' || mimeType === 'gif' || mimeType === 'jpg') {
        setmimeType = `image/${mimeType}`;


    } else if (mimeType === 'txt' || mimeType === 'csv') {
        if (mimeType === 'txt') {
            setmimeType = `image/plain`;

        } else {
            setmimeType = `image/${mimeType}`;
        }
    }
    else if (mimeType === 'pdf' || mimeType === 'doc' || mimeType === 'docx' || mimeType === 'pdf' || mimeType === 'doc' || mimeType === 'docx' || mimeType === 'xls' || mimeType === 'xlsx' || mimeType === 'pptx') {
        if (mimeType === 'doc') {
            setmimeType = `application/msword`;
        } else if (mimeType === 'docx') {
            setmimeType = `application/vnd.openxmlformats-officedocument.wordprocessingml.document`;
        } else if (mimeType === 'xls') {
            setmimeType = `application/vnd.ms-excel`;
        } else if (mimeType === 'xlsx') {
            setmimeType = `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`;
        } else if (mimeType === 'pptx') {
            setmimeType = `application/vnd.openxmlformats-officedocument.presentationml.presentation`;
        } else {
            setmimeType = `application/${mimeType}`;
        }
    }
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new File([byteArray], filename, { type: setmimeType });
}


function TransactionMain_Fn() {
    const tableRef = useRef(null);
    const [loading, setloading] = useState(false);
    const [dataMainList, setdataMainList] = useState([]);
    const [STC_Search, setSTC_Search] = useState({
        P_FACTORY: null,
        P_CC: null,
        P_ISS_DATE_FRM: null,
        P_ISS_DATE_TO: null,
        P_EMP_ID: '',
        P_EMP_NAME: '',
        P_TYPE: '',
        P_STATUS: null,
        P_SUBMIT_DATE_FRM: null,
        P_SUBMIT_DATE_TO: null,
        P_FISICAL_YEAR: null,
        P_MONTH_FRM: null,
        P_MONTH_TO: null
    });

    const handleChangeFac = (event) => {
        setSTC_Search({
            P_FACTORY: event,
            P_CC: STC_Search.P_CC,
            P_ISS_DATE_FRM: STC_Search.P_ISS_DATE_FRM,
            P_ISS_DATE_TO: STC_Search.P_ISS_DATE_TO,
            P_EMP_ID: STC_Search.P_EMP_ID,
            P_EMP_NAME: STC_Search.P_EMP_NAME,
            P_TYPE: STC_Search.P_TYPE,
            P_STATUS: STC_Search.P_STATUS,
            P_SUBMIT_DATE_FRM: STC_Search.P_SUBMIT_DATE_FRM,
            P_SUBMIT_DATE_TO: STC_Search.P_SUBMIT_DATE_TO,
            P_FISICAL_YEAR: STC_Search.P_FISICAL_YEAR,
            P_MONTH_FRM: STC_Search.P_MONTH_FRM,
            P_MONTH_TO: STC_Search.P_MONTH_TO
        })
    };

    const handleChangeCC = (event) => {
        setSTC_Search({
            P_FACTORY: STC_Search.P_FACTORY,
            P_CC: event,
            P_ISS_DATE_FRM: STC_Search.P_ISS_DATE_FRM,
            P_ISS_DATE_TO: STC_Search.P_ISS_DATE_TO,
            P_EMP_ID: STC_Search.P_EMP_ID,
            P_EMP_NAME: STC_Search.P_EMP_NAME,
            P_TYPE: STC_Search.P_TYPE,
            P_STATUS: STC_Search.P_STATUS,
            P_SUBMIT_DATE_FRM: STC_Search.P_SUBMIT_DATE_FRM,
            P_SUBMIT_DATE_TO: STC_Search.P_SUBMIT_DATE_TO,
            P_FISICAL_YEAR: STC_Search.P_FISICAL_YEAR,
            P_MONTH_FRM: STC_Search.P_MONTH_FRM,
            P_MONTH_TO: STC_Search.P_MONTH_TO
        })
    };

    const handleChangeStatus = (event) => {
        setSTC_Search({
            P_FACTORY: STC_Search.P_FACTORY,
            P_CC: STC_Search.P_CC,
            P_ISS_DATE_FRM: STC_Search.P_ISS_DATE_FRM,
            P_ISS_DATE_TO: STC_Search.P_ISS_DATE_TO,
            P_EMP_ID: STC_Search.P_EMP_ID,
            P_EMP_NAME: STC_Search.P_EMP_NAME,
            P_TYPE: STC_Search.P_TYPE,
            P_STATUS: event,
            P_SUBMIT_DATE_FRM: STC_Search.P_SUBMIT_DATE_FRM,
            P_SUBMIT_DATE_TO: STC_Search.P_SUBMIT_DATE_TO,
            P_FISICAL_YEAR: STC_Search.P_FISICAL_YEAR,
            P_MONTH_FRM: STC_Search.P_MONTH_FRM,
            P_MONTH_TO: STC_Search.P_MONTH_TO
        })
    };

    const handleChangeIssFrm = (event) => {
        setSTC_Search({
            P_FACTORY: STC_Search.P_FACTORY,
            P_CC: STC_Search.P_CC,
            P_ISS_DATE_FRM: event,
            P_ISS_DATE_TO: STC_Search.P_ISS_DATE_TO || event,
            P_EMP_ID: STC_Search.P_EMP_ID,
            P_EMP_NAME: STC_Search.P_EMP_NAME,
            P_TYPE: STC_Search.P_TYPE,
            P_STATUS: STC_Search.P_STATUS,
            P_SUBMIT_DATE_FRM: STC_Search.P_SUBMIT_DATE_FRM,
            P_SUBMIT_DATE_TO: STC_Search.P_SUBMIT_DATE_TO,
            P_FISICAL_YEAR: STC_Search.P_FISICAL_YEAR,
            P_MONTH_FRM: STC_Search.P_MONTH_FRM,
            P_MONTH_TO: STC_Search.P_MONTH_TO
        })
    };

    const handleChangeIssTo = (event) => {
        setSTC_Search({
            P_FACTORY: STC_Search.P_FACTORY,
            P_CC: STC_Search.P_CC,
            P_ISS_DATE_FRM: STC_Search.P_ISS_DATE_FRM,
            P_ISS_DATE_TO: event,
            P_EMP_ID: STC_Search.P_EMP_ID,
            P_EMP_NAME: STC_Search.P_EMP_NAME,
            P_TYPE: STC_Search.P_TYPE,
            P_STATUS: STC_Search.P_STATUS,
            P_SUBMIT_DATE_FRM: STC_Search.P_SUBMIT_DATE_FRM,
            P_SUBMIT_DATE_TO: STC_Search.P_SUBMIT_DATE_TO,
            P_FISICAL_YEAR: STC_Search.P_FISICAL_YEAR,
            P_MONTH_FRM: STC_Search.P_MONTH_FRM,
            P_MONTH_TO: STC_Search.P_MONTH_TO
        })
    };

    const handleChangeSubmitFrm = (event) => {
        setSTC_Search({
            P_FACTORY: STC_Search.P_FACTORY,
            P_CC: STC_Search.P_CC,
            P_ISS_DATE_FRM: STC_Search.P_ISS_DATE_FRM,
            P_ISS_DATE_TO: STC_Search.P_ISS_DATE_TO,
            P_EMP_ID: STC_Search.P_EMP_ID,
            P_EMP_NAME: STC_Search.P_EMP_NAME,
            P_TYPE: STC_Search.P_TYPE,
            P_STATUS: STC_Search.P_STATUS,
            P_SUBMIT_DATE_FRM: event,
            P_SUBMIT_DATE_TO: STC_Search.P_SUBMIT_DATE_TO || event,
            P_FISICAL_YEAR: STC_Search.P_FISICAL_YEAR,
            P_MONTH_FRM: STC_Search.P_MONTH_FRM,
            P_MONTH_TO: STC_Search.P_MONTH_TO
        })
    };

    const handleChangeSubmitTo = (event) => {
        setSTC_Search({
            P_FACTORY: STC_Search.P_FACTORY,
            P_CC: STC_Search.P_CC,
            P_ISS_DATE_FRM: STC_Search.P_ISS_DATE_FRM,
            P_ISS_DATE_TO: STC_Search.P_ISS_DATE_TO,
            P_EMP_ID: STC_Search.P_EMP_ID,
            P_EMP_NAME: STC_Search.P_EMP_NAME,
            P_TYPE: STC_Search.P_TYPE,
            P_STATUS: STC_Search.P_STATUS,
            P_SUBMIT_DATE_FRM: STC_Search.P_SUBMIT_DATE_FRM,
            P_SUBMIT_DATE_TO: event,
            P_FISICAL_YEAR: STC_Search.P_FISICAL_YEAR,
            P_MONTH_FRM: STC_Search.P_MONTH_FRM,
            P_MONTH_TO: STC_Search.P_MONTH_TO
        })
    };

    const handleInputChangeText = (e) => {
        const { name, value } = e.target;
        setSTC_Search(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleChangeRadito = (e) => {
        setSTC_Search({
            P_FACTORY: STC_Search.P_FACTORY,
            P_CC: STC_Search.P_CC,
            P_ISS_DATE_FRM: STC_Search.P_ISS_DATE_FRM,
            P_ISS_DATE_TO: STC_Search.P_ISS_DATE_TO,
            P_EMP_ID: STC_Search.P_EMP_ID,
            P_EMP_NAME: STC_Search.P_EMP_NAME,
            P_TYPE: e.target.value,
            P_STATUS: STC_Search.P_STATUS,
            P_SUBMIT_DATE_FRM: STC_Search.P_SUBMIT_DATE_FRM,
            P_SUBMIT_DATE_TO: STC_Search.P_SUBMIT_DATE_TO,
            P_FISICAL_YEAR: STC_Search.P_FISICAL_YEAR,
            P_MONTH_FRM: STC_Search.P_MONTH_FRM,
            P_MONTH_TO: STC_Search.P_MONTH_TO
        })
        setdataMainList([])
    };
    const handleChangeFisical = (event) => {
        setSTC_Search({
            P_FACTORY: STC_Search.P_FACTORY,
            P_CC: STC_Search.P_CC,
            P_ISS_DATE_FRM: STC_Search.P_ISS_DATE_FRM,
            P_ISS_DATE_TO: STC_Search.P_ISS_DATE_TO,
            P_EMP_ID: STC_Search.P_EMP_ID,
            P_EMP_NAME: STC_Search.P_EMP_NAME,
            P_TYPE: STC_Search.P_TYPE,
            P_STATUS: STC_Search.P_STATUS,
            P_SUBMIT_DATE_FRM: STC_Search.P_SUBMIT_DATE_FRM,
            P_SUBMIT_DATE_TO: STC_Search.P_SUBMIT_DATE_TO,
            P_FISICAL_YEAR: event,
            P_MONTH_FRM: STC_Search.P_MONTH_FRM,
            P_MONTH_TO: STC_Search.P_MONTH_TO
        })
    };

    const handleChangeMonthFrm = (event) => {
        setSTC_Search({
            P_FACTORY: STC_Search.P_FACTORY,
            P_CC: STC_Search.P_CC,
            P_ISS_DATE_FRM: STC_Search.P_ISS_DATE_FRM,
            P_ISS_DATE_TO: STC_Search.P_ISS_DATE_TO,
            P_EMP_ID: STC_Search.P_EMP_ID,
            P_EMP_NAME: STC_Search.P_EMP_NAME,
            P_TYPE: STC_Search.P_TYPE,
            P_STATUS: STC_Search.P_STATUS,
            P_SUBMIT_DATE_FRM: STC_Search.P_SUBMIT_DATE_FRM,
            P_SUBMIT_DATE_TO: STC_Search.P_SUBMIT_DATE_TO,
            P_FISICAL_YEAR: STC_Search.P_FISICAL_YEAR,
            P_MONTH_FRM: event,
            P_MONTH_TO: event
        })
    };

    const handleChangeMonthTo = (event) => {
        setSTC_Search({
            P_FACTORY: STC_Search.P_FACTORY,
            P_CC: STC_Search.P_CC,
            P_ISS_DATE_FRM: STC_Search.P_ISS_DATE_FRM,
            P_ISS_DATE_TO: STC_Search.P_ISS_DATE_TO,
            P_EMP_ID: STC_Search.P_EMP_ID,
            P_EMP_NAME: STC_Search.P_EMP_NAME,
            P_TYPE: STC_Search.P_TYPE,
            P_STATUS: STC_Search.P_STATUS,
            P_SUBMIT_DATE_FRM: STC_Search.P_SUBMIT_DATE_FRM,
            P_SUBMIT_DATE_TO: STC_Search.P_SUBMIT_DATE_TO,
            P_FISICAL_YEAR: STC_Search.P_FISICAL_YEAR,
            P_MONTH_FRM: STC_Search.P_MONTH_FRM,
            P_MONTH_TO: event
        })
    };

    const OnSearch = async () => {
        let P_FACTORY = '';
        let P_CC = '';
        let P_ISS_DATE_FRM = '';
        let P_ISS_DATE_TO = '';
        let P_EMP_ID = '';
        let P_EMP_NAME = '';
        let P_TYPE = '';
        let P_STATUS = '';

        let P_SM_DATE_FRM = '';
        let P_SM_DATE_TO = '';

        let P_FISICAL_YEAR = '';
        let P_APP_MONTH_FRM = '';
        let P_APP_MONTH_TO = '';
        let P_APP_BY = '';
        let P_APP_FLAG = '';

        if (localStorage.getItem('TYPETOMAIN') === 'APPROVE') {
            P_APP_BY = localStorage.getItem('emp_id');
            P_APP_FLAG = 'Y'
        }

        if (STC_Search.P_FACTORY !== null) {
            P_FACTORY = STC_Search.P_FACTORY.label.trim()
        } else {
            alert('Please select factory.')
            return
        }

        if (STC_Search.P_CC !== null) {
            P_CC = STC_Search.P_CC.value
        }

        if (STC_Search.P_ISS_DATE_FRM !== null) {
            const dFrm = new Date(STC_Search.P_ISS_DATE_FRM);
            P_ISS_DATE_FRM = dFrm.getFullYear() + String(dFrm.getMonth() + 1).padStart(2, '0') + String(dFrm.getDate()).padStart(2, '0');
        } else {
            if (localStorage.getItem('TYPETOMAIN') === 'ISSUE') {
                alert('Please select Request date from.')
                return
            }

        }

        if (STC_Search.P_ISS_DATE_TO !== null) {
            const dTo = new Date(STC_Search.P_ISS_DATE_TO);
            P_ISS_DATE_TO = dTo.getFullYear() + String(dTo.getMonth() + 1).padStart(2, '0') + String(dTo.getDate()).padStart(2, '0');
        } else {
            if (localStorage.getItem('TYPETOMAIN') === 'ISSUE') {
                alert('Please select Request date to.')
                return
            }
        }

        if (STC_Search.P_EMP_ID !== null && STC_Search.P_EMP_ID.trim() !== '') {
            P_EMP_ID = STC_Search.P_EMP_ID
        } else {
            if (localStorage.getItem('TYPETOMAIN') === 'ISSUE') {
                alert('Please fill in Request by ID.')
                return
            }
        }

        if (STC_Search.P_EMP_NAME !== null && STC_Search.P_EMP_NAME.trim() !== '') {
            P_EMP_NAME = STC_Search.P_EMP_NAME
        }

        if (STC_Search.P_TYPE !== null && STC_Search.P_TYPE.trim() !== '') {
            if (STC_Search.P_TYPE === 'LOCT') {
                P_TYPE = `1,2`
            } else if (STC_Search.P_TYPE === 'IECT') {
                P_TYPE = `3,4`
            } else {
                P_TYPE = ''
            }
        }

        if (STC_Search.P_STATUS !== null) {
            P_STATUS = STC_Search.P_STATUS.value
        }

        if (STC_Search.P_SUBMIT_DATE_FRM !== null) {
            const dFrm = new Date(STC_Search.P_SUBMIT_DATE_FRM);
            P_SM_DATE_FRM = dFrm.getFullYear() + String(dFrm.getMonth() + 1).padStart(2, '0') + String(dFrm.getDate()).padStart(2, '0');
        }

        if (STC_Search.P_SUBMIT_DATE_TO !== null) {
            const dTo = new Date(STC_Search.P_SUBMIT_DATE_TO);
            P_SM_DATE_TO = dTo.getFullYear() + String(dTo.getMonth() + 1).padStart(2, '0') + String(dTo.getDate()).padStart(2, '0');
        }

        if (STC_Search.P_FISICAL_YEAR !== null) {
            P_FISICAL_YEAR = STC_Search.P_FISICAL_YEAR.value
        }

        if (STC_Search.P_MONTH_FRM !== null) {
            P_APP_MONTH_FRM = STC_Search.P_MONTH_FRM.value
        }

        if (STC_Search.P_MONTH_TO !== null) {
            P_APP_MONTH_TO = STC_Search.P_MONTH_TO.value
        }

        const Parameters = `?P_FACTORY=${P_FACTORY}&P_CC=${P_CC}&P_ISS_DATE_FRM=${P_ISS_DATE_FRM}&P_ISS_DATE_TO=${P_ISS_DATE_TO}&P_EMP_ID=${P_EMP_ID}&P_EMP_NAME=${P_EMP_NAME}&P_TYPE=${P_TYPE}&P_STATUS=${P_STATUS}&P_SM_DATE_FRM=${P_SM_DATE_FRM}&P_SM_DATE_TO=${P_SM_DATE_TO}&P_FISICAL_YEAR=${P_FISICAL_YEAR}&P_APP_MONTH_FRM=${P_APP_MONTH_FRM}&P_APP_MONTH_TO=${P_APP_MONTH_TO}&P_APP_BY=${P_APP_BY}&P_APP_FLAG=${P_APP_FLAG}`;

        setloading(true)
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API}/transaction/getDataMain${Parameters}`,
                {
                    headers: {
                        'Authorization': `Basic ${token}`,
                    },
                }
            );
            const data = await response.data;

            for (let i = 0; i < data.length; i++) {
                console.log(data[i]['LRH_FILESERVER'])
                if (data[i]['LRH_FILESERVER'] !== null) {
                    const typeFiles = data[i]['LRH_FILESERVER'].split('.');
                    const typeFile = typeFiles[typeFiles.length - 1]
                    data[i]['LRH_FILE_BL'] = base64ToFile(data[i]['LRH_SSH_FILE'], data[i]['LRH_FILESERVER'], typeFile);
                    data[i]['LRH_FILE_URL'] = URL.createObjectURL(base64ToFile(data[i]['LRH_SSH_FILE'], data[i]['LRH_FILESERVER'], typeFile))
                }
            }
            setdataMainList(data)
            setloading(false)
        } catch (error) {
            setloading(false)
            console.error("Error RequesterORType:", error);
            alert(error.message);
        }
    };

    const OnIssue = async () => {
        localStorage.setItem('TYPE_ACTION', 'ADD')
        localStorage.setItem('TYPEDOC', STC_Search.P_TYPE)
        localStorage.setItem('LOCT_IECT_NO', '')
        window.location.href = '/LOCTSystem/Transaction/Maintain';
    };

    const OnEdit = async (P_NO, P_ISS_TYPE) => {
        localStorage.setItem('TYPE_ACTION', 'EDIT')
        localStorage.setItem('TYPEDOC', P_ISS_TYPE)
        localStorage.setItem('LOCT_IECT_NO', P_NO)
        window.location.href = `/LOCTSystem/Transaction/Maintain?NO=${P_NO}`;
    };

    const OnView = async (P_NO, P_ISS_TYPE) => {
        localStorage.setItem('TYPE_ACTION', 'VIEW')
        localStorage.setItem('TYPEDOC', P_ISS_TYPE)
        localStorage.setItem('LOCT_IECT_NO', P_NO)
        window.open(`/LOCTSystem/Transaction/Maintain?NO=${P_NO}`, '_blank');
    };

    const OnExport = async () => {
        const dateR = new Date();
        const yearR = dateR.getFullYear();
        const monthR = String(dateR.getMonth() + 1).padStart(2, '0');
        const dayR = String(dateR.getDate()).padStart(2, '0');
        const hoursR = String(dateR.getHours()).padStart(2, '0');
        const minutesR = String(dateR.getMinutes()).padStart(2, '0');
        const secondsR = String(dateR.getSeconds()).padStart(2, '0');
        let typeReport = '';
        if (STC_Search.P_TYPE === 'LOCT') {
            typeReport = 'LOCT_Export';
        } else {
            typeReport = 'IECT_Export';
        }
        const Filename = typeReport + yearR + monthR + dayR + hoursR + minutesR + secondsR + '.xlsx';

        const table = tableRef.current;
        const workbook = XLSX.utils.table_to_book(table);
        XLSX.writeFile(workbook, Filename);
    };

    const handleChangeOpen = (ReqNo) => {
        setdataMainList(dataMainList.map(row =>
            row.LRH_REQ_NO === ReqNo ? { ...row, ['LRH_IS_OPEN']: !row.LRH_IS_OPEN } : { ...row, ['LRH_IS_OPEN']: false }
        ));
    };

    const handleChangeText = (ReqNo, field, value) => {
        setdataMainList(dataMainList.map(row =>
            row.LRH_REQ_NO === ReqNo ? { ...row, [field]: value } : row
        ));
    };

    const handleChangeDate = (ReqNo, field, event) => {
        setdataMainList(dataMainList.map(row =>
            row.LRH_REQ_NO === ReqNo ? { ...row, [field]: event } : row
        ));
    };

    const handleChangeRadio = (ReqNo, field, event) => {
        let CurrentDate;
        if (event.target.value === 'Y'){
            CurrentDate = new Date();
        }else{
            CurrentDate = null;
        }
        setdataMainList(dataMainList.map(row =>
            row.LRH_REQ_NO === ReqNo ? { ...row, [field]: event.target.value, ['LRH_EVALUATE_DATE']: CurrentDate } : row
        ));
    };

    const OnApprove = async (ReqNo) => {
        let STC_APP = {
            LRH_REQ_NO: ReqNo,
            LRH_REQ_STATUS: 'FN',
            LRH_PROBLEM: '',
            LRH_DET_BEFORE: '',
            LRH_DET_AFTER: '',
            LRH_MH_TSAVE: null,
            LRH_MC_TSAVE: null,
            LRH_EVALUATE_STS: '',
            LRH_EVALUATE_DATE: '',
            LRH_LEADER_RESULT: '',
            LRH_LEADER_COMMENT: ''
        }
        let filtered;
        filtered = dataMainList.filter(item => item.LRH_REQ_NO === ReqNo);
        if (filtered.length > 0) {
            if (filtered[0]['LRH_EVALUATE_STS'] === 'Y') {
                if (filtered[0]['LRH_EVALUATE_DATE'] !== null){
                    const dEV = new Date(filtered[0]['LRH_EVALUATE_DATE']);
                    let LRH_EVALUATE_DATE = dEV.getFullYear() + String(dEV.getMonth() + 1).padStart(2, '0') + String(dEV.getDate()).padStart(2, '0');
                    
                    STC_APP = {
                        ...STC_APP,
                        LRH_EVALUATE_STS: 'Y',
                        LRH_EVALUATE_DATE: LRH_EVALUATE_DATE
                    }
                }else{
                    alert('กรุณาเลือก Implement Date (วันที่ที่ปฎิบัติ)')
                    return
                }

            } else if (filtered[0]['LRH_EVALUATE_STS'] === 'N') {
                STC_APP = {
                    ...STC_APP,
                    LRH_EVALUATE_STS: 'N',
                    LRH_EVALUATE_DATE: ''
                }
            } else {
                alert('กรุณาเลือก Implement Activity')
                return
            }
            let Subject;
            Subject = filtered[0]['LRH_PROBLEM'].replace('(SL)', '').replace('(L)', '').replace('(SI)', '').replace('(I)', '')
            if (filtered[0]['LRH_PROBLEM'] === 'LOCT'){
                if (filtered[0]['LRH_SUMIT_TO_SG'] === 'Y'){
                    Subject = '(SL)' + Subject;
                }else{
                    Subject = '(L)' + Subject;
                }
            }else{
                if (filtered[0]['LRH_SUMIT_TO_SG'] === 'Y'){
                    Subject = '(SI)' + Subject;
                }else{
                    Subject = '(I)' + Subject;
                }
            }

            STC_APP = { ...STC_APP,
                        LRH_PROBLEM: Subject,
                        LRH_DET_BEFORE: filtered[0]['LRH_DET_BEFORE'],
                        LRH_DET_AFTER: filtered[0]['LRH_DET_AFTER'],
                        LRH_MH_TSAVE: filtered[0]['LRH_MH_TSAVE'],
                        LRH_MC_TSAVE: filtered[0]['LRH_MC_TSAVE'],
                        LRH_LEADER_RESULT: 'Y',
                        LRH_LEADER_COMMENT: filtered[0]['LRH_LEADER_COMMENT']}

        } else {
            alert('Please check data error.')
            return
        }
        setloading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API}/transaction/approveLOCT_IECT`, STC_APP,
                {
                    headers: {
                        'Authorization': `Basic ${token}`,
                    },
                }
            );
            const data = await response.data;
            if (response.status === 200) {
                alert("Approve completed.")
                OnSearch()
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

    const OnDeleted = async (ReqNo) => {
        setloading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API}/transaction/delLOCT_IECT?P_REQ_NO=${ReqNo}`, null,
                {
                    headers: {
                        'Authorization': `Basic ${token}`,
                    },
                }
            );
            const data = await response.data;
            if (response.status === 200) {
                alert("Delete completed.")
                OnSearch()
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

    return {
        loading,
        setloading,
        STC_Search,
        setSTC_Search,
        handleChangeFac,
        handleChangeCC,
        handleChangeIssFrm,
        handleChangeIssTo,
        handleInputChangeText,
        handleChangeRadito,
        OnSearch,
        OnIssue,
        OnExport,
        dataMainList,
        tableRef,
        OnEdit,
        handleChangeSubmitFrm,
        handleChangeSubmitTo,
        OnView,
        handleChangeStatus,
        handleChangeFisical,
        handleChangeMonthFrm,
        handleChangeMonthTo,
        handleChangeOpen,
        handleChangeText,
        handleChangeDate,
        handleChangeRadio,
        OnApprove,
        OnDeleted
    }
}

function GetStatusLOCT() {
    const [statusList, setstatusList] = useState([]);
    const StatusList = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API}/common/getStatusLOCT`,
                {
                    headers: {
                        'Authorization': `Basic ${token}`,
                    },
                });
            const data = await response.data;
            if (data.length > 0) {
                setstatusList(data);
            } else {
                alert(data)
            }
        } catch (error) {
            console.error("Error Factory.", error);
            alert(error.message);
        }
    };
    return { StatusList, statusList }
}

export { GetFactory, GetCostCenter, TransactionMain_Fn, GetStatusLOCT, GetYearMonth }