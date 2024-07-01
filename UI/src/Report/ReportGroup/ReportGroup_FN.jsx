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

function ReportGroup_Fn() {
    const tableRef = useRef(null);
    const [loading, setloading] = useState(false);
    const [HeaderList, setHeaderList] = useState([]);
    const [DetailList, setDetailList] = useState([]);

    const [SumLDList, setSumLDList] = useState([]);
    const [DTSumLDList, setDTSumLDList] = useState([]);
    const [Hmonth, setHmonth] = useState('');

    const [DetailLDList, setDetailLDList] = useState([]);
    const [LDList, setLDList] = useState([]);
    const [HLeader, setHLeader] = useState('');

    const [DetailOPList, setDetailOPList] = useState([]);
    const [OPList, setOPList] = useState([]);
    const [Hop, setHop] = useState('');

    const [STC_Search, setSTC_Search] = useState({
        P_REQ_TYPE: '',
        P_FISICAL_YEAR: null,
        P_FACTORY: null,
        P_CC: null,
        P_APP_MONTH_FRM: null,
        P_APP_MONTH_TO: null,
        P_LEADER_ID: '',
        P_LEADER_NAME: '',
        P_OPR_ID: '',
        P_OPR_NAME: ''
    });

    const GenHeader = () => {
        let Header = [];
        let SumLD = [];
        let DetailLD = [];
        let DetailOP = [];
        if (localStorage.getItem('REPORTBY') === 'FACTORY') {
            Header.push({ id: 1, width: '120px', position: 'center', name: 'Month', field: 'P_MONTH' });
            Header.push({ id: 2, width: '120px', position: 'center', name: 'Factory', field: 'P_FACTORY' });
            Header.push({ id: 3, width: '150px', position: 'center', name: 'No. Of Leader', field: 'P_OF_LEADER' });
            Header.push({ id: 4, width: '200px', position: 'center', name: 'Wait Approve (Issue)', field: 'P_WAIT_APP' });
            Header.push({ id: 5, width: '200px', position: 'center', name: 'Approve (Issue)', field: 'P_APP' });
            Header.push({ id: 6, width: '200px', position: 'center', name: 'Implement (Issue)', field: 'P_IMPLEMENT' });
            Header.push({ id: 7, width: '200px', position: 'center', name: 'Mhr Saving (MH)', field: 'P_MH' });
            setHeaderList(Header)

        } else if (localStorage.getItem('REPORTBY') === 'CC') {
            Header.push({ id: 1, width: '120px', position: 'center', name: 'Month', field: 'P_MONTH' });
            Header.push({ id: 2, width: '120px', position: 'center', name: 'Cost Center', field: 'P_CC' });
            Header.push({ id: 3, width: '150px', position: 'center', name: 'No. Of Leader', field: 'P_OF_LEADER' });
            Header.push({ id: 4, width: '200px', position: 'center', name: 'Wait Approve (Issue)', field: 'P_WAIT_APP' });
            Header.push({ id: 5, width: '200px', position: 'center', name: 'Approve (Issue)', field: 'P_APP' });
            Header.push({ id: 6, width: '200px', position: 'center', name: 'Implement (Issue)', field: 'P_IMPLEMENT' });
            Header.push({ id: 7, width: '200px', position: 'center', name: 'Mhr Saving (MH)', field: 'P_MH' });
            setHeaderList(Header)


        } else if (localStorage.getItem('REPORTBY') === 'CENTER') {
            Header.push({ id: 1, width: '120px', position: 'center', name: 'Month', field: 'P_MONTH' });
            Header.push({ id: 2, width: '120px', position: 'center', name: 'Cost Center', field: 'P_CC' });
            Header.push({ id: 3, width: '250px', position: 'left', name: 'Leader Name', field: 'P_LEADER_NAME' });
            Header.push({ id: 4, width: '120px', position: 'center', name: 'Total Operator', field: 'P_TOTAL_OPERATOR' });
            Header.push({ id: 5, width: '120px', position: 'center', name: 'Total Paticipate', field: 'P_TOTAL_PATICIPATE' });
            Header.push({ id: 6, width: '120px', position: 'center', name: '% Paticipate', field: 'P_PATICIPATE' });
            Header.push({ id: 7, width: '120px', position: 'center', name: 'Submit To SG', field: 'P_SUBMIT_TO' });
            Header.push({ id: 8, width: '120px', position: 'center', name: 'Total Issue', field: 'P_TOTAL_ISS' });
            Header.push({ id: 9, width: '150px', position: 'center', name: 'Wait Approve', field: 'P_WAIT_APP' });
            Header.push({ id: 10, width: '150px', position: 'center', name: 'Implement', field: 'P_IMPLEMENT' });
            Header.push({ id: 11, width: '120px', position: 'center', name: 'Mhr Saving', field: 'P_MH' });
            Header.push({ id: 12, width: '120px', position: 'center', name: 'Cost Saving', field: 'P_MC' });
            setHeaderList(Header)



        } else if (localStorage.getItem('REPORTBY') === 'LEADER') {
            Header.push({ id: 1, width: '120px', position: 'center', name: 'Month', field: 'P_MONTH' });
            Header.push({ id: 2, width: '120px', position: 'center', name: 'Leader ID', field: 'P_LEADER_ID' });
            Header.push({ id: 3, width: '250px', position: 'left', name: 'Leader Name', field: 'P_LEADER_NAME' });
            Header.push({ id: 4, width: '120px', position: 'center', name: 'Cost Center', field: 'P_CC' });
            Header.push({ id: 5, width: '200px', position: 'center', name: 'Wait Approve (Issue)', field: 'P_WAIT_APP' });
            Header.push({ id: 6, width: '200px', position: 'center', name: 'Approve (Issue)', field: 'P_APP' });
            Header.push({ id: 7, width: '200px', position: 'center', name: 'Implement (Issue)', field: 'P_IMPLEMENT' });
            Header.push({ id: 8, width: '200px', position: 'center', name: 'Mhr Saving (MH)', field: 'P_MH' });
            setHeaderList(Header)


        } else if (localStorage.getItem('REPORTBY') === 'DETAILLEADER') {
            Header.push({ id: 1, width: '120px', position: 'center', name: 'Month', field: 'P_MONTH' });
            Header.push({ id: 2, width: '120px', position: 'center', name: 'Operator ID', field: 'P_OPERATOR_ID' });
            Header.push({ id: 3, width: '250px', position: 'left', name: 'Operator Name', field: 'P_OPERATOR_NAME' });
            Header.push({ id: 4, width: '120px', position: 'center', name: 'Cost Center', field: 'P_CC' });
            Header.push({ id: 5, width: '200px', position: 'center', name: 'Wait Approve (Issue)', field: 'P_WAIT_APP' });
            Header.push({ id: 6, width: '200px', position: 'center', name: 'Approve (Issue)', field: 'P_APP' });
            Header.push({ id: 7, width: '200px', position: 'center', name: 'Implement (Issue)', field: 'P_IMPLEMENT' });
            Header.push({ id: 8, width: '200px', position: 'center', name: 'Mhr Saving (MH)', field: 'P_MH' });
            setHeaderList(Header)

        } else if (localStorage.getItem('REPORTBY') === 'DETAILOPERATOR') {
            Header.push({ id: 1, width: '80px', position: 'center', name: 'Type', field: 'P_TYPE' });
            Header.push({ id: 2, width: '150px', position: 'center', name: 'Register No', field: 'P_REG_NO' });
            Header.push({ id: 3, width: '250px', position: 'left', name: 'Type Of Suggestion', field: 'P_TYPE_SGT' });
            Header.push({ id: 4, width: '250px', position: 'left', name: 'Subject', field: 'P_SUBJECT' });
            Header.push({ id: 5, width: '200px', position: 'left', name: 'Before', field: 'P_BEFORE' });
            Header.push({ id: 6, width: '200px', position: 'left', name: 'After', field: 'P_AFTER' });
            Header.push({ id: 7, width: '120px', position: 'center', name: 'Operator ID', field: 'P_OPERATOR_ID' });
            Header.push({ id: 8, width: '150px', position: 'left', name: 'Operator Name', field: 'P_OPERATOR_NAME' });
            Header.push({ id: 9, width: '120px', position: 'center', name: 'Cost Center', field: 'P_CC' });
            Header.push({ id: 10, width: '250px', position: 'left', name: 'Issue to Leader Name', field: 'P_ISSUE_NAME' });
            Header.push({ id: 11, width: '120px', position: 'center', name: 'Mhr Saving (MH)', field: 'P_MH' });
            setHeaderList(Header)
        } else {
            Header.push({ id: 1, width: '120px', position: 'center', name: 'Month', field: 'P_MONTH' });
            Header.push({ id: 2, width: '120px', position: 'center', name: 'Factory', field: 'P_FACTORY' });
            Header.push({ id: 3, width: '150px', position: 'center', name: 'No. Of Leader', field: 'P_OF_LEADER' });
            Header.push({ id: 4, width: '200px', position: 'center', name: 'Wait Approve (Issue)', field: 'P_WAIT_APP' });
            Header.push({ id: 5, width: '200px', position: 'center', name: 'Approve (Issue)', field: 'P_APP' });
            Header.push({ id: 6, width: '200px', position: 'center', name: 'Implement (Issue)', field: 'P_IMPLEMENT' });
            Header.push({ id: 7, width: '200px', position: 'center', name: 'Mhr Saving (MH)', field: 'P_MH' });
            setHeaderList(Header)
        }

        SumLD.push({ id: 1, width: '120px', position: 'center', name: 'Month', field: 'P_MONTH' });
        SumLD.push({ id: 2, width: '120px', position: 'center', name: 'Leader ID', field: 'P_LEADER_ID' });
        SumLD.push({ id: 3, width: '250px', position: 'left', name: 'Leader Name', field: 'P_LEADER_NAME' });
        SumLD.push({ id: 4, width: '120px', position: 'center', name: 'Cost Center', field: 'P_CC' });
        SumLD.push({ id: 5, width: '200px', position: 'center', name: 'Wait Approve (Issue)', field: 'P_WAIT_APP' });
        SumLD.push({ id: 6, width: '200px', position: 'center', name: 'Approve (Issue)', field: 'P_APP' });
        SumLD.push({ id: 7, width: '200px', position: 'center', name: 'Implement (Issue)', field: 'P_IMPLEMENT' });
        SumLD.push({ id: 8, width: '200px', position: 'center', name: 'Mhr Saving (MH)', field: 'P_MH' });
        setSumLDList(SumLD)


        DetailLD.push({ id: 1, width: '120px', position: 'center', name: 'Month', field: 'P_MONTH' });
        DetailLD.push({ id: 2, width: '120px', position: 'center', name: 'Operator ID', field: 'P_OPERATOR_ID' });
        DetailLD.push({ id: 3, width: '250px', position: 'left', name: 'Operator Name', field: 'P_OPERATOR_NAME' });
        DetailLD.push({ id: 4, width: '120px', position: 'center', name: 'Cost Center', field: 'P_CC' });
        DetailLD.push({ id: 5, width: '200px', position: 'center', name: 'Wait Approve (Issue)', field: 'P_WAIT_APP' });
        DetailLD.push({ id: 6, width: '200px', position: 'center', name: 'Approve (Issue)', field: 'P_APP' });
        DetailLD.push({ id: 7, width: '200px', position: 'center', name: 'Implement (Issue)', field: 'P_IMPLEMENT' });
        DetailLD.push({ id: 8, width: '200px', position: 'center', name: 'Mhr Saving (MH)', field: 'P_MH' });
        setDetailLDList(DetailLD)

        DetailOP.push({ id: 1, width: '80px', position: 'center', name: 'Type', field: 'P_TYPE' });
        DetailOP.push({ id: 2, width: '150px', position: 'center', name: 'Register No', field: 'P_REG_NO' });
        DetailOP.push({ id: 3, width: '250px', position: 'left', name: 'Type Of Suggestion', field: 'P_TYPE_SGT' });
        DetailOP.push({ id: 4, width: '250px', position: 'left', name: 'Subject', field: 'P_SUBJECT' });
        DetailOP.push({ id: 5, width: '200px', position: 'left', name: 'Before', field: 'P_BEFORE' });
        DetailOP.push({ id: 6, width: '200px', position: 'left', name: 'After', field: 'P_AFTER' });
        DetailOP.push({ id: 7, width: '120px', position: 'center', name: 'Operator ID', field: 'P_OPERATOR_ID' });
        DetailOP.push({ id: 8, width: '150px', position: 'left', name: 'Operator Name', field: 'P_OPERATOR_NAME' });
        DetailOP.push({ id: 9, width: '120px', position: 'center', name: 'Cost Center', field: 'P_CC' });
        DetailOP.push({ id: 10, width: '250px', position: 'left', name: 'Issue to Leader Name', field: 'P_ISSUE_NAME' });
        DetailOP.push({ id: 11, width: '120px', position: 'center', name: 'Mhr Saving (MH)', field: 'P_MH' });
        setDetailOPList(DetailOP)
    }

    const handleChangeFisical = (event) => {
        setSTC_Search(prevState => ({
            ...prevState,
            ['P_FISICAL_YEAR']: event
        }));
    };

    const handleChangeFac = (event) => {
        setSTC_Search(prevState => ({
            ...prevState,
            ['P_FACTORY']: event
        }));

    };

    const handleChangeCC = (event) => {
        setSTC_Search(prevState => ({
            ...prevState,
            ['P_CC']: event
        }));

        let Header = [];
        if (localStorage.getItem('REPORTBY') === 'SUMALL') {
            Header.push({ id: 1, width: '120px', position: 'center', name: 'Month', field: 'P_MONTH' });
            Header.push({ id: 2, width: '120px', position: 'center', name: 'Cost Center', field: 'P_CC' });
            Header.push({ id: 3, width: '150px', position: 'center', name: 'No. Of Leader', field: 'P_OF_LEADER' });
            Header.push({ id: 4, width: '200px', position: 'center', name: 'Wait Approve (Issue)', field: 'P_WAIT_APP' });
            Header.push({ id: 5, width: '200px', position: 'center', name: 'Approve (Issue)', field: 'P_APP' });
            Header.push({ id: 6, width: '200px', position: 'center', name: 'Implement (Issue)', field: 'P_IMPLEMENT' });
            Header.push({ id: 7, width: '200px', position: 'center', name: 'Mhr Saving (MH)', field: 'P_MH' });
            setHeaderList(Header)
            setDetailList([])

        }
    };

    const handleChangeMonthFrm = (event) => {
        setSTC_Search(prevState => ({
            ...prevState,
            ['P_APP_MONTH_FRM']: event
        }));
    };

    const handleChangeMonthTo = (event) => {
        setSTC_Search(prevState => ({
            ...prevState,
            ['P_APP_MONTH_TO']: event
        }));
    };

    const handleInputChangeText = (e) => {
        const { name, value } = e.target;
        setSTC_Search(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleChangeRadito = (e) => {
        setSTC_Search(prevState => ({
            ...prevState,
            ['P_REQ_TYPE']: e.target.value
        }));
        setDetailList([])
        setDTSumLDList([])
        setLDList([])
        setOPList([])
    };

    const OnSearch = async () => {
        let P_REQ_TYPE = '';
        let P_FISICAL_YEAR = '';
        let P_FACTORY = '';
        let P_CC = '';
        let P_APP_MONTH_FRM = '';
        let P_APP_MONTH_TO = '';
        let P_LEADER_ID = '';
        let P_LEADER_NAME = '';
        let P_OPR_ID = '';
        let P_OPR_NAME = '';
        let P_MODE = 'ALL';

        let P_PARAMETER = '';
        let P_FUNCTION = '';

        if (STC_Search.P_REQ_TYPE !== '') {
            if (STC_Search.P_REQ_TYPE === 'LOCT') {
                P_REQ_TYPE = '1,2'
            } else if (STC_Search.P_REQ_TYPE === 'IECT') {
                P_REQ_TYPE = '3,4'
            } else {
                P_REQ_TYPE = STC_Search.P_REQ_TYPE
            }
        } else {
            alert('Please select type.')
            return
        }


        if (localStorage.getItem('REPORTBY') === 'FACTORY') {

            if (STC_Search.P_FISICAL_YEAR !== null) {
                P_FISICAL_YEAR = STC_Search.P_FISICAL_YEAR.value
            } else {
                alert('Please select fisical year.')
                return
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

            if (STC_Search.P_APP_MONTH_FRM !== null) {
                P_APP_MONTH_FRM = STC_Search.P_APP_MONTH_FRM.value
            }

            if (STC_Search.P_APP_MONTH_TO !== null) {
                P_APP_MONTH_TO = STC_Search.P_APP_MONTH_TO.value
            }

            P_PARAMETER = `?P_REQ_TYPE=${P_REQ_TYPE}&P_FISICAL_YEAR=${P_FISICAL_YEAR}&P_FACTORY=${P_FACTORY}&P_CC=${P_CC}&P_APP_MONTH_FRM=${P_APP_MONTH_FRM}&P_APP_MONTH_TO=${P_APP_MONTH_TO}`;
            P_FUNCTION = `${import.meta.env.VITE_API}/report/rptSummaryFactory${P_PARAMETER}`

        } else if (localStorage.getItem('REPORTBY') === 'CC') {

            if (STC_Search.P_FISICAL_YEAR !== null) {
                P_FISICAL_YEAR = STC_Search.P_FISICAL_YEAR.value
            } else {
                alert('Please select fisical year.')
                return
            }

            if (STC_Search.P_FACTORY !== null) {
                P_FACTORY = STC_Search.P_FACTORY.label.trim()
            } else {
                alert('Please select factory.')
                return
            }

            if (STC_Search.P_CC !== null) {
                P_CC = STC_Search.P_CC.value
            } else {
                alert('Please select cost center.')
                return
            }

            if (STC_Search.P_APP_MONTH_FRM !== null) {
                P_APP_MONTH_FRM = STC_Search.P_APP_MONTH_FRM.value
            }

            if (STC_Search.P_APP_MONTH_TO !== null) {
                P_APP_MONTH_TO = STC_Search.P_APP_MONTH_TO.value
            }

            P_PARAMETER = `?P_REQ_TYPE=${P_REQ_TYPE}&P_FISICAL_YEAR=${P_FISICAL_YEAR}&P_FACTORY=${P_FACTORY}&P_CC=${P_CC}&P_APP_MONTH_FRM=${P_APP_MONTH_FRM}&P_APP_MONTH_TO=${P_APP_MONTH_TO}`;
            P_FUNCTION = `${import.meta.env.VITE_API}/report/rptSummaryCC${P_PARAMETER}`


        } else if (localStorage.getItem('REPORTBY') === 'CENTER') {

            if (STC_Search.P_FISICAL_YEAR !== null) {
                P_FISICAL_YEAR = STC_Search.P_FISICAL_YEAR.value
            } else {
                alert('Please select fisical year.')
                return
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

            if (STC_Search.P_APP_MONTH_FRM !== null) {
                P_APP_MONTH_FRM = STC_Search.P_APP_MONTH_FRM.value
            }

            if (STC_Search.P_APP_MONTH_TO !== null) {
                P_APP_MONTH_TO = STC_Search.P_APP_MONTH_TO.value
            }

            P_PARAMETER = `?P_REQ_TYPE=${P_REQ_TYPE}&P_FISICAL_YEAR=${P_FISICAL_YEAR}&P_FACTORY=${P_FACTORY}&P_CC=${P_CC}&P_APP_MONTH_FRM=${P_APP_MONTH_FRM}&P_APP_MONTH_TO=${P_APP_MONTH_TO}`;
            P_FUNCTION = `${import.meta.env.VITE_API}/report/rptSummaryCenter${P_PARAMETER}`


        } else if (localStorage.getItem('REPORTBY') === 'LEADER') {

            if (STC_Search.P_FISICAL_YEAR !== null) {
                P_FISICAL_YEAR = STC_Search.P_FISICAL_YEAR.value
            } else {
                alert('Please select fisical year.')
                return
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

            if (STC_Search.P_APP_MONTH_FRM !== null) {
                P_APP_MONTH_FRM = STC_Search.P_APP_MONTH_FRM.value
            }

            if (STC_Search.P_APP_MONTH_TO !== null) {
                P_APP_MONTH_TO = STC_Search.P_APP_MONTH_TO.value
            }

            P_PARAMETER = `?P_REQ_TYPE=${P_REQ_TYPE}&P_FISICAL_YEAR=${P_FISICAL_YEAR}&P_FACTORY=${P_FACTORY}&P_CC=${P_CC}&P_APP_MONTH_FRM=${P_APP_MONTH_FRM}&P_APP_MONTH_TO=${P_APP_MONTH_TO}`;
            P_FUNCTION = `${import.meta.env.VITE_API}/report/rptSummaryLeader${P_PARAMETER}`


        } else if (localStorage.getItem('REPORTBY') === 'DETAILLEADER') {

            if (STC_Search.P_FISICAL_YEAR !== null) {
                P_FISICAL_YEAR = STC_Search.P_FISICAL_YEAR.value
            } else {
                alert('Please select fisical year.')
                return
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

            if (STC_Search.P_APP_MONTH_FRM !== null) {
                P_APP_MONTH_FRM = STC_Search.P_APP_MONTH_FRM.value
            }

            if (STC_Search.P_APP_MONTH_TO !== null) {
                P_APP_MONTH_TO = STC_Search.P_APP_MONTH_TO.value
            }

            if (STC_Search.P_LEADER_ID !== '') {
                P_LEADER_ID = STC_Search.P_LEADER_ID
            } else {
                alert('Please fill in Leader ID.')
                return
            }

            if (STC_Search.P_LEADER_NAME !== '') {
                P_LEADER_NAME = STC_Search.P_LEADER_NAME
            }

            P_PARAMETER = `?P_REQ_TYPE=${P_REQ_TYPE}&P_FISICAL_YEAR=${P_FISICAL_YEAR}&P_FACTORY=${P_FACTORY}&P_CC=${P_CC}&P_APP_MONTH_FRM=${P_APP_MONTH_FRM}&P_APP_MONTH_TO=${P_APP_MONTH_TO}&P_LEADER_ID=${P_LEADER_ID}&P_LEADER_NAME=${P_LEADER_NAME}`;
            P_FUNCTION = `${import.meta.env.VITE_API}/report/rptDetailLeader${P_PARAMETER}`

        } else if (localStorage.getItem('REPORTBY') === 'DETAILOPERATOR') {

            if (STC_Search.P_FISICAL_YEAR !== null) {
                P_FISICAL_YEAR = STC_Search.P_FISICAL_YEAR.value
            } else {
                alert('Please select fisical year.')
                return
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

            if (STC_Search.P_APP_MONTH_FRM !== null) {
                P_APP_MONTH_FRM = STC_Search.P_APP_MONTH_FRM.value
            }

            if (STC_Search.P_APP_MONTH_TO !== null) {
                P_APP_MONTH_TO = STC_Search.P_APP_MONTH_TO.value
            }

            if (STC_Search.P_LEADER_ID !== '') {
                P_LEADER_ID = STC_Search.P_LEADER_ID
            }

            if (STC_Search.P_LEADER_NAME !== '') {
                P_LEADER_NAME = STC_Search.P_LEADER_NAME
            }

            if (STC_Search.P_OPR_ID !== '') {
                P_OPR_ID = STC_Search.P_OPR_ID
            }

            if (STC_Search.P_OPR_NAME !== '') {
                P_OPR_NAME = STC_Search.P_OPR_NAME
            }


            P_PARAMETER = `?P_REQ_TYPE=${P_REQ_TYPE}&P_FISICAL_YEAR=${P_FISICAL_YEAR}&P_FACTORY=${P_FACTORY}&P_CC=${P_CC}&P_APP_MONTH_FRM=${P_APP_MONTH_FRM}&P_APP_MONTH_TO=${P_APP_MONTH_TO}&P_LEADER_ID=${P_LEADER_ID}&P_LEADER_NAME=${P_LEADER_NAME}&P_OPR_ID=${P_OPR_ID}&P_OPR_NAME=${P_OPR_NAME}&P_MODE=${P_MODE}`;
            P_FUNCTION = `${import.meta.env.VITE_API}/report/rptDetailOperator${P_PARAMETER}`
        } else {


            if (STC_Search.P_FISICAL_YEAR !== null) {
                P_FISICAL_YEAR = STC_Search.P_FISICAL_YEAR.value
            } else {
                alert('Please select fisical year.')
                return
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

            if (STC_Search.P_APP_MONTH_FRM !== null) {
                P_APP_MONTH_FRM = STC_Search.P_APP_MONTH_FRM.value
            }

            if (STC_Search.P_APP_MONTH_TO !== null) {
                P_APP_MONTH_TO = STC_Search.P_APP_MONTH_TO.value
            }

            P_PARAMETER = `?P_REQ_TYPE=${P_REQ_TYPE}&P_FISICAL_YEAR=${P_FISICAL_YEAR}&P_FACTORY=${P_FACTORY}&P_CC=${P_CC}&P_APP_MONTH_FRM=${P_APP_MONTH_FRM}&P_APP_MONTH_TO=${P_APP_MONTH_TO}`;
            if (P_CC === '') {
                P_FUNCTION = `${import.meta.env.VITE_API}/report/rptSummaryFactory${P_PARAMETER}`
            } else {
                P_FUNCTION = `${import.meta.env.VITE_API}/report/rptSummaryCC${P_PARAMETER}`
            }
        }
        setloading(true)
        try {
            const response = await axios.get(P_FUNCTION,
                {
                    headers: {
                        'Authorization': `Basic ${token}`,
                    },
                }
            );
            const data = await response.data;
            setDetailList(data)
            setloading(false)
        } catch (error) {
            setloading(false)
            console.error("Error RequesterORType:", error);
            alert(error.message);
        }
    }

    const OnReset = async () => {
        setSTC_Search({
            P_REQ_TYPE: 'ALL',
            P_FISICAL_YEAR: null,
            P_FACTORY: null,
            P_CC: null,
            P_APP_MONTH_FRM: null,
            P_APP_MONTH_TO: null,
            P_LEADER_ID: '',
            P_LEADER_NAME: '',
            P_OPR_ID: '',
            P_OPR_NAME: ''
        })
        setDetailList([])
        if (localStorage.getItem('REPORTBY') === 'SUMALL') {
            let Header;
            Header.push({ id: 1, width: '120px', position: 'center', name: 'Month', field: 'P_MONTH' });
            Header.push({ id: 2, width: '120px', position: 'center', name: 'Factory', field: 'P_FACTORY' });
            Header.push({ id: 3, width: '150px', position: 'center', name: 'No. Of Leader', field: 'P_OF_LEADER' });
            Header.push({ id: 4, width: '200px', position: 'center', name: 'Wait Approve (Issue)', field: 'P_WAIT_APP' });
            Header.push({ id: 5, width: '200px', position: 'center', name: 'Approve (Issue)', field: 'P_APP' });
            Header.push({ id: 6, width: '200px', position: 'center', name: 'Implement (Issue)', field: 'P_IMPLEMENT' });
            Header.push({ id: 7, width: '200px', position: 'center', name: 'Mhr Saving (MH)', field: 'P_MH' });
            setHeaderList(Header)
        }

    }

    const OnExport = async () => {
        const dateR = new Date();
        const yearR = dateR.getFullYear();
        const monthR = String(dateR.getMonth() + 1).padStart(2, '0');
        const dayR = String(dateR.getDate()).padStart(2, '0');
        const hoursR = String(dateR.getHours()).padStart(2, '0');
        const minutesR = String(dateR.getMinutes()).padStart(2, '0');
        const secondsR = String(dateR.getSeconds()).padStart(2, '0');
        let nameReport = '';
        let typeReport = '';
        if (localStorage.getItem('REPORTBY') === 'FACTORY') {
            nameReport = 'Summary_Report_by_Factory'

        } else if (localStorage.getItem('REPORTBY') === 'CC') {
            nameReport = 'Summary_Report_by_CC'


        } else if (localStorage.getItem('REPORTBY') === 'CENTER') {
            nameReport = 'Summary_Report_by_Center'

        } else if (localStorage.getItem('REPORTBY') === 'LEADER') {
            nameReport = 'Summary_Report_by_Leader'

        } else if (localStorage.getItem('REPORTBY') === 'DETAILLEADER') {
            nameReport = 'Detail_Report_of_Leader'

        } else if (localStorage.getItem('REPORTBY') === 'DETAILOPERATOR') {
            nameReport = 'Detail_Report_of_Operator'

        }

        if (STC_Search.P_TYPE === 'LOCT') {
            typeReport = '_LOCT_Export';
        } else if (STC_Search.P_TYPE === 'IECT') {
            typeReport = '_IECT_Export';
        } else {
            typeReport = '_Export';
        }
        const Filename = nameReport + typeReport + yearR + monthR + dayR + hoursR + minutesR + secondsR + '.xlsx';

        const table = tableRef.current;
        const workbook = XLSX.utils.table_to_book(table);
        XLSX.writeFile(workbook, Filename);
    };

    const OnFilterLeader = async (YearMon, Factory, CC, YearMonName, status) => {
        let P_REQ_TYPE = '';
        let P_FISICAL_YEAR = '';
        let P_FACTORY = '';
        let P_CC = '';
        let P_APP_MONTH_FRM = '';
        let P_APP_MONTH_TO = '';

        let Year = YearMon.substring(0, 4);
        let Month = YearMon.substring(4, 6);

        let P_PARAMETER = '';
        let P_FUNCTION = '';

        let P_LEADER_ID = '';
        let P_LEADER_NAME = '';
        let P_OPR_ID = '';
        let P_OPR_NAME = '';
        let P_MODE = status;

        if (STC_Search.P_REQ_TYPE !== '') {
            if (STC_Search.P_REQ_TYPE === 'LOCT') {
                P_REQ_TYPE = '1,2'
            } else if (STC_Search.P_REQ_TYPE === 'IECT') {
                P_REQ_TYPE = '3,4'
            } else {
                P_REQ_TYPE = STC_Search.P_REQ_TYPE
            }
        } else {
            alert('Please select type.')
            return
        }

        P_FISICAL_YEAR = Year
        P_FACTORY = Factory
        P_CC = CC
        P_APP_MONTH_FRM = Month
        P_APP_MONTH_TO = Month

        if (status.trim() === '') {
            setHmonth(YearMonName)
            setLDList([])
            setOPList([])
            P_PARAMETER = `?P_REQ_TYPE=${P_REQ_TYPE}&P_FISICAL_YEAR=${P_FISICAL_YEAR}&P_FACTORY=${P_FACTORY}&P_CC=${P_CC}&P_APP_MONTH_FRM=${P_APP_MONTH_FRM}&P_APP_MONTH_TO=${P_APP_MONTH_TO}`;
            P_FUNCTION = `${import.meta.env.VITE_API}/report/rptSummaryLeader${P_PARAMETER}`
        } else {
            setDTSumLDList([])
            setLDList([])
            if (status === 'WT') {
                setHop('Detail Report Of Operator By Wait Approve Issue')
            } else if (status === 'FN') {
                setHop('Detail Report Of Operator By Approved Issue')
            } else if (status === 'IM') {
                setHop('Detail Report Of Operator By Implement Issue')
            }

            P_PARAMETER = `?P_REQ_TYPE=${P_REQ_TYPE}&P_FISICAL_YEAR=${P_FISICAL_YEAR}&P_FACTORY=${P_FACTORY}&P_CC=${P_CC}&P_APP_MONTH_FRM=${P_APP_MONTH_FRM}&P_APP_MONTH_TO=${P_APP_MONTH_TO}&P_LEADER_ID=${P_LEADER_ID}&P_LEADER_NAME=${P_LEADER_NAME}&P_OPR_ID=${P_OPR_ID}&P_OPR_NAME=${P_OPR_NAME}&P_MODE=${P_MODE}`;
            P_FUNCTION = `${import.meta.env.VITE_API}/report/rptDetailOperator${P_PARAMETER}`
            console.log(P_FUNCTION)

        }

        setloading(true)
        try {
            const response = await axios.get(P_FUNCTION,
                {
                    headers: {
                        'Authorization': `Basic ${token}`,
                    },
                }
            );
            const data = await response.data;
            if (status.trim() === '') {
                setDTSumLDList(data)
            } else {
                setOPList(data)
            }

            if (data.length === 0) {
                alert('No data records.')
            } 

            setloading(false)
        } catch (error) {
            setloading(false)
            console.error("Error RequesterORType:", error);
            alert(error.message);
        }
    }

    const OnFilterDetailLeader = async (YearMon, LeaderID, LeaderName) => {
        setHLeader(LeaderName)
        let P_REQ_TYPE = '';
        let P_FISICAL_YEAR = '';
        let P_FACTORY = '';
        let P_CC = '';
        let P_APP_MONTH_FRM = '';
        let P_APP_MONTH_TO = '';
        let P_LEADER_ID = '';
        let P_LEADER_NAME = '';

        let Year = YearMon.substring(0, 4);
        let Month = YearMon.substring(4, 6);

        let P_PARAMETER = '';
        let P_FUNCTION = '';
        if (STC_Search.P_REQ_TYPE !== '') {
            if (STC_Search.P_REQ_TYPE === 'LOCT') {
                P_REQ_TYPE = '1,2'
            } else if (STC_Search.P_REQ_TYPE === 'IECT') {
                P_REQ_TYPE = '3,4'
            } else {
                P_REQ_TYPE = STC_Search.P_REQ_TYPE
            }
        } else {
            alert('Please select type.')
            return
        }


        P_FISICAL_YEAR = Year
        P_APP_MONTH_FRM = Month
        P_APP_MONTH_TO = Month
        P_LEADER_ID = LeaderID


        P_PARAMETER = `?P_REQ_TYPE=${P_REQ_TYPE}&P_FISICAL_YEAR=${P_FISICAL_YEAR}&P_FACTORY=${P_FACTORY}&P_CC=${P_CC}&P_APP_MONTH_FRM=${P_APP_MONTH_FRM}&P_APP_MONTH_TO=${P_APP_MONTH_TO}&P_LEADER_ID=${P_LEADER_ID}&P_LEADER_NAME=${P_LEADER_NAME}`;
        P_FUNCTION = `${import.meta.env.VITE_API}/report/rptDetailLeader${P_PARAMETER}`
        setOPList([])
        setloading(true)
        try {
            const response = await axios.get(P_FUNCTION,
                {
                    headers: {
                        'Authorization': `Basic ${token}`,
                    },
                }
            );
            const data = await response.data;
            setLDList(data)
            if (data.length === 0) {
                alert('No data records.')
            } 
            setloading(false)
        } catch (error) {
            setloading(false)
            console.error("Error RequesterORType:", error);
            alert(error.message);
        }
    }

    const OnFilterDetailOperator = async (YearMon, LeaderID, OPRID, status) => {
        if (status === 'WT') {
            setHop('Detail Report Of Operator By Wait Approve Issue')
        } else if (status === 'FN') {
            setHop('Detail Report Of Operator By Approved Issue')
        } else if (status === 'IM') {
            setHop('Detail Report Of Operator By Implement Issue')
        }
        let P_REQ_TYPE = '';
        let P_FISICAL_YEAR = '';
        let P_FACTORY = '';
        let P_CC = '';
        let P_APP_MONTH_FRM = '';
        let P_APP_MONTH_TO = '';
        let P_LEADER_ID = LeaderID;
        let P_LEADER_NAME = '';
        let P_OPR_ID = OPRID;
        let P_OPR_NAME = '';
        let P_MODE = status;

        let Year = YearMon.substring(0, 4);
        let Month = YearMon.substring(4, 6);

        let P_PARAMETER = '';
        let P_FUNCTION = '';

        if (STC_Search.P_REQ_TYPE !== '') {
            if (STC_Search.P_REQ_TYPE === 'LOCT') {
                P_REQ_TYPE = '1,2'
            } else if (STC_Search.P_REQ_TYPE === 'IECT') {
                P_REQ_TYPE = '3,4'
            } else {
                P_REQ_TYPE = STC_Search.P_REQ_TYPE
            }
        } else {
            alert('Please select type.')
            return
        }


        P_FISICAL_YEAR = Year
        P_APP_MONTH_FRM = Month
        P_APP_MONTH_TO = Month


        P_PARAMETER = `?P_REQ_TYPE=${P_REQ_TYPE}&P_FISICAL_YEAR=${P_FISICAL_YEAR}&P_FACTORY=${P_FACTORY}&P_CC=${P_CC}&P_APP_MONTH_FRM=${P_APP_MONTH_FRM}&P_APP_MONTH_TO=${P_APP_MONTH_TO}&P_LEADER_ID=${P_LEADER_ID}&P_LEADER_NAME=${P_LEADER_NAME}&P_OPR_ID=${P_OPR_ID}&P_OPR_NAME=${P_OPR_NAME}&P_MODE=${P_MODE}`;
        P_FUNCTION = `${import.meta.env.VITE_API}/report/rptDetailOperator${P_PARAMETER}`
        console.log(P_FUNCTION)
        setloading(true)
        try {
            const response = await axios.get(P_FUNCTION,
                {
                    headers: {
                        'Authorization': `Basic ${token}`,
                    },
                }
            );
            const data = await response.data;
            setOPList(data)
            if (data.length === 0) {
                alert('No data records.')
            } 

            setloading(false)
        } catch (error) {
            setloading(false)
            console.error("Error RequesterORType:", error);
            alert(error.message);
        }
    }

    return {
        loading,
        setloading,
        STC_Search,
        setSTC_Search,
        HeaderList,
        DetailList,
        handleChangeRadito,
        handleChangeFisical,
        handleChangeFac,
        handleChangeCC,
        handleChangeMonthFrm,
        handleChangeMonthTo,
        handleInputChangeText,
        GenHeader,
        OnSearch,
        OnReset,
        tableRef,
        OnExport,
        OnFilterLeader,
        SumLDList,
        DTSumLDList,
        DetailLDList,
        LDList,
        DetailOPList,
        OPList,
        OnFilterDetailLeader,
        Hmonth,
        HLeader,
        Hop,
        OnFilterDetailOperator
    }
}

export { GetFactory, GetCostCenter, GetYearMonth, ReportGroup_Fn }