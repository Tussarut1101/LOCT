import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../Page/Menu';
import PageLoad from '../Page/PageLoad';
import './TransactionMain.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faMinus, faPlus, faPlusCircle, faPlusSquare, faCheck, faSearch, faRefresh, faDownload, faChevronDown, faChevronUp, faTimes, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import IconButton from "@mui/material/IconButton";
import { FaSignOutAlt } from 'react-icons/fa';
import { RadioWrapper, HiddenRadio, StyledRadio, RadioLabel, StyledSelect, StyledTextBox, RadioButton } from '../StyledToos/StyledCommon';
import { GetFactory, GetCostCenter, TransactionMain_Fn, GetStatusLOCT, GetYearMonth } from './TransactionMain_Fn';
import Select from 'react-select';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import PopupConfirm from '../Common/Popconfirm';

function TransactionMain() {
    const location = useLocation();
    const { FactoryList, facList, } = GetFactory();
    const { CostCenterList, ccList } = GetCostCenter();
    const { StatusList, statusList } = GetStatusLOCT();
    const { yearList, monthList } = GetYearMonth();
    const { loading,
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
        OnDeleted } = TransactionMain_Fn();

    useEffect(() => {
        setloading(true);
        const params = new URLSearchParams(location.search);
        const pType = params.get('P_TYPE') || '';
        const reqType = params.get('P_REQTYPE') || 'LOCT';
        localStorage.setItem('TYPETOMAIN', pType);
        let type;
        let status;
        let dateIssDef;
        let dateSubmitDef;
        if (pType === 'ISSUE') {
            type = reqType
            status = { value: 'CT', label: 'Create' }
            dateIssDef = new Date()
            dateSubmitDef = null

        } else if (pType === 'APPROVE') {
            type = 'ALL'
            status = { value: 'WT', label: 'Wait Approve' }
            dateIssDef = null
            dateSubmitDef = new Date()
        } else {
            type = 'ALL'
            status = { value: 'ALL', label: 'ALL' }
            dateIssDef = null
            dateSubmitDef = new Date()
        }

        FactoryList();
        StatusList();
        setSTC_Search(prevState => ({
            ...prevState,
            ['P_ISS_DATE_FRM']: dateIssDef,
            ['P_ISS_DATE_TO']: dateIssDef,
            ['P_TYPE']: type,
            ['P_STATUS']: status,
            ['P_SUBMIT_DATE_FRM']: dateSubmitDef,
            ['P_SUBMIT_DATE_TO']: dateSubmitDef,
        }));
        setloading(false);
    }, [location]);

    useEffect(() => {
        if (STC_Search.P_FACTORY !== null) {
            CostCenterList(STC_Search.P_FACTORY.value)
        }
    }, [STC_Search.P_FACTORY]);


    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setrecordsPerPage] = useState(10);
    const [totalPages, settotalPages] = useState();

    const [currentRecords, setcurrentRecords] = useState([]);
    const [loadTable, setloadTable] = useState(false)


    useEffect(() => {
        const totalPage = Math.ceil(dataMainList.length / recordsPerPage);
        settotalPages(totalPage)
        const currentRecord = dataMainList.slice(
            (currentPage - 1) * recordsPerPage,
            currentPage * recordsPerPage
        );

        setcurrentRecords(currentRecord)

    }, [dataMainList]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        setloadTable(true)
        setTimeout(() => {
            const currentRecord = dataMainList.slice(
                (currentPage - 1) * recordsPerPage,
                currentPage * recordsPerPage
            );

            setcurrentRecords(currentRecord)
            setloadTable(false)
        }, 500);

    }, [currentPage]);

    const handleChangePerPage = (perpage) => {
        if (perpage === null || perpage.trim() === '') {
            setrecordsPerPage(1);
        } else {
            if (/^\d*$/.test(perpage)) {
                setrecordsPerPage(perpage || 1);
                setCurrentPage(1);
            }
        }


    };

    useEffect(() => {
        const totalPage = Math.ceil(dataMainList.length / recordsPerPage);
        settotalPages(totalPage)
        const currentRecord = dataMainList.slice(
            (currentPage - 1) * recordsPerPage,
            currentPage * recordsPerPage
        );

        setcurrentRecords(currentRecord)

    }, [recordsPerPage]);



    const DownloadButton = (url) => {
        window.open(url, '_blank');
        // window.location.href = url;
    };

    const [visible, setVisible] = useState(false);
    const [strMessage, setstrMessage] = useState('');
    const [Action, setAction] = useState('');
    const [reqNo, setreqNo] = useState('');

    const handleConfirm = () => {
        if (Action === 'APPROVE') {
            OnApprove(reqNo)
        } else if (Action === 'DELETE') {
            OnDeleted(reqNo)
        }
        setVisible(false);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const showConfirm = (Message, action, ReqNo) => {
        setstrMessage(Message);
        setAction(action);
        setreqNo(ReqNo);
        setVisible(true);

    };


    return (
        <div>
            <Header></Header>

            {loading ? (
                <div>
                    <PageLoad></PageLoad>
                </div>
            ) : (
                <div>
                    <div className='Aear' style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                        <div className='AearLeftRightTM'></div>
                        <div className='AearCenterTM'>
                            <div className='cHeadMian'>
                                {localStorage.getItem('TYPETOMAIN') === 'ISSUE' ? 'Issue LOCT / IECT & SGT' :
                                    localStorage.getItem('TYPETOMAIN') === 'APPROVE' ? 'Approve LOCT / IECT & SGT' : 'LOCT/IECT Master List'}
                            </div>
                            <div className='cPanelSearch'>

                                <div className='cRowFlexBF'>
                                    <button className="icon-buttonSearch" style={{ marginRight: '1%' }}>
                                        <FontAwesomeIcon icon={faSearch} onClick={OnSearch} />
                                    </button>
                                    <button className="icon-buttonADD" style={{ marginRight: '1%' }}>
                                        <FontAwesomeIcon icon={faPlus} onClick={OnIssue} />
                                    </button>
                                </div>

                                <div className='cRowFlex'>
                                    <div className='cTilteF'>Factory&nbsp;<label style={{ color: 'red' }}>*</label></div>
                                    <div className='cTools'>
                                        <StyledSelect
                                            className='react-selectMain'
                                            value={STC_Search.P_FACTORY}
                                            onChange={handleChangeFac}
                                            options={facList}
                                            placeholder="-- Select --"
                                            classNamePrefix="react-select"
                                            isDisabled={false}
                                        />
                                    </div>
                                    <div className='cTilteE'>Cost Center</div>
                                    <div className='cTools'>
                                        <StyledSelect
                                            className='react-selectMain'
                                            value={STC_Search.P_CC}
                                            onChange={handleChangeCC}
                                            options={ccList}
                                            placeholder="-- Select --"
                                            classNamePrefix="react-select"
                                            isDisabled={false}
                                        />
                                    </div>
                                    <div className='cNone'></div>
                                </div>

                                <div className='cRowFlex' style={{ display: (localStorage.getItem('TYPETOMAIN') === 'ISSUE' ? '' : 'none') }}>
                                    <div className='cTilteF'>Request Date From&nbsp;<label style={{ color: 'red' }}>*</label></div>
                                    <div className='cTools'>
                                        <div className="datepicker-container">
                                            <DatePicker
                                                selected={STC_Search.P_ISS_DATE_FRM}
                                                onChange={handleChangeIssFrm}
                                                dateFormat="dd/MM/yyyy"
                                                placeholderText="dd/MM/yyyy"
                                                className="custom-datepicker"
                                            />
                                            <FontAwesomeIcon icon={faCalendarAlt} className="datepicker-icon" />
                                        </div>
                                    </div>
                                    <div className='cTilteE'>Request Date To&nbsp;<label style={{ color: 'red' }}>*</label></div>
                                    <div className='cTools'>
                                        <div className="datepicker-container">
                                            <DatePicker
                                                selected={STC_Search.P_ISS_DATE_TO}
                                                onChange={handleChangeIssTo}
                                                dateFormat="dd/MM/yyyy"
                                                placeholderText="dd/MM/yyyy"
                                                className="custom-datepicker"
                                            />
                                            <FontAwesomeIcon icon={faCalendarAlt} className="datepicker-icon" />
                                        </div>
                                    </div>
                                    <div className='cNone'></div>
                                </div>

                                <div className='cRowFlex' style={{ display: (localStorage.getItem('TYPETOMAIN') === 'ISSUE' ? 'none' : '') }}>
                                    <div className='cTilteF'>Submit Date From</div>
                                    <div className='cTools'>
                                        <div className="datepicker-container">
                                            <DatePicker
                                                selected={STC_Search.P_SUBMIT_DATE_FRM}
                                                onChange={handleChangeSubmitFrm}
                                                dateFormat="dd/MM/yyyy"
                                                placeholderText="dd/MM/yyyy"
                                                className="custom-datepicker"
                                            />
                                            <FontAwesomeIcon icon={faCalendarAlt} className="datepicker-icon" />
                                        </div>
                                    </div>
                                    <div className='cTilteE'>Submit Date To</div>
                                    <div className='cTools'>
                                        <div className="datepicker-container">
                                            <DatePicker
                                                selected={STC_Search.P_SUBMIT_DATE_TO}
                                                onChange={handleChangeSubmitTo}
                                                dateFormat="dd/MM/yyyy"
                                                placeholderText="dd/MM/yyyy"
                                                className="custom-datepicker"
                                            />
                                            <FontAwesomeIcon icon={faCalendarAlt} className="datepicker-icon" />
                                        </div>
                                    </div>
                                    <div className='cNone'></div>
                                </div>

                                <div className='cRowFlex' style={{ display: (localStorage.getItem('TYPETOMAIN') === 'APPROVE' ? 'none' : '') }}>
                                    <div className='cTilteF'>Request By ID{localStorage.getItem('TYPETOMAIN') === 'ISSUE' ? <>&nbsp;<label style={{ color: 'red' }}>*</label></> : ''} </div>
                                    <div className='cTools'>
                                        <StyledTextBox className='dText'
                                            type="text"
                                            placeholder=""
                                            name='P_EMP_ID'
                                            value={STC_Search.P_EMP_ID}
                                            onChange={handleInputChangeText}
                                        />
                                    </div>
                                    <div className='cTilteE'>Request By Name</div>
                                    <div className='cTools'>
                                        <StyledTextBox className='dText'
                                            type="text"
                                            placeholder=""
                                            name='P_EMP_NAME'
                                            value={STC_Search.P_EMP_NAME}
                                            onChange={handleInputChangeText}
                                        />
                                    </div>
                                    <div className='cNone'></div>
                                </div>

                                <div className='cRowFlex' style={{ display: (localStorage.getItem('TYPETOMAIN') === 'MASTERLIST' ? '' : 'none') }}>
                                    <div className='cTilteF'>Fisical Year</div>
                                    <div className='cTools'>
                                        <StyledSelect
                                            className='react-selectMain'
                                            value={STC_Search.P_FISICAL_YEAR}
                                            onChange={handleChangeFisical}
                                            options={yearList}
                                            placeholder="-- Select --"
                                            classNamePrefix="react-select"
                                            isDisabled={false}
                                        />
                                    </div>
                                    <div className='cTilteE'></div>
                                    <div className='cTools'>

                                    </div>
                                    <div className='cNone'></div>
                                </div>

                                <div className='cRowFlex' style={{ display: (localStorage.getItem('TYPETOMAIN') === 'MASTERLIST' ? '' : 'none') }}>
                                    <div className='cTilteF'>Approve Month From</div>
                                    <div className='cTools'>
                                        <StyledSelect
                                            className='react-selectMain'
                                            value={STC_Search.P_MONTH_FRM}
                                            onChange={handleChangeMonthFrm}
                                            options={monthList}
                                            placeholder="-- Select --"
                                            classNamePrefix="react-select"
                                            isDisabled={STC_Search.P_FISICAL_YEAR === null}
                                        />
                                    </div>
                                    <div className='cTilteE'>Approve Month To</div>
                                    <div className='cTools'>
                                        <StyledSelect
                                            className='react-selectMain'
                                            value={STC_Search.P_MONTH_TO}
                                            onChange={handleChangeMonthTo}
                                            options={monthList}
                                            placeholder="-- Select --"
                                            classNamePrefix="react-select"
                                            isDisabled={STC_Search.P_FISICAL_YEAR === null}
                                        />
                                    </div>
                                    <div className='cNone'></div>
                                </div>


                                <div className='cRowFlex'>
                                    <div className='cTilteF'>Status</div>
                                    <div className='cTools'>
                                        <StyledSelect
                                            className='react-selectMain'
                                            value={STC_Search.P_STATUS}
                                            onChange={handleChangeStatus}
                                            options={statusList}
                                            placeholder="-- Select --"
                                            classNamePrefix="react-select"
                                            isDisabled={localStorage.getItem('TYPETOMAIN') === 'MASTERLIST' ? false : true}
                                        />
                                    </div>
                                    <div className='cTilteE'></div>
                                    <div className='cTools'>

                                    </div>
                                    <div className='cNone'></div>
                                </div>

                                <div className='cRowFlex'>
                                    <div className='cTilteF'>Type&nbsp;<label style={{ color: 'red' }}>*</label></div>
                                    <div className='cTools'>
                                        <div style={{ display: 'flex', fontFamily: 'calibri Light', fontSize: '12px' }}>
                                            <RadioWrapper style={{ display: (localStorage.getItem('TYPETOMAIN') === 'ISSUE' ? 'none' : '') }}>
                                                <HiddenRadio
                                                    id="ALL"
                                                    name="options"
                                                    value="ALL"
                                                    checked={STC_Search.P_TYPE === 'ALL'}
                                                    onChange={handleChangeRadito}
                                                />
                                                <StyledRadio checked={STC_Search.P_TYPE === 'ALL'} />
                                                <RadioLabel htmlFor="ALL">ALL</RadioLabel>
                                            </RadioWrapper>
                                            <RadioWrapper>
                                                <HiddenRadio
                                                    id="LOCT"
                                                    name="options"
                                                    value="LOCT"
                                                    checked={STC_Search.P_TYPE === 'LOCT'}
                                                    onChange={handleChangeRadito}
                                                />
                                                <StyledRadio checked={STC_Search.P_TYPE === 'LOCT'} />
                                                <RadioLabel htmlFor="LOCT">LOCT</RadioLabel>
                                            </RadioWrapper>
                                            <RadioWrapper>
                                                <HiddenRadio
                                                    id="IECT"
                                                    name="options"
                                                    value="IECT"
                                                    checked={STC_Search.P_TYPE === 'IECT'}
                                                    onChange={handleChangeRadito}
                                                />
                                                <StyledRadio checked={STC_Search.P_TYPE === 'IECT'} />
                                                <RadioLabel htmlFor="IECT">IECT</RadioLabel>
                                            </RadioWrapper>

                                        </div>
                                    </div>
                                    <div className='cTilteE'></div>
                                    <div className='cToolsBE'>
                                        <button className="icon-buttonSearch" style={{ marginRight: '1%' }}>
                                            <FontAwesomeIcon icon={faSearch} onClick={OnSearch} />
                                        </button>
                                        <button className="icon-buttonADD" style={{ marginRight: '1%', display: (localStorage.getItem('TYPETOMAIN') === 'ISSUE' ? '' : 'none') }}>
                                            <FontAwesomeIcon icon={faPlus} onClick={OnIssue} />
                                        </button>
                                        {dataMainList.length > 0 ? (
                                            <button className="icon-buttonExport" onClick={OnExport}>
                                                <FontAwesomeIcon icon={faDownload} /> Export Excel
                                            </button>) : (null)}
                                    </div>
                                    <div className='cNone'></div>
                                </div>
                            </div>
                            <div style={{ display: (localStorage.getItem('TYPETOMAIN') === 'APPROVE' ? 'none' : '') }}>
                                {currentRecords.length > 0 ? (
                                    <div className='cPaneCenter' style={{ marginTop: '0.5rem' }}>
                                        {loadTable ? (<div><PageLoad></PageLoad></div>) : (
                                            <div className="grid-containerMain">
                                                <table className="grid-tableMain" style={{ width: '1770px' }}>
                                                    <thead>
                                                        <tr>
                                                            <th style={{ width: '100px' }} align='center'></th>
                                                            <th style={{ width: '100px' }} align='center'>Factory</th>
                                                            <th style={{ width: '120px' }} align='center'>Cost Center</th>
                                                            <th style={{ width: '180px' }} align='center'>Register No</th>
                                                            <th style={{ width: '150px' }} align='center'>Register Date</th>
                                                            <th style={{ width: '250px' }} align='left'>Request By</th>
                                                            <th style={{ width: '300px' }} align='left'>Subject</th>
                                                            <th style={{ width: '250px' }} align='left'>Leader</th>
                                                            <th style={{ width: '150px' }} align='center'>Approve Date</th>
                                                            <th style={{ width: '250px' }} align='left'>Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {currentRecords.map((row, index) => (
                                                            <tr key={index}>
                                                                <td align='center'>
                                                                    <button className="icon-buttonEdit" style={{ display: (localStorage.getItem('TYPETOMAIN') === 'ISSUE' ? '' : 'none') }} onClick={(e) => OnEdit(row.LRH_REQ_NO, row.LRH_ISS_TYPE)}>
                                                                        <FontAwesomeIcon icon={faPencil} />
                                                                    </button>
                                                                    <button className="icon-buttonDel" style={{ display: (localStorage.getItem('TYPETOMAIN') === 'MASTERLIST' ? 'none' : '') }} onClick={() => showConfirm(`คุณต้องการลบเอกสาร ${row.LRH_REQ_NO} ใช่หรือไม่ ?`, 'DELETE', row.LRH_REQ_NO)}>
                                                                        <FontAwesomeIcon icon={faMinus} />
                                                                    </button>
                                                                    <button className="icon-buttonView" style={{ display: (localStorage.getItem('TYPETOMAIN') === 'MASTERLIST' ? '' : 'none') }} onClick={(e) => OnView(row.LRH_REQ_NO, row.LRH_ISS_TYPE)} >
                                                                        <FontAwesomeIcon icon={faSearch} />
                                                                    </button>
                                                                </td>
                                                                <td align='center'>{row.LRH_FACTORY}</td>
                                                                <td align='center'>{row.LRH_COST_CENTER}</td>
                                                                <td align='center'>{row.LRH_REQ_NO}</td>
                                                                <td align='center'>{row.LRH_REQ_DATE}</td>
                                                                <td align='left'>{row.LRH_REQ_BY}</td>
                                                                <td align='left'>{row.LRH_PROBLEM}</td>
                                                                <td align='left'>{row.LRH_LEADER_APP_BY}</td>
                                                                <td align='center'>{row.LRH_LEADER_APP_DATE}</td>
                                                                <td align='left'><div style={{ backgroundColor: '#DEAB62', padding: '1% 4% 1% 4%', borderRadius: '10px', display: 'inline-flex' }}>{row.LRH_REQ_STATUS}</div></td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>

                                                <table ref={tableRef} id="tableExport" className="grid-tableMain" style={{ width: '1770px', display: 'none' }}>
                                                    <thead>
                                                        <tr>
                                                            <th style={{ width: '100px' }} align='center'></th>
                                                            <th style={{ width: '100px' }} align='center'>Factory</th>
                                                            <th style={{ width: '120px' }} align='center'>Cost Center</th>
                                                            <th style={{ width: '180px' }} align='center'>Register No</th>
                                                            <th style={{ width: '150px' }} align='center'>Register Date</th>
                                                            <th style={{ width: '250px' }} align='left'>Request By</th>
                                                            <th style={{ width: '300px' }} align='left'>Subject</th>
                                                            <th style={{ width: '250px' }} align='left'>Leader</th>
                                                            <th style={{ width: '150px' }} align='center'>Approve Date</th>
                                                            <th style={{ width: '250px' }} align='left'>Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {dataMainList.map((row, index) => (
                                                            <tr key={index}>
                                                                <td align='center'>
                                                                    <button className="icon-buttonEdit" style={{ display: (localStorage.getItem('TYPETOMAIN') === 'ISSUE' ? '' : 'none') }} onClick={(e) => OnEdit(row.LRH_REQ_NO, row.LRH_ISS_TYPE)}>
                                                                        <FontAwesomeIcon icon={faPencil} />
                                                                    </button>
                                                                    <button className="icon-buttonDel" style={{ display: (localStorage.getItem('TYPETOMAIN') === 'MASTERLIST' ? 'none' : '') }} onClick={() => showConfirm(`คุณต้องการลบเอกสาร ${row.LRH_REQ_NO} ใช่หรือไม่ ?`, 'DELETE', row.LRH_REQ_NO)}>
                                                                        <FontAwesomeIcon icon={faMinus} />
                                                                    </button>
                                                                    <button className="icon-buttonView" style={{ display: (localStorage.getItem('TYPETOMAIN') === 'MASTERLIST' ? '' : 'none') }} onClick={(e) => OnView(row.LRH_REQ_NO, row.LRH_ISS_TYPE)} >
                                                                        <FontAwesomeIcon icon={faSearch} />
                                                                    </button>
                                                                </td>
                                                                <td align='center'>{row.LRH_FACTORY}</td>
                                                                <td align='center'>{row.LRH_COST_CENTER}</td>
                                                                <td align='center'>{row.LRH_REQ_NO}</td>
                                                                <td align='center'>{row.LRH_REQ_DATE}</td>
                                                                <td align='left'>{row.LRH_REQ_BY}</td>
                                                                <td align='left'>{row.LRH_PROBLEM}</td>
                                                                <td align='left'>{row.LRH_LEADER_APP_BY}</td>
                                                                <td align='center'>{row.LRH_LEADER_APP_DATE}</td>
                                                                <td align='left'><div style={{ backgroundColor: '#DEAB62', padding: '1% 4% 1% 4%', borderRadius: '10px', display: 'inline-flex' }}>{row.LRH_REQ_STATUS}</div></td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>

                                            </div>)}
                                    </div>
                                ) : (<div className='cPaneCenter'><h2>No data dound</h2></div>)}

                                {dataMainList.length > 0 ? (
                                    <div className='cPaneCenter'>
                                        <div className='grid-Mobile'>
                                            {dataMainList.map((row, index) => (
                                                <div className='grid-MobileMain'>
                                                    <div className='grid-MobileContent'>
                                                        <div className='grid-MobileTile'></div>
                                                        <div className='grid-MobileItem'>
                                                            <button className="icon-buttonEdit" style={{ display: (localStorage.getItem('TYPETOMAIN') === 'ISSUE' ? '' : 'none') }} onClick={(e) => OnEdit(row.LRH_REQ_NO, row.LRH_ISS_TYPE)}>
                                                                <FontAwesomeIcon icon={faPencil} />
                                                            </button>
                                                            <button className="icon-buttonDel" style={{ display: (localStorage.getItem('TYPETOMAIN') === 'MASTERLIST' ? 'none' : '') }} onClick={() => showConfirm(`คุณต้องการลบเอกสาร ${row.LRH_REQ_NO} ใช่หรือไม่ ?`, 'DELETE', row.LRH_REQ_NO)}>
                                                                <FontAwesomeIcon icon={faMinus} />
                                                            </button>
                                                            <button className="icon-buttonView" style={{ display: (localStorage.getItem('TYPETOMAIN') === 'MASTERLIST' ? '' : 'none') }} onClick={(e) => OnView(row.LRH_REQ_NO, row.LRH_ISS_TYPE)} >
                                                                <FontAwesomeIcon icon={faSearch} />
                                                            </button>

                                                        </div>
                                                    </div>
                                                    <div className='grid-MobileContent'>
                                                        <div className='grid-MobileTile'>Factory :</div>
                                                        <div className='grid-MobileItem'>{row.LRH_FACTORY}</div>
                                                    </div>
                                                    <div className='grid-MobileContent'>
                                                        <div className='grid-MobileTile'>Cost Center :</div>
                                                        <div className='grid-MobileItem'>{row.LRH_COST_CENTER}</div>
                                                    </div>
                                                    <div className='grid-MobileContent'>
                                                        <div className='grid-MobileTile'>Register No. :</div>
                                                        <div className='grid-MobileItem'>{row.LRH_REQ_NO}</div>
                                                    </div>
                                                    <div className='grid-MobileContent'>
                                                        <div className='grid-MobileTile'>Register Date :</div>
                                                        <div className='grid-MobileItem'>{row.LRH_REQ_DATE}</div>
                                                    </div>
                                                    <div className='grid-MobileContent'>
                                                        <div className='grid-MobileTile'>Request By :</div>
                                                        <div className='grid-MobileItem'>{row.LRH_REQ_BY}</div>
                                                    </div>
                                                    <div className='grid-MobileContent'>
                                                        <div className='grid-MobileTile'>Subject :</div>
                                                        <div className='grid-MobileItem'>{row.LRH_PROBLEM}</div>
                                                    </div>
                                                    <div className='grid-MobileContent'>
                                                        <div className='grid-MobileTile'>Leader :</div>
                                                        <div className='grid-MobileItem'>{row.LRH_LEADER_APP_BY}</div>
                                                    </div>
                                                    <div className='grid-MobileContent'>
                                                        <div className='grid-MobileTile'> Approve Date :</div>
                                                        <div className='grid-MobileItem'>{row.LRH_LEADER_APP_DATE}</div>
                                                    </div>
                                                    <div className='grid-MobileContent'>
                                                        <div className='grid-MobileTile'>Status : </div>
                                                        <div className='grid-MobileItem'><div style={{ backgroundColor: '#DEAB62', padding: '1% 4% 1% 4%', borderRadius: '10px', display: 'inline-flex', textAlign: 'left' }}>{row.LRH_REQ_STATUS}</div></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>


                                    </div>) : (null)}

                                <div className='dPerpage' style={{ display: (dataMainList.length > 0 ? '' : 'none') }}>
                                    <div className="paginationMain">
                                        <div className='paginationLeft'>{(totalPages === currentPage ? (dataMainList.length - currentRecords.length + 1) : (currentRecords.length * currentPage) - (currentRecords.length - 1))} to {(totalPages === currentPage ? dataMainList.length : dataMainList.length - (dataMainList.length - (currentRecords.length * currentPage)))} of {dataMainList.length} items</div>
                                        <div className='paginationRight'>{currentPage > 1 && (
                                            <button onClick={() => handlePageChange(currentPage - 1)}><FontAwesomeIcon icon={faChevronLeft} /></button>
                                        )}
                                            {Array.from({ length: totalPages }, (_, index) => (
                                                <React.Fragment key={index + 1}>
                                                    {index + 1 === 1 && (
                                                        <button
                                                            className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}
                                                            onClick={() => handlePageChange(index + 1)}
                                                        >
                                                            {index + 1}
                                                        </button>
                                                    )}
                                                    {(1 !== currentPage && index + 1 === currentPage && index + 1 !== 1 && index + 1 !== totalPages) && (
                                                        <button
                                                            className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}
                                                            onClick={() => handlePageChange(index + 1)}
                                                        >
                                                            {index + 1}
                                                        </button>
                                                    )}

                                                    {(totalPages !== 1 && index + 1 === totalPages) && (
                                                        <button
                                                            className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}
                                                            onClick={() => handlePageChange(index + 1)}
                                                        >
                                                            {index + 1}
                                                        </button>
                                                    )}
                                                    {index + 1 === 5 && totalPages > 5 &&
                                                        <button
                                                            className={`page-item ${index + 1 === currentPage ? '' : ''}`}

                                                        >
                                                            ...
                                                        </button>}
                                                </React.Fragment>
                                            ))}
                                            {currentPage < totalPages && (
                                                <button onClick={() => handlePageChange(currentPage + 1)}><FontAwesomeIcon icon={faChevronRight} /></button>
                                            )}</div>


                                    </div>
                                    <div className='perPage'>
                                        <StyledTextBox style={{ width: '5%', textAlign: 'center' }}
                                            type="text"
                                            placeholder=""
                                            value={recordsPerPage || 0}
                                            onChange={(e) => handleChangePerPage(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: (localStorage.getItem('TYPETOMAIN') === 'APPROVE' ? 'flex' : 'none'), width: '100%', marginTop: '1rem' }}>
                                {dataMainList.length > 0 ? (
                                    <div className='cCoverApp'>
                                        {dataMainList.map((row, index) => (
                                            <div className='cPaneCenterAppM'>
                                                <div>
                                                    <div className='cPaneCenterAppS'>
                                                        <div className='cPaneCenterAppS1' onClick={() => handleChangeOpen(row.LRH_REQ_NO)}>
                                                            <div className='cConBlock'>
                                                                <div className='cConflex'>
                                                                    <div className='cCon'>
                                                                        OPR Issue Date : {row.LRH_REQ_DATE}
                                                                    </div>
                                                                    <div className='cCon' style={{ justifyContent: 'flex-end' }}>
                                                                        Register No : {row.LRH_REQ_NO}
                                                                    </div>
                                                                </div>
                                                                <div className='cConflex'>
                                                                    <div className='cCon'>
                                                                        User : {row.LRH_REQ_BY}
                                                                    </div>
                                                                    <div className='cCon' style={{ justifyContent: 'flex-end' }}>
                                                                        <div style={{ backgroundColor: '#1A79CB', color: '#ffffff', padding: '0.3rem', borderRadius: '20px' }}>{row.LRH_REQ_STATUS}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='cPaneCenterAppS2' onClick={() => handleChangeOpen(row.LRH_REQ_NO)}>
                                                            {row.LRH_IS_OPEN ? <FontAwesomeIcon icon={faChevronUp} /> : <FontAwesomeIcon icon={faChevronDown} />}
                                                        </div>

                                                    </div>
                                                    <div className='cPaneCenterAppS'>
                                                        <div className={`cPaneCenterAppD ${row.LRH_IS_OPEN ? 'visible' : ''}`} >
                                                            <div className='cConDetailF'>
                                                                <div className='cConBlock'>
                                                                    <div>Subject (เรื่อง)</div>
                                                                    <div style={{ marginBottom: '1rem' }}>
                                                                        <StyledTextBox className='dTextDetail'
                                                                            type="text"
                                                                            placeholder=""
                                                                            name='LRH_PROBLEM'
                                                                            value={row.LRH_PROBLEM.replace('(SL)', '').replace('(L)', '').replace('(SI)', '').replace('(I)', '')}
                                                                            onChange={(e) => handleChangeText(row.LRH_REQ_NO, 'LRH_PROBLEM', e.target.value)}
                                                                        />
                                                                    </div>
                                                                    <div>Before Improvement (ก่อนการปรับปรุง)</div>
                                                                    <div style={{ marginBottom: '1rem' }}><StyledTextBox className='dTextDetail'
                                                                        type="text"
                                                                        placeholder=""
                                                                        name='LRH_DET_BEFORE'
                                                                        value={row.LRH_DET_BEFORE}
                                                                        onChange={(e) => handleChangeText(row.LRH_REQ_NO, 'LRH_DET_BEFORE', e.target.value)}
                                                                    /></div>
                                                                    <div>After Improvement (หลังการปรับปรุง)</div>
                                                                    <div style={{ marginBottom: '1rem' }}><StyledTextBox className='dTextDetail'
                                                                        type="text"
                                                                        placeholder=""
                                                                        name='LRH_DET_AFTER'
                                                                        value={row.LRH_DET_AFTER}
                                                                        onChange={(e) => handleChangeText(row.LRH_REQ_NO, 'LRH_DET_AFTER', e.target.value)}
                                                                    /></div>
                                                                    <div style={{ marginBottom: '1rem', height: '32px' }}>
                                                                        <div className='btnDownload' style={{ display: (row.LRH_FILESERVER !== null ? '' : 'none') }} onClick={() => DownloadButton(row.LRH_FILE_URL)}>
                                                                            <FontAwesomeIcon icon={faDownload} style={{ marginRight: '3px' }} /> Dowload
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className='cConDetailF'>
                                                                <div className='cConBlock'>
                                                                    <div>Suggestion Issue (เป็น Suggestion หรือไม่) &nbsp;<label style={{ color: 'red' }}>*</label></div>
                                                                    <div style={{ display: 'flex', marginTop: '1%', marginBottom: '1rem' }}>
                                                                        <RadioButton
                                                                            id={`SGTY_${row.LRH_REQ_NO}`}
                                                                            name={`sgt_${row.LRH_REQ_NO}`}
                                                                            value="Y"
                                                                            checked={row.LRH_SUMIT_TO_SG === 'Y'}
                                                                            disabled={true}
                                                                            label={'Yes'}
                                                                        />
                                                                        <RadioButton
                                                                            id={`SGTN_${row.LRH_REQ_NO}`}
                                                                            name={`sgt_${row.LRH_REQ_NO}`}
                                                                            value="N"
                                                                            checked={row.LRH_SUMIT_TO_SG === 'N'}
                                                                            disabled={true}
                                                                            label={'No'}
                                                                        />
                                                                    </div>
                                                                    <div>Implement Activity (ปฎิบัติแล้วหรือยัง) &nbsp;<label style={{ color: 'red' }}>*</label></div>
                                                                    <div style={{ display: 'flex', marginTop: '1%', marginBottom: '1rem' }}>
                                                                        <RadioButton
                                                                            id={`IMPY_${row.LRH_REQ_NO}`}
                                                                            name={`imp_${row.LRH_REQ_NO}`}
                                                                            value="Y"
                                                                            checked={row.LRH_EVALUATE_STS === 'Y'}
                                                                            onChange={(event) => handleChangeRadio(row.LRH_REQ_NO, 'LRH_EVALUATE_STS', event)}
                                                                            disabled={false}
                                                                            label={'Yes'}
                                                                        />
                                                                        <RadioButton
                                                                            id={`IMPN_${row.LRH_REQ_NO}`}
                                                                            name={`imp_${row.LRH_REQ_NO}`}
                                                                            value="N"
                                                                            checked={row.LRH_EVALUATE_STS === 'N'}
                                                                            onChange={(event) => handleChangeRadio(row.LRH_REQ_NO, 'LRH_EVALUATE_STS', event)}
                                                                            disabled={false}
                                                                            label={'No'}
                                                                        />
                                                                    </div>
                                                                    <div style={{ display: (row.LRH_EVALUATE_STS === 'Y' ? '' : 'none') }}>Implement Date (วันที่ที่ปฎิบัติ)&nbsp;<label style={{ color: 'red' }}>*</label></div>
                                                                    <div style={{ marginBottom: '1rem', display: (row.LRH_EVALUATE_STS === 'Y' ? '' : 'none') }}><div className="datepicker-container">
                                                                        <DatePicker
                                                                            selected={row.LRH_EVALUATE_DATE}
                                                                            onChange={(selectDate) => handleChangeDate(row.LRH_REQ_NO, 'LRH_EVALUATE_DATE', selectDate)}
                                                                            dateFormat="dd/MM/yyyy"
                                                                            placeholderText="dd/MM/yyyy"
                                                                            className="custom-datepicker"
                                                                        />
                                                                        <FontAwesomeIcon icon={faCalendarAlt} className="datepicker-icon" />
                                                                    </div></div>


                                                                    <div style={{ height: '20px', display: (row.LRH_EVALUATE_STS === 'Y' ? 'none' : '') }}></div>
                                                                    <div style={{ marginBottom: '1rem', height: '42px', display: (row.LRH_EVALUATE_STS === 'Y' ? 'none' : '') }}></div>

                                                                    <div style={{ marginBottom: '1rem', height: '32px' }}>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className='cConDetailF'>
                                                                <div className='cConBlock'>
                                                                    <div>Mhr Saving </div>
                                                                    <div style={{ marginBottom: '1rem' }}>
                                                                        <StyledTextBox className='dTextNumber'
                                                                            type="text"
                                                                            placeholder=""
                                                                            name='LRH_MH_TSAVE'
                                                                            value={row.LRH_MH_TSAVE}
                                                                            onChange={(e) => handleChangeText(row.LRH_REQ_NO, 'LRH_MH_TSAVE', e.target.value)}
                                                                        />
                                                                    </div>
                                                                    <div>Cost Saving </div>
                                                                    <div style={{ marginBottom: '1rem' }}><StyledTextBox className='dTextNumber'
                                                                        type="text"
                                                                        placeholder=""
                                                                        name='LRH_MC_TSAVE'
                                                                        value={row.LRH_MC_TSAVE}
                                                                        onChange={(e) => handleChangeText(row.LRH_REQ_NO, 'LRH_MC_TSAVE', e.target.value)}
                                                                    /></div>
                                                                    <div>Leader Comment</div>
                                                                    <div style={{ marginBottom: '1rem' }}><StyledTextBox className='dTextDetail'
                                                                        type="text"
                                                                        placeholder=""
                                                                        name='LRH_LEADER_COMMENT'
                                                                        value={row.LRH_LEADER_COMMENT}
                                                                        onChange={(e) => handleChangeText(row.LRH_REQ_NO, 'LRH_LEADER_COMMENT', e.target.value)}
                                                                    /></div>
                                                                    <div style={{ marginBottom: '1rem' }}>
                                                                        <div className='btnApp' onClick={() => showConfirm('คุณต้องการอนุมัติเอกสารฉบับนี้ใช่หรือไม่ ?', 'APPROVE', row.LRH_REQ_NO)}>
                                                                            <FontAwesomeIcon icon={faCheck} style={{ marginRight: '3px' }} /> Approve
                                                                        </div>
                                                                        <div className='btnDel' onClick={() => showConfirm(`คุณต้องการลบเอกสาร ${row.LRH_REQ_NO} ใช่หรือไม่ ?`, 'APPROVE', row.LRH_REQ_NO)}>
                                                                            <FontAwesomeIcon icon={faTimes} style={{ marginRight: '3px' }} /> Delete
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>))}
                                    </div>
                                ) : (<div className='cPaneCenter' style={{ display: 'flex', textAlign: 'center' }}><h2>No data found</h2></div>)}
                            </div>
                        </div>
                        <div className='AearLeftRightTM'></div>
                    </div>
                </div>
            )}

            <PopupConfirm
                visible={visible}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                message={strMessage}
            />
        </div>

    )
}

export default TransactionMain