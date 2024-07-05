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

function GetTypeSGT() {
    const [sgtList, setsgtList] = useState([]);
    const TypeSGTList = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API}/transaction/getSGT_Type`,
                {
                    headers: {
                        'Authorization': `Basic ${token}`,
                    },
                });
            const data = await response.data;
            if (data.length > 0) {
                setsgtList(data);
            } else {
                alert(data)
            }
        } catch (error) {
            console.error("Error Factory.", error);
            alert(error.message);
        }
    };
    return { TypeSGTList, sgtList }
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
    else if (mimeType === 'pdf' || mimeType === 'doc' || mimeType === 'docx' || mimeType === 'pdf' || mimeType === 'doc' || mimeType === 'docx'|| mimeType === 'xls' || mimeType === 'xlsx' || mimeType === 'pptx') {
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

function TransactionDetail_Fn() {
    const now = new Date();
    const pad = (number) => (number < 10 ? '0' + number : number);
    const day = pad(now.getDate());
    const month = pad(now.getMonth() + 1); // เดือนใน JavaScript เริ่มจาก 0
    const year = now.getFullYear();
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());
    const ReqDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

    const tableRef = useRef(null);
    const [loading, setloading] = useState(false);
    const [STC_TEAM, setSTC_TEAM] = useState({
        T_EMP_ID: '',
        T_EMP_NAME: '',
        T_EMP_JOBGRAD: '',
        T_EMP_CC: ''
    });
    const [STC_FORM, setSTC_FORM] = useState({
        ISS_TYPE: localStorage.getItem('TYPEDOC'),
        LRH_REQ_NO: '',
        LRH_FACTORY: '',
        LRH_FACTORY_CODE: '',
        LRH_COST_CENTER: '',
        LRH_REQ_DATE: ReqDate,
        LRH_REQ_EMP_TYPE: '',
        LRH_REQ_BY: '',
        LRH_REQ_NAME: '',
        LRH_REQ_SURNAME: '',
        LRH_REQ_NAME_FULL: '',
        LRH_REQ_PROCESS: '',
        LRH_REQ_POSITION: '',
        LRH_REQ_MANAGER: '',
        LRH_REQ_MANAGER_NANE: '',
        LRH_REQ_STATUS: 'CT',
        LRH_REQ_STATUS_DESC: 'Create',
        LRH_FILENAME: '',
        LRH_FILESERVER: '',
        LRH_FILE_BL: null,
        LRH_FILE_URL: null,
        LRH_PROBLEM: '',
        LRH_DET_BEFORE: '',
        LRH_DET_AFTER: '',
        LRH_MH_OUTPUT: '',
        LRH_MH_FORECAST: '',
        LRH_MH_TSAVE: '',
        LRH_MC_WCODE: '',
        LRH_MC_WCOST: '',
        LRH_MC_TSAVE: '',
        LRH_EVALUATE_STS: '',
        LRH_EVALUATE_DATE: '',
        LRH_LEADER_RESULT: '',
        LRH_LEADER_APP_BY: '',
        LRH_LEADER_APP_NAME: '',
        LRH_LEADER_APP_DATE: '',
        LRH_LEADER_APP_FISCALYR: '',
        LRH_LEADER_COMMENT: '',
        LRH_SUMIT_TO_SG: '',
        LRH_SUMIT_TO_SG_BL: true,
        LRH_SG_TYPE: null,
        LRH_FILE_PATH: '',
        LRH_REQ_TYPE: '',
        LRH_SG_NO: '',
        LRH_LEADER_APP_MONTH: '',
        LRH_REQ_MONTH: '',
        LRH_SEND_DATE: '',
        LRH_REQ_TYPE_TEAM: '',
        SSH_SV_APP_BY: null,
        SSH_REQ_TYPE: '',
        SSH_TEAM_NAME: '',
        SSH_TEAM_BL: false,
        SSH_MEMBER_TEAM: [],
        LRH_SSH_FILE: ''
    });


    const GetData = async (P_NO) => {
        setloading(true)

        if (P_NO === '') {
            setSTC_FORM({
                ISS_TYPE: localStorage.getItem('TYPEDOC'),
                LRH_REQ_NO: '',
                LRH_FACTORY: '',
                LRH_FACTORY_CODE: '',
                LRH_COST_CENTER: '',
                LRH_REQ_DATE: ReqDate,
                LRH_REQ_EMP_TYPE: '',
                LRH_REQ_BY: '',
                LRH_REQ_NAME: '',
                LRH_REQ_SURNAME: '',
                LRH_REQ_NAME_FULL: '',
                LRH_REQ_PROCESS: '',
                LRH_REQ_POSITION: '',
                LRH_REQ_MANAGER: '',
                LRH_REQ_MANAGER_NANE: '',
                LRH_REQ_STATUS: 'CT',
                LRH_REQ_STATUS_DESC: 'Create',
                LRH_FILENAME: '',
                LRH_FILESERVER: '',
                LRH_FILE_BL: null,
                LRH_FILE_URL: null,
                LRH_PROBLEM: '',
                LRH_DET_BEFORE: '',
                LRH_DET_AFTER: '',
                LRH_MH_OUTPUT: '',
                LRH_MH_FORECAST: '',
                LRH_MH_TSAVE: '',
                LRH_MC_WCODE: '',
                LRH_MC_WCOST: '',
                LRH_MC_TSAVE: '',
                LRH_EVALUATE_STS: '',
                LRH_EVALUATE_DATE: '',
                LRH_LEADER_RESULT: '',
                LRH_LEADER_APP_BY: '',
                LRH_LEADER_APP_NAME: '',
                LRH_LEADER_APP_DATE: '',
                LRH_LEADER_APP_FISCALYR: '',
                LRH_LEADER_COMMENT: '',
                LRH_SUMIT_TO_SG: '',
                LRH_SUMIT_TO_SG_BL: true,
                LRH_SG_TYPE: null,
                LRH_FILE_PATH: '',
                LRH_REQ_TYPE: '',
                LRH_SG_NO: '',
                LRH_LEADER_APP_MONTH: '',
                LRH_REQ_MONTH: '',
                LRH_SEND_DATE: '',
                LRH_REQ_TYPE_TEAM: '',
                SSH_SV_APP_BY: null,
                SSH_REQ_TYPE: '',
                SSH_TEAM_NAME: '',
                SSH_TEAM_BL: false,
                SSH_MEMBER_TEAM: [],
                LRH_SSH_FILE: ''
            });
            setloading(false)
        } else {

            try {

                const response = await axios.get(
                    `${import.meta.env.VITE_API}/transaction/getDataDetail?P_NO=${P_NO}`,
                    {
                        headers: {
                            'Authorization': `Basic ${token}`,
                        },
                    }
                );
                let data = await response.data;
                
                if (data['LRH_FILESERVER'] !== null) {
                    const typeFiles = data['LRH_FILESERVER'].split('.');
                    const typeFile = typeFiles[typeFiles.length - 1]
                    data['LRH_FILE_BL'] = base64ToFile(data['LRH_SSH_FILE'], data['LRH_FILESERVER'], typeFile);
                    data['LRH_FILE_URL'] = URL.createObjectURL(data['LRH_FILE_BL'])
                }

                setSTC_FORM(data)
                setloading(false)

            } catch (error) {
                setloading(false)
                console.error("Error RequesterORType:", error);
                alert(error.message);
            }
        }

    };


    const handleChangeSGType = (event) => {
        setSTC_FORM({
            ISS_TYPE: STC_FORM.ISS_TYPE,
            LRH_REQ_NO: STC_FORM.LRH_REQ_NO,
            LRH_FACTORY: STC_FORM.LRH_FACTORY,
            LRH_FACTORY_CODE: STC_FORM.LRH_FACTORY_CODE,
            LRH_COST_CENTER: STC_FORM.LRH_COST_CENTER,
            LRH_REQ_DATE: STC_FORM.LRH_REQ_DATE,
            LRH_REQ_EMP_TYPE: STC_FORM.LRH_REQ_EMP_TYPE,
            LRH_REQ_BY: STC_FORM.LRH_REQ_BY,
            LRH_REQ_NAME: STC_FORM.LRH_REQ_NAME,
            LRH_REQ_SURNAME: STC_FORM.LRH_REQ_SURNAME,
            LRH_REQ_NAME_FULL: STC_FORM.LRH_REQ_NAME_FULL,
            LRH_REQ_PROCESS: STC_FORM.LRH_REQ_POSITION,
            LRH_REQ_POSITION: STC_FORM.LRH_REQ_POSITION,
            LRH_REQ_MANAGER: STC_FORM.LRH_REQ_MANAGER,
            LRH_REQ_MANAGER_NANE: STC_FORM.LRH_REQ_MANAGER_NANE,
            LRH_REQ_STATUS: STC_FORM.LRH_REQ_STATUS,
            LRH_REQ_STATUS_DESC: STC_FORM.LRH_REQ_STATUS_DESC,
            LRH_FILENAME: STC_FORM.LRH_FILENAME,
            LRH_FILESERVER: STC_FORM.LRH_FILESERVER,
            LRH_FILE_BL: STC_FORM.LRH_FILE_BL,
            LRH_FILE_URL: STC_FORM.LRH_FILE_URL,
            LRH_PROBLEM: STC_FORM.LRH_PROBLEM,
            LRH_DET_BEFORE: STC_FORM.LRH_DET_BEFORE,
            LRH_DET_AFTER: STC_FORM.LRH_DET_AFTER,
            LRH_MH_OUTPUT: STC_FORM.LRH_MH_OUTPUT,
            LRH_MH_FORECAST: STC_FORM.LRH_MH_FORECAST,
            LRH_MH_TSAVE: STC_FORM.LRH_MH_TSAVE,
            LRH_MC_WCODE: STC_FORM.LRH_MC_WCODE,
            LRH_MC_WCOST: STC_FORM.LRH_MC_WCOST,
            LRH_MC_TSAVE: STC_FORM.LRH_MC_TSAVE,
            LRH_EVALUATE_STS: STC_FORM.LRH_EVALUATE_STS,
            LRH_EVALUATE_DATE: STC_FORM.LRH_EVALUATE_DATE,
            LRH_LEADER_RESULT: STC_FORM.LRH_LEADER_RESULT,
            LRH_LEADER_APP_BY: STC_FORM.LRH_LEADER_APP_BY,
            LRH_LEADER_APP_NAME: STC_FORM.LRH_LEADER_APP_NAME,
            LRH_LEADER_APP_DATE: STC_FORM.LRH_LEADER_APP_DATE,
            LRH_LEADER_APP_FISCALYR: STC_FORM.LRH_LEADER_APP_FISCALYR,
            LRH_LEADER_COMMENT: STC_FORM.LRH_LEADER_COMMENT,
            LRH_SUMIT_TO_SG: STC_FORM.LRH_SUMIT_TO_SG,
            LRH_SUMIT_TO_SG_BL: STC_FORM.LRH_SUMIT_TO_SG_BL,
            LRH_SG_TYPE: event,
            LRH_FILE_PATH: STC_FORM.LRH_FILE_PATH,
            LRH_REQ_TYPE: STC_FORM.LRH_REQ_TYPE,
            LRH_SG_NO: STC_FORM.LRH_SG_NO,
            LRH_LEADER_APP_MONTH: STC_FORM.LRH_LEADER_APP_MONTH,
            LRH_REQ_MONTH: STC_FORM.LRH_REQ_MONTH,
            LRH_SEND_DATE: STC_FORM.LRH_SEND_DATE,
            LRH_REQ_TYPE_TEAM: STC_FORM.LRH_REQ_TYPE_TEAM,
            SSH_SV_APP_BY: STC_FORM.SSH_SV_APP_BY,
            SSH_REQ_TYPE: STC_FORM.SSH_REQ_TYPE,
            SSH_TEAM_NAME: STC_FORM.SSH_TEAM_NAME,
            SSH_TEAM_BL: STC_FORM.SSH_TEAM_BL,
            SSH_MEMBER_TEAM: STC_FORM.SSH_MEMBER_TEAM,
            LRH_SSH_FILE: STC_FORM.LRH_SSH_FILE
        })
    };


    const handleInputChangeText = (e) => {
        const { name, value } = e.target;
        setSTC_FORM(prevState => ({
            ...prevState,
            [name]: value
        }));
        if (name === 'LRH_REQ_BY' && value.length === 7) {
            GetDataUser(name, value)
        } else if (name === 'LRH_LEADER_APP_BY' && value.length === 7) {
            if (value === STC_FORM.LRH_REQ_BY) {
                alert('ไม่อนุญาตให้ใช้รหัสพนักงานเดียวกับผู้ออกเอกสาร')
                setSTC_FORM(prevState => ({
                    ...prevState,
                    [name]: ''
                }));
            } else {
                GetDataUser(name, value)
            }
        }
    };

    const GetDataUser = async (fname, empID) => {
        setloading(fname === 'LRH_REQ_BY')
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
                let teamType = '';
                if (data[0]['EPM_LEVEL'] === 'TA' || data[0]['EPM_LEVEL'] === 'TE' || data[0]['EPM_LEVEL'] === 'TI' || data[0]['EPM_LEVEL'] === 'TS') {
                    teamType = 'RTY001'
                } else {
                    teamType = 'RTY002'
                }
                if (fname === 'LRH_REQ_BY') {
                    setSTC_FORM({
                        ISS_TYPE: STC_FORM.ISS_TYPE,
                        LRH_REQ_NO: STC_FORM.LRH_REQ_NO,
                        LRH_FACTORY: data[0]['EMP_FAC_DESC'],
                        LRH_FACTORY_CODE: data[0]['EMP_FAC_CODE'],
                        LRH_COST_CENTER: data[0]['EMP_CC'],
                        LRH_REQ_DATE: STC_FORM.LRH_REQ_DATE,
                        LRH_REQ_EMP_TYPE: data[0]['EMP_TYPE'],
                        LRH_REQ_BY: data[0]['EMP_ID'],
                        LRH_REQ_NAME: data[0]['EMP_F_NAME'],
                        LRH_REQ_SURNAME: data[0]['EMP_S_NAME'],
                        LRH_REQ_NAME_FULL: data[0]['EMP_NAME'],
                        LRH_REQ_PROCESS: data[0]['EMP_PROC'],
                        LRH_REQ_POSITION: data[0]['EPM_LEVEL'],
                        LRH_REQ_MANAGER: data[0]['EMP_BOSS'],
                        LRH_REQ_MANAGER_NANE: data[0]['BOSS_NAME'],
                        LRH_REQ_STATUS: STC_FORM.LRH_REQ_STATUS,
                        LRH_REQ_STATUS_DESC: STC_FORM.LRH_REQ_STATUS_DESC,
                        LRH_FILENAME: STC_FORM.LRH_FILENAME,
                        LRH_FILESERVER: STC_FORM.LRH_FILESERVER,
                        LRH_FILE_BL: STC_FORM.LRH_FILE_BL,
                        LRH_FILE_URL: STC_FORM.LRH_FILE_URL,
                        LRH_PROBLEM: STC_FORM.LRH_PROBLEM,
                        LRH_DET_BEFORE: STC_FORM.LRH_DET_BEFORE,
                        LRH_DET_AFTER: STC_FORM.LRH_DET_AFTER,
                        LRH_MH_OUTPUT: STC_FORM.LRH_MH_OUTPUT,
                        LRH_MH_FORECAST: STC_FORM.LRH_MH_FORECAST,
                        LRH_MH_TSAVE: STC_FORM.LRH_MH_TSAVE,
                        LRH_MC_WCODE: STC_FORM.LRH_MC_WCODE,
                        LRH_MC_WCOST: STC_FORM.LRH_MC_WCOST,
                        LRH_MC_TSAVE: STC_FORM.LRH_MC_TSAVE,
                        LRH_EVALUATE_STS: STC_FORM.LRH_EVALUATE_STS,
                        LRH_EVALUATE_DATE: STC_FORM.LRH_EVALUATE_DATE,
                        LRH_LEADER_RESULT: STC_FORM.LRH_LEADER_RESULT,
                        LRH_LEADER_APP_BY: STC_FORM.LRH_LEADER_APP_BY,
                        LRH_LEADER_APP_NAME: STC_FORM.LRH_LEADER_APP_NAME,
                        LRH_LEADER_APP_DATE: STC_FORM.LRH_LEADER_APP_DATE,
                        LRH_LEADER_APP_FISCALYR: STC_FORM.LRH_LEADER_APP_FISCALYR,
                        LRH_LEADER_COMMENT: STC_FORM.LRH_LEADER_COMMENT,
                        LRH_SUMIT_TO_SG: STC_FORM.LRH_SUMIT_TO_SG,
                        LRH_SUMIT_TO_SG_BL: false,
                        LRH_SG_TYPE: STC_FORM.LRH_SG_TYPE,
                        LRH_FILE_PATH: STC_FORM.LRH_FILE_PATH,
                        LRH_REQ_TYPE: STC_FORM.LRH_REQ_TYPE,
                        LRH_SG_NO: STC_FORM.LRH_SG_NO,
                        LRH_LEADER_APP_MONTH: STC_FORM.LRH_LEADER_APP_MONTH,
                        LRH_REQ_MONTH: STC_FORM.LRH_REQ_MONTH,
                        LRH_SEND_DATE: STC_FORM.LRH_SEND_DATE,
                        LRH_REQ_TYPE_TEAM: STC_FORM.LRH_REQ_TYPE_TEAM,
                        SSH_SV_APP_BY: STC_FORM.SSH_SV_APP_BY,
                        SSH_REQ_TYPE: teamType,
                        SSH_TEAM_NAME: STC_FORM.SSH_TEAM_NAME,
                        SSH_TEAM_BL: STC_FORM.SSH_TEAM_BL,
                        SSH_MEMBER_TEAM: STC_FORM.SSH_MEMBER_TEAM,
                        LRH_SSH_FILE: STC_FORM.LRH_SSH_FILE
                    })
                } else if (fname === 'LRH_LEADER_APP_BY') {
                    setSTC_FORM({
                        ISS_TYPE: STC_FORM.ISS_TYPE,
                        LRH_REQ_NO: STC_FORM.LRH_REQ_NO,
                        LRH_FACTORY: STC_FORM.LRH_FACTORY,
                        LRH_FACTORY_CODE: STC_FORM.LRH_FACTORY_CODE,
                        LRH_COST_CENTER: STC_FORM.LRH_COST_CENTER,
                        LRH_REQ_DATE: STC_FORM.LRH_REQ_DATE,
                        LRH_REQ_EMP_TYPE: STC_FORM.LRH_REQ_EMP_TYPE,
                        LRH_REQ_BY: STC_FORM.LRH_REQ_BY,
                        LRH_REQ_NAME: STC_FORM.LRH_REQ_NAME,
                        LRH_REQ_SURNAME: STC_FORM.LRH_REQ_SURNAME,
                        LRH_REQ_NAME_FULL: STC_FORM.LRH_REQ_NAME_FULL,
                        LRH_REQ_PROCESS: STC_FORM.LRH_REQ_POSITION,
                        LRH_REQ_POSITION: STC_FORM.LRH_REQ_POSITION,
                        LRH_REQ_MANAGER: STC_FORM.LRH_REQ_MANAGER,
                        LRH_REQ_MANAGER_NANE: STC_FORM.LRH_REQ_MANAGER_NANE,
                        LRH_REQ_STATUS: STC_FORM.LRH_REQ_STATUS,
                        LRH_REQ_STATUS_DESC: STC_FORM.LRH_REQ_STATUS_DESC,
                        LRH_FILENAME: STC_FORM.LRH_FILENAME,
                        LRH_FILESERVER: STC_FORM.LRH_FILESERVER,
                        LRH_FILE_BL: STC_FORM.LRH_FILE_BL,
                        LRH_FILE_URL: STC_FORM.LRH_FILE_URL,
                        LRH_PROBLEM: STC_FORM.LRH_PROBLEM,
                        LRH_DET_BEFORE: STC_FORM.LRH_DET_BEFORE,
                        LRH_DET_AFTER: STC_FORM.LRH_DET_AFTER,
                        LRH_MH_OUTPUT: STC_FORM.LRH_MH_OUTPUT,
                        LRH_MH_FORECAST: STC_FORM.LRH_MH_FORECAST,
                        LRH_MH_TSAVE: STC_FORM.LRH_MH_TSAVE,
                        LRH_MC_WCODE: STC_FORM.LRH_MC_WCODE,
                        LRH_MC_WCOST: STC_FORM.LRH_MC_WCOST,
                        LRH_MC_TSAVE: STC_FORM.LRH_MC_TSAVE,
                        LRH_EVALUATE_STS: STC_FORM.LRH_EVALUATE_STS,
                        LRH_EVALUATE_DATE: STC_FORM.LRH_EVALUATE_DATE,
                        LRH_LEADER_RESULT: STC_FORM.LRH_LEADER_RESULT,
                        LRH_LEADER_APP_BY: data[0]['EMP_ID'],
                        LRH_LEADER_APP_NAME: data[0]['EMP_NAME'],
                        LRH_LEADER_APP_DATE: STC_FORM.LRH_LEADER_APP_DATE,
                        LRH_LEADER_APP_FISCALYR: STC_FORM.LRH_LEADER_APP_FISCALYR,
                        LRH_LEADER_COMMENT: STC_FORM.LRH_LEADER_COMMENT,
                        LRH_SUMIT_TO_SG: STC_FORM.LRH_SUMIT_TO_SG,
                        LRH_SUMIT_TO_SG_BL: STC_FORM.LRH_SUMIT_TO_SG_BL,
                        LRH_SG_TYPE: STC_FORM.LRH_SG_TYPE,
                        LRH_FILE_PATH: STC_FORM.LRH_FILE_PATH,
                        LRH_REQ_TYPE: STC_FORM.LRH_REQ_TYPE,
                        LRH_SG_NO: STC_FORM.LRH_SG_NO,
                        LRH_LEADER_APP_MONTH: STC_FORM.LRH_LEADER_APP_MONTH,
                        LRH_REQ_MONTH: STC_FORM.LRH_REQ_MONTH,
                        LRH_SEND_DATE: STC_FORM.LRH_SEND_DATE,
                        LRH_REQ_TYPE_TEAM: STC_FORM.LRH_REQ_TYPE_TEAM,
                        SSH_SV_APP_BY: STC_FORM.SSH_SV_APP_BY,
                        SSH_REQ_TYPE: STC_FORM.SSH_REQ_TYPE,
                        SSH_TEAM_NAME: STC_FORM.SSH_TEAM_NAME,
                        SSH_TEAM_BL: STC_FORM.SSH_TEAM_BL,
                        SSH_MEMBER_TEAM: STC_FORM.SSH_MEMBER_TEAM,
                        LRH_SSH_FILE: STC_FORM.LRH_SSH_FILE
                    })
                } else if (fname === 'T_EMP_ID') {
                    setSTC_TEAM({
                        T_EMP_ID: data[0]['EMP_ID'],
                        T_EMP_NAME: data[0]['EMP_NAME'],
                        T_EMP_JOBGRAD: data[0]['EPM_LEVEL'],
                        T_EMP_CC: data[0]['EMP_CC']
                    });
                }

            }
            setloading(false)


        } catch (error) {
            setloading(false)
            console.error("Error RequesterORType:", error);
            alert(error.message);
        }

    };

    const handleChangeRaditoReqSGT = (e) => {
        let reqType = '';
        if (e.target.value === 'Y') {
            if (STC_FORM.ISS_TYPE === 'LOCT') {
                reqType = '1'
            } else {
                reqType = '3'
            }
        } else if (e.target.value === 'N') {
            if (STC_FORM.ISS_TYPE === 'LOCT') {
                reqType = '2'
            } else {
                reqType = '4'
            }
        } else {
            reqType = '5'
        }

        setSTC_FORM({
            ISS_TYPE: STC_FORM.ISS_TYPE,
            LRH_REQ_NO: STC_FORM.LRH_REQ_NO,
            LRH_FACTORY: STC_FORM.LRH_FACTORY,
            LRH_FACTORY_CODE: STC_FORM.LRH_FACTORY_CODE,
            LRH_COST_CENTER: STC_FORM.LRH_COST_CENTER,
            LRH_REQ_DATE: STC_FORM.LRH_REQ_DATE,
            LRH_REQ_EMP_TYPE: STC_FORM.LRH_REQ_EMP_TYPE,
            LRH_REQ_BY: STC_FORM.LRH_REQ_BY,
            LRH_REQ_NAME: STC_FORM.LRH_REQ_NAME,
            LRH_REQ_SURNAME: STC_FORM.LRH_REQ_SURNAME,
            LRH_REQ_NAME_FULL: STC_FORM.LRH_REQ_NAME_FULL,
            LRH_REQ_PROCESS: STC_FORM.LRH_REQ_POSITION,
            LRH_REQ_POSITION: STC_FORM.LRH_REQ_POSITION,
            LRH_REQ_MANAGER: STC_FORM.LRH_REQ_MANAGER,
            LRH_REQ_MANAGER_NANE: STC_FORM.LRH_REQ_MANAGER_NANE,
            LRH_REQ_STATUS: STC_FORM.LRH_REQ_STATUS,
            LRH_REQ_STATUS_DESC: STC_FORM.LRH_REQ_STATUS_DESC,
            LRH_FILENAME: STC_FORM.LRH_FILENAME,
            LRH_FILESERVER: STC_FORM.LRH_FILESERVER,
            LRH_FILE_BL: STC_FORM.LRH_FILE_BL,
            LRH_FILE_URL: STC_FORM.LRH_FILE_URL,
            LRH_PROBLEM: STC_FORM.LRH_PROBLEM,
            LRH_DET_BEFORE: STC_FORM.LRH_DET_BEFORE,
            LRH_DET_AFTER: STC_FORM.LRH_DET_AFTER,
            LRH_MH_OUTPUT: STC_FORM.LRH_MH_OUTPUT,
            LRH_MH_FORECAST: STC_FORM.LRH_MH_FORECAST,
            LRH_MH_TSAVE: STC_FORM.LRH_MH_TSAVE,
            LRH_MC_WCODE: STC_FORM.LRH_MC_WCODE,
            LRH_MC_WCOST: STC_FORM.LRH_MC_WCOST,
            LRH_MC_TSAVE: STC_FORM.LRH_MC_TSAVE,
            LRH_EVALUATE_STS: STC_FORM.LRH_EVALUATE_STS,
            LRH_EVALUATE_DATE: STC_FORM.LRH_EVALUATE_DATE,
            LRH_LEADER_RESULT: STC_FORM.LRH_LEADER_RESULT,
            LRH_LEADER_APP_BY: STC_FORM.LRH_LEADER_APP_BY,
            LRH_LEADER_APP_NAME: STC_FORM.LRH_LEADER_APP_NAME,
            LRH_LEADER_APP_DATE: STC_FORM.LRH_LEADER_APP_DATE,
            LRH_LEADER_APP_FISCALYR: STC_FORM.LRH_LEADER_APP_FISCALYR,
            LRH_LEADER_COMMENT: STC_FORM.LRH_LEADER_COMMENT,
            LRH_SUMIT_TO_SG: e.target.value,
            LRH_SUMIT_TO_SG_BL: STC_FORM.LRH_SUMIT_TO_SG_BL,
            LRH_SG_TYPE: STC_FORM.LRH_SG_TYPE,
            LRH_FILE_PATH: STC_FORM.LRH_FILE_PATH,
            LRH_REQ_TYPE: reqType,
            LRH_SG_NO: STC_FORM.LRH_SG_NO,
            LRH_LEADER_APP_MONTH: STC_FORM.LRH_LEADER_APP_MONTH,
            LRH_REQ_MONTH: STC_FORM.LRH_REQ_MONTH,
            LRH_SEND_DATE: STC_FORM.LRH_SEND_DATE,
            LRH_REQ_TYPE_TEAM: STC_FORM.LRH_REQ_TYPE_TEAM,
            SSH_SV_APP_BY: STC_FORM.SSH_SV_APP_BY,
            SSH_REQ_TYPE: STC_FORM.SSH_REQ_TYPE,
            SSH_TEAM_NAME: STC_FORM.SSH_TEAM_NAME,
            SSH_TEAM_BL: STC_FORM.SSH_TEAM_BL,
            SSH_MEMBER_TEAM: STC_FORM.SSH_MEMBER_TEAM,
            LRH_SSH_FILE: STC_FORM.LRH_SSH_FILE
        })
        if (e.target.value === '5' || e.target.value === 'Y') {
            SuppervisorList()
        }
    };

    const OnClearRequester = async () => {
        setSTC_FORM({
            ISS_TYPE: STC_FORM.ISS_TYPE,
            LRH_REQ_NO: STC_FORM.LRH_REQ_NO,
            LRH_FACTORY: '',
            LRH_FACTORY_CODE: '',
            LRH_COST_CENTER: '',
            LRH_REQ_DATE: STC_FORM.LRH_REQ_DATE,
            LRH_REQ_EMP_TYPE: '',
            LRH_REQ_BY: '',
            LRH_REQ_NAME: '',
            LRH_REQ_SURNAME: '',
            LRH_REQ_NAME_FULL: '',
            LRH_REQ_PROCESS: '',
            LRH_REQ_POSITION: '',
            LRH_REQ_MANAGER: '',
            LRH_REQ_MANAGER_NANE: '',
            LRH_REQ_STATUS: STC_FORM.LRH_REQ_STATUS,
            LRH_REQ_STATUS_DESC: STC_FORM.LRH_REQ_STATUS_DESC,
            LRH_FILENAME: STC_FORM.LRH_FILENAME,
            LRH_FILESERVER: STC_FORM.LRH_FILESERVER,
            LRH_FILE_BL: STC_FORM.LRH_FILE_BL,
            LRH_FILE_URL: STC_FORM.LRH_FILE_URL,
            LRH_PROBLEM: STC_FORM.LRH_PROBLEM,
            LRH_DET_BEFORE: STC_FORM.LRH_DET_BEFORE,
            LRH_DET_AFTER: STC_FORM.LRH_DET_AFTER,
            LRH_MH_OUTPUT: STC_FORM.LRH_MH_OUTPUT,
            LRH_MH_FORECAST: STC_FORM.LRH_MH_FORECAST,
            LRH_MH_TSAVE: STC_FORM.LRH_MH_TSAVE,
            LRH_MC_WCODE: STC_FORM.LRH_MC_WCODE,
            LRH_MC_WCOST: STC_FORM.LRH_MC_WCOST,
            LRH_MC_TSAVE: STC_FORM.LRH_MC_TSAVE,
            LRH_EVALUATE_STS: STC_FORM.LRH_EVALUATE_STS,
            LRH_EVALUATE_DATE: STC_FORM.LRH_EVALUATE_DATE,
            LRH_LEADER_RESULT: STC_FORM.LRH_LEADER_RESULT,
            LRH_LEADER_APP_BY: STC_FORM.LRH_LEADER_APP_BY,
            LRH_LEADER_APP_NAME: STC_FORM.LRH_LEADER_APP_NAME,
            LRH_LEADER_APP_DATE: STC_FORM.LRH_LEADER_APP_DATE,
            LRH_LEADER_APP_FISCALYR: STC_FORM.LRH_LEADER_APP_FISCALYR,
            LRH_LEADER_COMMENT: STC_FORM.LRH_LEADER_COMMENT,
            LRH_SUMIT_TO_SG: '',
            LRH_SUMIT_TO_SG_BL: true,
            LRH_SG_TYPE: STC_FORM.LRH_SG_TYPE,
            LRH_FILE_PATH: STC_FORM.LRH_FILE_PATH,
            LRH_REQ_TYPE: '',
            LRH_SG_NO: STC_FORM.LRH_SG_NO,
            LRH_LEADER_APP_MONTH: STC_FORM.LRH_LEADER_APP_MONTH,
            LRH_REQ_MONTH: STC_FORM.LRH_REQ_MONTH,
            LRH_SEND_DATE: STC_FORM.LRH_SEND_DATE,
            LRH_REQ_TYPE_TEAM: STC_FORM.LRH_REQ_TYPE_TEAM,
            SSH_SV_APP_BY: STC_FORM.SSH_SV_APP_BY,
            SSH_REQ_TYPE: STC_FORM.SSH_REQ_TYPE,
            SSH_TEAM_NAME: STC_FORM.SSH_TEAM_NAME,
            SSH_TEAM_BL: STC_FORM.SSH_TEAM_BL,
            SSH_MEMBER_TEAM: STC_FORM.SSH_MEMBER_TEAM,
            LRH_SSH_FILE: STC_FORM.LRH_SSH_FILE
        })
    };

    const OnClearLeader = async () => {
        setSTC_FORM({
            ISS_TYPE: STC_FORM.ISS_TYPE,
            LRH_REQ_NO: STC_FORM.LRH_REQ_NO,
            LRH_FACTORY: STC_FORM.LRH_FACTORY,
            LRH_FACTORY_CODE: STC_FORM.LRH_FACTORY_CODE,
            LRH_COST_CENTER: STC_FORM.LRH_COST_CENTER,
            LRH_REQ_DATE: STC_FORM.LRH_REQ_DATE,
            LRH_REQ_EMP_TYPE: STC_FORM.LRH_REQ_EMP_TYPE,
            LRH_REQ_BY: STC_FORM.LRH_REQ_BY,
            LRH_REQ_NAME: STC_FORM.LRH_REQ_NAME,
            LRH_REQ_SURNAME: STC_FORM.LRH_REQ_SURNAME,
            LRH_REQ_NAME_FULL: STC_FORM.LRH_REQ_NAME_FULL,
            LRH_REQ_PROCESS: STC_FORM.LRH_REQ_POSITION,
            LRH_REQ_POSITION: STC_FORM.LRH_REQ_POSITION,
            LRH_REQ_MANAGER: STC_FORM.LRH_REQ_MANAGER,
            LRH_REQ_MANAGER_NANE: STC_FORM.LRH_REQ_MANAGER_NANE,
            LRH_REQ_STATUS: STC_FORM.LRH_REQ_STATUS,
            LRH_REQ_STATUS_DESC: STC_FORM.LRH_REQ_STATUS_DESC,
            LRH_FILENAME: STC_FORM.LRH_FILENAME,
            LRH_FILESERVER: STC_FORM.LRH_FILESERVER,
            LRH_FILE_BL: STC_FORM.LRH_FILE_BL,
            LRH_FILE_URL: STC_FORM.LRH_FILE_URL,
            LRH_PROBLEM: STC_FORM.LRH_PROBLEM,
            LRH_DET_BEFORE: STC_FORM.LRH_DET_BEFORE,
            LRH_DET_AFTER: STC_FORM.LRH_DET_AFTER,
            LRH_MH_OUTPUT: STC_FORM.LRH_MH_OUTPUT,
            LRH_MH_FORECAST: STC_FORM.LRH_MH_FORECAST,
            LRH_MH_TSAVE: STC_FORM.LRH_MH_TSAVE,
            LRH_MC_WCODE: STC_FORM.LRH_MC_WCODE,
            LRH_MC_WCOST: STC_FORM.LRH_MC_WCOST,
            LRH_MC_TSAVE: STC_FORM.LRH_MC_TSAVE,
            LRH_EVALUATE_STS: STC_FORM.LRH_EVALUATE_STS,
            LRH_EVALUATE_DATE: STC_FORM.LRH_EVALUATE_DATE,
            LRH_LEADER_RESULT: STC_FORM.LRH_LEADER_RESULT,
            LRH_LEADER_APP_BY: '',
            LRH_LEADER_APP_NAME: '',
            LRH_LEADER_APP_DATE: STC_FORM.LRH_LEADER_APP_DATE,
            LRH_LEADER_APP_FISCALYR: STC_FORM.LRH_LEADER_APP_FISCALYR,
            LRH_LEADER_COMMENT: STC_FORM.LRH_LEADER_COMMENT,
            LRH_SUMIT_TO_SG: STC_FORM.LRH_SUMIT_TO_SG,
            LRH_SUMIT_TO_SG_BL: STC_FORM.LRH_SUMIT_TO_SG_BL,
            LRH_SG_TYPE: STC_FORM.LRH_SG_TYPE,
            LRH_FILE_PATH: STC_FORM.LRH_FILE_PATH,
            LRH_REQ_TYPE: STC_FORM.LRH_REQ_TYPE,
            LRH_SG_NO: STC_FORM.LRH_SG_NO,
            LRH_LEADER_APP_MONTH: STC_FORM.LRH_LEADER_APP_MONTH,
            LRH_REQ_MONTH: STC_FORM.LRH_REQ_MONTH,
            LRH_SEND_DATE: STC_FORM.LRH_SEND_DATE,
            LRH_REQ_TYPE_TEAM: STC_FORM.LRH_REQ_TYPE_TEAM,
            SSH_SV_APP_BY: STC_FORM.SSH_SV_APP_BY,
            SSH_REQ_TYPE: STC_FORM.SSH_REQ_TYPE,
            SSH_TEAM_NAME: STC_FORM.SSH_TEAM_NAME,
            SSH_TEAM_BL: STC_FORM.SSH_TEAM_BL,
            SSH_MEMBER_TEAM: STC_FORM.SSH_MEMBER_TEAM,
            LRH_SSH_FILE: STC_FORM.LRH_SSH_FILE
        })
    };

    const OnSave = async () => {
        // console.log(STC_FORM)
        let P_STATUS = STC_FORM.LRH_REQ_STATUS;
        let P_STATUS_SG = STC_FORM.LRH_REQ_STATUS;
        setloading(true);
        try {

            const response = await axios.post(
                `${import.meta.env.VITE_API}/transaction/MergHeader?P_STATUS=${P_STATUS}&P_STATUS_SG=${P_STATUS_SG}`, STC_FORM,
                {
                    headers: {
                        'Authorization': `Basic ${token}`,
                    },
                }
            );
            const data = await response.data;
            if (response.status === 200) {
                alert("Save completed.")
                setloading(false);
                localStorage.setItem('TYPEDOC', '')
                localStorage.setItem('LOCT_IECT_NO', '')
                window.location.href = `/LOCTSystem/Transaction?P_TYPE=ISSUE&P_REQTYPE=${STC_FORM.ISS_TYPE}`;
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

    const OnSubmit = async () => {
        setloading(true);
        let P_STATUS = 'WT';
        let P_STATUS_SG = 'SV';
        // if (STC_FORM.LRH_REQ_TYPE === '5'){
        //     P_STATUS = 'SV'
        // }else{
        //     P_STATUS = 'WT'
        // }

        try {

            const response = await axios.post(
                `${import.meta.env.VITE_API}/transaction/MergHeader?P_STATUS=${P_STATUS}&P_STATUS_SG=${P_STATUS_SG}`, STC_FORM,
                {
                    headers: {
                        'Authorization': `Basic ${token}`,
                    },
                }
            );
            const data = await response.data;
            if (response.status === 200) {
                alert("Submit completed.")
                localStorage.setItem('TYPEDOC', '')
                localStorage.setItem('LOCT_IECT_NO', '')
                window.location.href = `/LOCTSystem/Transaction?P_TYPE=ISSUE&P_REQTYPE=${STC_FORM.ISS_TYPE}`;
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

    const OnReset = async () => {
        GetData(STC_FORM.LRH_REQ_NO)
    };

    const [supList, setsupList] = useState([]);
    const SuppervisorList = async () => {
        // setloading(true)
        try {
            const response = await axios.get(`${import.meta.env.VITE_API}/transaction/getSup_SGT?P_FACTORY=${STC_FORM.LRH_FACTORY_CODE}&P_CC=${STC_FORM.LRH_COST_CENTER}`,
                {
                    headers: {
                        'Authorization': `Basic ${token}`,
                    },
                });
            const data = await response.data;
            setsupList(data);
            setloading(false)
        } catch (error) {
            setloading(false)
            console.error("Error Factory.", error);
            alert(error.message);
        }
    };

    const handleChangeSup = (event) => {
        setSTC_FORM({
            ISS_TYPE: STC_FORM.ISS_TYPE,
            LRH_REQ_NO: STC_FORM.LRH_REQ_NO,
            LRH_FACTORY: STC_FORM.LRH_FACTORY,
            LRH_FACTORY_CODE: STC_FORM.LRH_FACTORY_CODE,
            LRH_COST_CENTER: STC_FORM.LRH_COST_CENTER,
            LRH_REQ_DATE: STC_FORM.LRH_REQ_DATE,
            LRH_REQ_EMP_TYPE: STC_FORM.LRH_REQ_EMP_TYPE,
            LRH_REQ_BY: STC_FORM.LRH_REQ_BY,
            LRH_REQ_NAME: STC_FORM.LRH_REQ_NAME,
            LRH_REQ_SURNAME: STC_FORM.LRH_REQ_SURNAME,
            LRH_REQ_NAME_FULL: STC_FORM.LRH_REQ_NAME_FULL,
            LRH_REQ_PROCESS: STC_FORM.LRH_REQ_POSITION,
            LRH_REQ_POSITION: STC_FORM.LRH_REQ_POSITION,
            LRH_REQ_MANAGER: STC_FORM.LRH_REQ_MANAGER,
            LRH_REQ_MANAGER_NANE: STC_FORM.LRH_REQ_MANAGER_NANE,
            LRH_REQ_STATUS: STC_FORM.LRH_REQ_STATUS,
            LRH_REQ_STATUS_DESC: STC_FORM.LRH_REQ_STATUS_DESC,
            LRH_FILENAME: STC_FORM.LRH_FILENAME,
            LRH_FILESERVER: STC_FORM.LRH_FILESERVER,
            LRH_FILE_BL: STC_FORM.LRH_FILE_BL,
            LRH_FILE_URL: STC_FORM.LRH_FILE_URL,
            LRH_PROBLEM: STC_FORM.LRH_PROBLEM,
            LRH_DET_BEFORE: STC_FORM.LRH_DET_BEFORE,
            LRH_DET_AFTER: STC_FORM.LRH_DET_AFTER,
            LRH_MH_OUTPUT: STC_FORM.LRH_MH_OUTPUT,
            LRH_MH_FORECAST: STC_FORM.LRH_MH_FORECAST,
            LRH_MH_TSAVE: STC_FORM.LRH_MH_TSAVE,
            LRH_MC_WCODE: STC_FORM.LRH_MC_WCODE,
            LRH_MC_WCOST: STC_FORM.LRH_MC_WCOST,
            LRH_MC_TSAVE: STC_FORM.LRH_MC_TSAVE,
            LRH_EVALUATE_STS: STC_FORM.LRH_EVALUATE_STS,
            LRH_EVALUATE_DATE: STC_FORM.LRH_EVALUATE_DATE,
            LRH_LEADER_RESULT: STC_FORM.LRH_LEADER_RESULT,
            LRH_LEADER_APP_BY: STC_FORM.LRH_LEADER_APP_BY,
            LRH_LEADER_APP_NAME: STC_FORM.LRH_LEADER_APP_NAME,
            LRH_LEADER_APP_DATE: STC_FORM.LRH_LEADER_APP_DATE,
            LRH_LEADER_APP_FISCALYR: STC_FORM.LRH_LEADER_APP_FISCALYR,
            LRH_LEADER_COMMENT: STC_FORM.LRH_LEADER_COMMENT,
            LRH_SUMIT_TO_SG: STC_FORM.LRH_SUMIT_TO_SG,
            LRH_SUMIT_TO_SG_BL: STC_FORM.LRH_SUMIT_TO_SG_BL,
            LRH_SG_TYPE: STC_FORM.LRH_SG_TYPE,
            LRH_FILE_PATH: STC_FORM.LRH_FILE_PATH,
            LRH_REQ_TYPE: STC_FORM.LRH_REQ_TYPE,
            LRH_SG_NO: STC_FORM.LRH_SG_NO,
            LRH_LEADER_APP_MONTH: STC_FORM.LRH_LEADER_APP_MONTH,
            LRH_REQ_MONTH: STC_FORM.LRH_REQ_MONTH,
            LRH_SEND_DATE: STC_FORM.LRH_SEND_DATE,
            SSH_SV_APP_BY: event,
            SSH_REQ_TYPE: STC_FORM.SSH_REQ_TYPE,
            SSH_TEAM_NAME: STC_FORM.SSH_TEAM_NAME,
            SSH_TEAM_BL: STC_FORM.SSH_TEAM_BL,
            SSH_MEMBER_TEAM: STC_FORM.SSH_MEMBER_TEAM,
            LRH_SSH_FILE: STC_FORM.LRH_SSH_FILE

        })
    };

    const handleChangeRaditoTeams = (e) => {
        setSTC_FORM({
            ISS_TYPE: STC_FORM.ISS_TYPE,
            LRH_REQ_NO: STC_FORM.LRH_REQ_NO,
            LRH_FACTORY: STC_FORM.LRH_FACTORY,
            LRH_FACTORY_CODE: STC_FORM.LRH_FACTORY_CODE,
            LRH_COST_CENTER: STC_FORM.LRH_COST_CENTER,
            LRH_REQ_DATE: STC_FORM.LRH_REQ_DATE,
            LRH_REQ_EMP_TYPE: STC_FORM.LRH_REQ_EMP_TYPE,
            LRH_REQ_BY: STC_FORM.LRH_REQ_BY,
            LRH_REQ_NAME: STC_FORM.LRH_REQ_NAME,
            LRH_REQ_SURNAME: STC_FORM.LRH_REQ_SURNAME,
            LRH_REQ_NAME_FULL: STC_FORM.LRH_REQ_NAME_FULL,
            LRH_REQ_PROCESS: STC_FORM.LRH_REQ_POSITION,
            LRH_REQ_POSITION: STC_FORM.LRH_REQ_POSITION,
            LRH_REQ_MANAGER: STC_FORM.LRH_REQ_MANAGER,
            LRH_REQ_MANAGER_NANE: STC_FORM.LRH_REQ_MANAGER_NANE,
            LRH_REQ_STATUS: STC_FORM.LRH_REQ_STATUS,
            LRH_REQ_STATUS_DESC: STC_FORM.LRH_REQ_STATUS_DESC,
            LRH_FILENAME: STC_FORM.LRH_FILENAME,
            LRH_FILESERVER: STC_FORM.LRH_FILESERVER,
            LRH_FILE_BL: STC_FORM.LRH_FILE_BL,
            LRH_FILE_URL: STC_FORM.LRH_FILE_URL,
            LRH_PROBLEM: STC_FORM.LRH_PROBLEM,
            LRH_DET_BEFORE: STC_FORM.LRH_DET_BEFORE,
            LRH_DET_AFTER: STC_FORM.LRH_DET_AFTER,
            LRH_MH_OUTPUT: STC_FORM.LRH_MH_OUTPUT,
            LRH_MH_FORECAST: STC_FORM.LRH_MH_FORECAST,
            LRH_MH_TSAVE: STC_FORM.LRH_MH_TSAVE,
            LRH_MC_WCODE: STC_FORM.LRH_MC_WCODE,
            LRH_MC_WCOST: STC_FORM.LRH_MC_WCOST,
            LRH_MC_TSAVE: STC_FORM.LRH_MC_TSAVE,
            LRH_EVALUATE_STS: STC_FORM.LRH_EVALUATE_STS,
            LRH_EVALUATE_DATE: STC_FORM.LRH_EVALUATE_DATE,
            LRH_LEADER_RESULT: STC_FORM.LRH_LEADER_RESULT,
            LRH_LEADER_APP_BY: STC_FORM.LRH_LEADER_APP_BY,
            LRH_LEADER_APP_NAME: STC_FORM.LRH_LEADER_APP_NAME,
            LRH_LEADER_APP_DATE: STC_FORM.LRH_LEADER_APP_DATE,
            LRH_LEADER_APP_FISCALYR: STC_FORM.LRH_LEADER_APP_FISCALYR,
            LRH_LEADER_COMMENT: STC_FORM.LRH_LEADER_COMMENT,
            LRH_SUMIT_TO_SG: STC_FORM.LRH_SUMIT_TO_SG,
            LRH_SUMIT_TO_SG_BL: STC_FORM.LRH_SUMIT_TO_SG_BL,
            LRH_SG_TYPE: STC_FORM.LRH_SG_TYPE,
            LRH_FILE_PATH: STC_FORM.LRH_FILE_PATH,
            LRH_REQ_TYPE: STC_FORM.LRH_REQ_TYPE,
            LRH_SG_NO: STC_FORM.LRH_SG_NO,
            LRH_LEADER_APP_MONTH: STC_FORM.LRH_LEADER_APP_MONTH,
            LRH_REQ_MONTH: STC_FORM.LRH_REQ_MONTH,
            LRH_SEND_DATE: STC_FORM.LRH_SEND_DATE,
            LRH_REQ_TYPE_TEAM: STC_FORM.LRH_REQ_TYPE_TEAM,
            SSH_SV_APP_BY: STC_FORM.SSH_SV_APP_BY,
            SSH_REQ_TYPE: e.target.value,
            SSH_TEAM_NAME: STC_FORM.SSH_TEAM_NAME,
            SSH_TEAM_BL: STC_FORM.SSH_TEAM_BL,
            SSH_MEMBER_TEAM: STC_FORM.SSH_MEMBER_TEAM,
            LRH_SSH_FILE: STC_FORM.LRH_SSH_FILE
        })

    };

    const addMember = () => {
        if (STC_FORM.SSH_TEAM_NAME.trim() === '') {
            alert('Please fill in team name.');
            return
        }
        setSTC_FORM((prevState) => {

            const isDuplicate = prevState.SSH_MEMBER_TEAM.some(
                (member) => member.T_EMP_ID === STC_TEAM.T_EMP_ID
            );

            if (isDuplicate) {
                alert('Member already exists!');
                return prevState;
            }

            const updatedMembers = [...prevState.SSH_MEMBER_TEAM, STC_TEAM];

            return {
                ...prevState,
                SSH_MEMBER_TEAM: updatedMembers
            };
        });

        setSTC_TEAM({
            T_EMP_ID: '',
            T_EMP_NAME: '',
            T_EMP_JOBGRAD: '',
            T_EMP_CC: ''
        })
    };

    const removeMember = (idEmp) => {
        setSTC_FORM((prevState) => {
            const updatedMembers = prevState.SSH_MEMBER_TEAM.filter(
                (member) => member.T_EMP_ID !== idEmp
            );

            return {
                ...prevState,
                SSH_MEMBER_TEAM: updatedMembers
            };
        });
    };

    const handleInputChangeTextTeam = (e) => {
        const { name, value } = e.target;
        setSTC_TEAM(prevState => ({
            ...prevState,
            [name]: value
        }));
        if (name === 'T_EMP_ID' && value.length === 7) {
            GetDataUser(name, value)
        }
    };

    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const [binaryData, setBinaryData] = useState(null);
    const [base64Str, setbase64Str] = useState('');


    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result.split(',')[1]; // เอาแค่ส่วนของ base64 string
                resolve(base64String);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const selectedFile = files[0];
            // const reader = new FileReader();
            // reader.onload = () => {
            // const binaryDataD = reader.result;
            // setBinaryData(binaryDataD)
            // };
            // reader.readAsArrayBuffer(selectedFile);

            if (selectedFile.size > MAX_FILE_SIZE) {
                alert('File size exceeds the 10MB limit');
                setSTC_FORM(prevState => ({
                    ...prevState,
                    ['LRH_FILENAME']: '',
                    ['LRH_FILESERVER']: '',
                    ['LRH_FILE_BL']: null,
                    ['LRH_FILE_URL']: null,
                    ['LRH_SSH_FILE']: ''
                }));
            } else {
                let ftype = selectedFile.name.split('.');
                let newFileName = '';
                let period = 'AM';
                if (hours >= 12) {
                    period = 'PM'
                }

                if (STC_FORM.LRH_SUMIT_TO_SG === 'Y') {
                    if (STC_FORM.ISS_TYPE === 'LOCT') {
                        newFileName = `LOCT_SGT_${year}${month}${day}${hours}${minutes}${seconds}${period}.${ftype[ftype.length - 1]}`
                    } else {
                        newFileName = `IECT_SGT_${year}${month}${day}${hours}${minutes}${seconds}${period}.${ftype[ftype.length - 1]}`
                    }
                } else if (STC_FORM.LRH_SUMIT_TO_SG === 'N') {
                    if (STC_FORM.ISS_TYPE === 'LOCT') {
                        newFileName = `LOCT_${year}${month}${day}${hours}${minutes}${seconds}${period}.${ftype[ftype.length - 1]}`
                    } else {
                        newFileName = `IECT_${year}${month}${day}${hours}${minutes}${seconds}${period}.${ftype[ftype.length - 1]}`
                    }
                } else if (STC_FORM.LRH_SUMIT_TO_SG === '5') {
                    newFileName = `SGT_${year}${month}${day}${hours}${minutes}${seconds}${period}.${ftype[ftype.length - 1]}`
                }
                let newFile = new File([selectedFile], newFileName, { type: selectedFile.type });


                convertFileToBase64(newFile)
                    .then(base64String => {
                        setbase64Str(base64String)
                    })
                    .catch(error => {
                        console.error('Error converting file to Base64:', error);
                    });


                setSTC_FORM(prevState => ({
                    ...prevState,
                    ['LRH_FILENAME']: selectedFile.name,
                    ['LRH_FILESERVER']: newFileName,
                    ['LRH_FILE_BL']: newFile,
                    ['LRH_FILE_URL']: URL.createObjectURL(newFile),
                    ['LRH_SSH_FILE']: base64Str,
                }));
            }
        }
    };
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        convertFileToBase64(selectedFile)
            .then(base64String => {
                setbase64Str(base64String)
            })
            .catch(error => {
                console.error('Error converting file to Base64:', error);
            });
        //const reader = new FileReader();
        // reader.onload = () => {
        // const binaryDataD = reader.result;
        //    setBinaryData(binaryDataD);
        // };
        // reader.readAsArrayBuffer(selectedFile);

        if (selectedFile.size > MAX_FILE_SIZE) {
            alert('File size exceeds the 10MB limit');
            setSTC_FORM(prevState => ({
                ...prevState,
                ['LRH_FILENAME']: '',
                ['LRH_FILESERVER']: '',
                ['LRH_FILE_BL']: null,
                ['LRH_FILE_URL']: null,
                ['LRH_SSH_FILE']: '',
            }));
        } else {
            let ftype = selectedFile.name.split('.');
            let newFileName = '';
            let period = 'AM';
            if (hours >= 12) {
                period = 'PM'
            }

            if (STC_FORM.LRH_SUMIT_TO_SG === 'Y') {
                if (STC_FORM.ISS_TYPE === 'LOCT') {
                    newFileName = `LOCT_SGT_${year}${month}${day}${hours}${minutes}${seconds}${period}.${ftype[ftype.length - 1]}`
                } else {
                    newFileName = `IECT_SGT_${year}${month}${day}${hours}${minutes}${seconds}${period}.${ftype[ftype.length - 1]}`
                }
            } else if (STC_FORM.LRH_SUMIT_TO_SG === 'N') {
                if (STC_FORM.ISS_TYPE === 'LOCT') {
                    newFileName = `LOCT_${year}${month}${day}${hours}${minutes}${seconds}${period}.${ftype[ftype.length - 1]}`
                } else {
                    newFileName = `IECT_${year}${month}${day}${hours}${minutes}${seconds}${period}.${ftype[ftype.length - 1]}`
                }
            } else if (STC_FORM.LRH_SUMIT_TO_SG === '5') {
                newFileName = `SGT_${year}${month}${day}${hours}${minutes}${seconds}${period}.${ftype[ftype.length - 1]}`
            }
            let newFile = new File([selectedFile], newFileName, { type: selectedFile.type });


            convertFileToBase64(newFile)
                .then(base64String => {
                    setbase64Str(base64String)
                })
                .catch(error => {
                    console.error('Error converting file to Base64:', error);
                });

            setSTC_FORM(prevState => ({
                ...prevState,
                ['LRH_FILENAME']: selectedFile.name,
                ['LRH_FILESERVER']: newFileName,
                ['LRH_FILE_BL']: newFile,
                ['LRH_FILE_URL']: URL.createObjectURL(newFile),
                ['LRH_SSH_FILE']: base64Str,
            }));

        }
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleClickClear = () => {
        setSTC_FORM(prevState => ({
            ...prevState,
            ['LRH_FILENAME']: '',
            ['LRH_FILESERVER']: '',
            ['LRH_FILE_BL']: null,
            ['LRH_FILE_URL']: null,
            ['LRH_SSH_FILE']: ''
        }));
    };

    useEffect(() => {
        if (STC_FORM.LRH_FILENAME.trim() !== '' && base64Str !== '') {
            setSTC_FORM(prevState => ({
                ...prevState,
                ['LRH_SSH_FILE']: base64Str
            }));
        }

    }, [base64Str]);


    return {
        loading,
        setloading,
        STC_FORM,
        setSTC_FORM,
        handleChangeSGType,
        handleInputChangeText,
        handleChangeRaditoReqSGT,
        OnSave,
        OnSubmit,
        OnReset,
        OnClearRequester,
        OnClearLeader,
        supList,
        handleChangeSup,
        handleChangeRaditoTeams,
        isDragging,
        fileInputRef,
        handleDragEnter,
        handleDragLeave,
        handleDragOver,
        handleDrop,
        handleFileChange,
        handleClick,
        handleClickClear,
        STC_TEAM,
        handleInputChangeTextTeam,
        addMember,
        removeMember,
        GetData
    }
}

export { GetFactory, GetCostCenter, GetTypeSGT, TransactionDetail_Fn }