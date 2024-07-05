import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../Page/Menu';
import PageLoad from '../../Page/PageLoad';
import './ReportGroup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faMinus, faPlus, faPlusCircle, faPlusSquare, faCheck, faSearch, faRefresh, faDownload, faChevronDown, faChevronUp, faTimes, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import IconButton from "@mui/material/IconButton";
import { FaSignOutAlt } from 'react-icons/fa';
import { RadioWrapper, HiddenRadio, StyledRadio, RadioLabel, StyledSelect, StyledTextBox, RadioButton } from '../../StyledToos/StyledCommon';
import { GetFactory, GetCostCenter, GetYearMonth, ReportGroup_Fn } from './ReportGroup_FN';
import Select from 'react-select';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

function ReportGroup() {

    const location = useLocation();
    const { FactoryList, facList, } = GetFactory();
    const { CostCenterList, ccList } = GetCostCenter();
    const { yearList, monthList } = GetYearMonth();
    const { loading,
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
        OnFilterDetailOperator } = ReportGroup_Fn();

    useEffect(() => {
        setloading(true);
        const params = new URLSearchParams(location.search);
        const rptType = params.get('P_REPORT_BY') || '';
        localStorage.setItem('REPORTBY', rptType);
        FactoryList();
        setSTC_Search(prevState => ({
            ...prevState,
            ['P_REQ_TYPE']: 'ALL',
        }));
        GenHeader();
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
        const totalPage = Math.ceil(DetailList.length / recordsPerPage);
        settotalPages(totalPage)
        const currentRecord = DetailList.slice(
            (currentPage - 1) * recordsPerPage,
            currentPage * recordsPerPage
        );

        setcurrentRecords(currentRecord)

    }, [DetailList]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);

    };

    useEffect(() => {
        setloadTable(true)
        setTimeout(() => {
            const currentRecord = DetailList.slice(
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
        const totalPage = Math.ceil(DetailList.length / recordsPerPage);
        settotalPages(totalPage)
        const currentRecord = DetailList.slice(
            (currentPage - 1) * recordsPerPage,
            currentPage * recordsPerPage
        );

        setcurrentRecords(currentRecord)

    }, [recordsPerPage]);


    return (
        <div>
            <Header></Header>
            {loading ? (
                <div>
                    <PageLoad></PageLoad>
                </div>
            ) : (<div>
                <div className='Aear' style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                    <div className='AearLeftRightTM'></div>
                    <div className='AearCenterTM'>
                        <div className='cHeaderReport'>
                            {localStorage.getItem('REPORTBY') === 'SUMALL' ? 'Summary Report' :
                                localStorage.getItem('REPORTBY') === 'FACTORY' ? 'Summary Report By Factory' :
                                    localStorage.getItem('REPORTBY') === 'CC' ? 'Summary Report By Cost Center' :
                                        localStorage.getItem('REPORTBY') === 'CENTER' ? 'Summary Report By Center' :
                                            localStorage.getItem('REPORTBY') === 'LEADER' ? 'Summary Report By Leader' :
                                                localStorage.getItem('REPORTBY') === 'DETAILLEADER' ? 'Detail Report Of Leader' : 'Detail Report Of Operator'}
                        </div>
                        <div className='cPanelSearchReport'>
                            <div className='cRowFlex'>
                                <div className='cTilteF'>Type&nbsp;<label style={{ color: 'red' }}>*</label></div>
                                <div className='cTools'>
                                    <div style={{ display: 'flex', fontFamily: 'calibri Light', fontSize: '12px' }}>
                                        <RadioWrapper >
                                            <HiddenRadio
                                                id="ALL"
                                                name="options"
                                                value="ALL"
                                                checked={STC_Search.P_REQ_TYPE === 'ALL'}
                                                onChange={handleChangeRadito}
                                            />
                                            <StyledRadio checked={STC_Search.P_REQ_TYPE === 'ALL'} />
                                            <RadioLabel htmlFor="ALL">ALL</RadioLabel>
                                        </RadioWrapper>
                                        <RadioWrapper>
                                            <HiddenRadio
                                                id="LOCT"
                                                name="options"
                                                value="LOCT"
                                                checked={STC_Search.P_REQ_TYPE === 'LOCT'}
                                                onChange={handleChangeRadito}
                                            />
                                            <StyledRadio checked={STC_Search.P_REQ_TYPE === 'LOCT'} />
                                            <RadioLabel htmlFor="LOCT">LOCT</RadioLabel>
                                        </RadioWrapper>
                                        <RadioWrapper>
                                            <HiddenRadio
                                                id="IECT"
                                                name="options"
                                                value="IECT"
                                                checked={STC_Search.P_REQ_TYPE === 'IECT'}
                                                onChange={handleChangeRadito}
                                            />
                                            <StyledRadio checked={STC_Search.P_REQ_TYPE === 'IECT'} />
                                            <RadioLabel htmlFor="IECT">IECT</RadioLabel>
                                        </RadioWrapper>

                                    </div>
                                </div>
                                <div className='cTilteE'></div>
                                <div className='cToolsBE'>

                                </div>
                                <div className='cNone'></div>
                            </div>

                            <div className='cRowFlex'>
                                <div className='cTilteF'>Fisical Year&nbsp;<label style={{ color: 'red' }}>*</label></div>
                                <div className='cTools'>
                                    <StyledSelect
                                        className='react-selectMain'
                                        value={STC_Search.P_FISICAL_YEAR}
                                        onChange={(selectOption) => handleChangeFisical(selectOption)}
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

                            <div className='cRowFlex'>
                                <div className='cTilteF'>Factory&nbsp;<label style={{ color: 'red' }}>*</label></div>
                                <div className='cTools'>
                                    <StyledSelect
                                        className='react-selectMain'
                                        value={STC_Search.P_FACTORY}
                                        onChange={(selectOption) => handleChangeFac(selectOption)}
                                        options={facList}
                                        placeholder="-- Select --"
                                        classNamePrefix="react-select"
                                        isDisabled={false}
                                    />
                                </div>
                                <div className='cTilteE'>Cost Center&nbsp;<label style={{ color: 'red', display: (localStorage.getItem('REPORTBY') === 'CC' ? '' : 'none') }}>*</label></div>
                                <div className='cTools'>
                                    <StyledSelect
                                        className='react-selectMain'
                                        value={STC_Search.P_CC}
                                        onChange={(selectOption) => handleChangeCC(selectOption)}
                                        options={ccList}
                                        placeholder="-- Select --"
                                        classNamePrefix="react-select"
                                        isDisabled={false}
                                    />
                                </div>
                                <div className='cNone'></div>
                            </div>

                            <div className='cRowFlex'>
                                <div className='cTilteF'>Approve Month From&nbsp;<label style={{ color: 'red', display: (localStorage.getItem('REPORTBY') === 'DETAILOPERATOR' ? '' : 'none') }}>*</label></div>
                                <div className='cTools'>
                                    <StyledSelect
                                        className='react-selectMain'
                                        value={STC_Search.P_APP_MONTH_FRM}
                                        onChange={(selectOption) => handleChangeMonthFrm(selectOption)}
                                        options={monthList}
                                        placeholder="-- Select --"
                                        classNamePrefix="react-select"
                                        isDisabled={STC_Search.P_FISICAL_YEAR === null}
                                    />
                                </div>
                                <div className='cTilteE'>Approve Month To&nbsp;<label style={{ color: 'red', display: (localStorage.getItem('REPORTBY') === 'DETAILOPERATOR' ? '' : 'none') }}>*</label></div>
                                <div className='cTools'>
                                    <StyledSelect
                                        className='react-selectMain'
                                        value={STC_Search.P_APP_MONTH_TO}
                                        onChange={(selectOption) => handleChangeMonthTo(selectOption)}
                                        options={monthList}
                                        placeholder="-- Select --"
                                        classNamePrefix="react-select"
                                        isDisabled={STC_Search.P_FISICAL_YEAR === null}
                                    />
                                </div>
                                <div className='cNone'></div>
                            </div>

                            <div className='cRowFlex' style={{ display: (localStorage.getItem('REPORTBY') === 'DETAILLEADER' || localStorage.getItem('REPORTBY') === 'DETAILOPERATOR' ? '' : 'none') }}>
                                <div className='cTilteF'>Leader ID&nbsp;<label style={{ color: 'red', display: (localStorage.getItem('REPORTBY') === 'DETAILLEADER' ? '' : 'none') }}>*</label></div>
                                <div className='cTools'>
                                    <StyledTextBox className='dText'
                                        type="text"
                                        placeholder=""
                                        name='P_LEADER_ID'
                                        value={STC_Search.P_LEADER_ID}
                                        onChange={handleInputChangeText}
                                    />
                                </div>
                                <div className='cTilteE'>Leader Name</div>
                                <div className='cTools'>
                                    <StyledTextBox className='dText'
                                        type="text"
                                        placeholder=""
                                        name='P_LEADER_NAME'
                                        value={STC_Search.P_LEADER_NAME}
                                        onChange={handleInputChangeText}
                                    />
                                </div>
                                <div className='cNone'></div>
                            </div>

                            <div className='cRowFlex' style={{ display: (localStorage.getItem('REPORTBY') === 'DETAILOPERATOR' ? '' : 'none') }}>
                                <div className='cTilteF'>Operator ID </div>
                                <div className='cTools'>
                                    <StyledTextBox className='dText'
                                        type="text"
                                        placeholder=""
                                        name='P_OPR_ID'
                                        value={STC_Search.P_OPR_ID}
                                        onChange={handleInputChangeText}
                                    />
                                </div>
                                <div className='cTilteE'>Operator By Name</div>
                                <div className='cTools'>
                                    <StyledTextBox className='dText'
                                        type="text"
                                        placeholder=""
                                        name='P_OPR_NAME'
                                        value={STC_Search.P_OPR_NAME}
                                        onChange={handleInputChangeText}
                                    />
                                </div>
                                <div className='cNone'></div>
                            </div>
                            <div style={{ width: '100%', display: 'flex' }}>
                                <div className='cRowFlex' style={{ justifyContent: 'center', padding: '1rem' }}>
                                    <div className='btnSearchRPT' onClick={() => OnSearch()}>
                                        <FontAwesomeIcon icon={faSearch} style={{ marginRight: '5px' }} /> Search
                                    </div>
                                    <div className='btnResetRPT' onClick={() => OnReset()}>
                                        <FontAwesomeIcon icon={faRefresh} style={{ marginRight: '5px' }} /> Reset
                                    </div>
                                    <div className='btnExportRPT' onClick={() => OnExport()} style={{ display: (DetailList.length > 0 && localStorage.getItem('REPORTBY') !== 'SUMALL' ? '' : 'none') }}>
                                        <FontAwesomeIcon icon={faDownload} style={{ marginRight: '5px' }} /> Export
                                    </div>
                                </div>
                            </div>
                        </div>
                        {DetailList.length > 0 ? (
                            <div>
                                <div style={{ display: (localStorage.getItem('REPORTBY') !== 'SUMALL' ? '' : 'none') }}>
                                    <div className='cPaneCenter' style={{ marginTop: '0.5rem' }}>
                                        {loadTable ? (
                                            <div>
                                                <PageLoad></PageLoad>
                                            </div>
                                        ) : (
                                            <div className="grid-containerRPT">
                                                <div className='cPaneCenter'>
                                                    <table ref={tableRef} id="tableExport" className="grid-tableRPT" style={{ display: 'none' }}>
                                                        <thead>
                                                            <tr>
                                                                {HeaderList.map((rowH) => (
                                                                    <th align={rowH.position} style={{ width: rowH.width }}>{rowH.name}</th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {DetailList.map((row) => (
                                                                <tr>
                                                                    {HeaderList.map((rowH) => (
                                                                        <React.Fragment key={rowH.field}>
                                                                            <td align={rowH.position}>{row[rowH.field]}</td>
                                                                        </React.Fragment>
                                                                    ))}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>

                                                    <table className="grid-tableRPT">
                                                        <thead>
                                                            <tr>
                                                                {HeaderList.map((rowH) => (
                                                                    <th align={rowH.position} style={{ width: rowH.width }}>{rowH.name}</th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {currentRecords.map((row) => (
                                                                <tr>
                                                                    {HeaderList.map((rowH) => (
                                                                        <React.Fragment key={rowH.field}>
                                                                            <td align={(rowH.field === 'P_MH' || rowH.field === 'P_MC' ? 'right' : rowH.position)}>{row[rowH.field]}</td>
                                                                        </React.Fragment>
                                                                    ))}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className='dPerpage'>
                                        <div className="paginationMain">
                                            <div className='paginationLeft'>{(totalPages === currentPage ? (DetailList.length - currentRecords.length + 1) : (currentRecords.length * currentPage) - (currentRecords.length - 1))} to {(totalPages === currentPage ? DetailList.length : DetailList.length - (DetailList.length - (currentRecords.length * currentPage)))} of {DetailList.length} items</div>
                                            <div className='paginationRight'>
                                                <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className='btnPage'><FontAwesomeIcon icon={faChevronLeft} /></button>
                                                {Array.from({ length: totalPages }, (_, index) => (
                                                    <React.Fragment key={index + 1}>

                                                        {(
                                                            <button
                                                                className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}
                                                                onClick={() => handlePageChange(index + 1)}
                                                            >
                                                                {index + 1}
                                                            </button>
                                                        )}
                                                    </React.Fragment>
                                                ))}
                                                <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} className='btnPage'><FontAwesomeIcon icon={faChevronRight} /></button>
                                            </div>


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
                                <div style={{ marginTop: '0.5rem', display: (localStorage.getItem('REPORTBY') !== 'SUMALL' ? 'none' : '') }}>
                                    <div>
                                        <div className="grid-containerRPT">
                                            <div style={{ display: 'inline-flex' }}>
                                                <div style={{ display: 'block' }}>
                                                    <div className='titleHeadTable' style={{ backgroundColor: '#D08700', border: '1px #D08700 solid' }}>
                                                        {STC_Search.P_CC === null ? `Summary Report By Factory (${STC_Search.P_FACTORY.label})` : `Summary Report By Cost Center (${STC_Search.P_CC.value})`}
                                                    </div>
                                                    <table className="grid-tableRPT2">
                                                        <thead>
                                                            <tr>
                                                                {HeaderList.map((rowH) => (
                                                                    <th align={rowH.position} style={{ width: rowH.width }}>{rowH.name}</th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {DetailList.map((row) => (
                                                                <tr>
                                                                    {HeaderList.map((rowH) => (
                                                                        <React.Fragment key={rowH.field}>
                                                                            <td align={(rowH.field === 'P_MH' || rowH.field === 'P_MC' ? 'right' : rowH.position)}>
                                                                                {rowH.field === 'P_OF_LEADER' || rowH.field === 'P_WAIT_APP' || rowH.field === 'P_APP' || rowH.field === 'P_IMPLEMENT' ? <div className='textLink'
                                                                                    onClick={() => OnFilterLeader(row['P_MONTH_SORT'], row['P_FACTORY'], row['P_CC'] || '', row['P_MONTH'], (rowH.field === 'P_WAIT_APP' ? 'WT' : rowH.field === 'P_APP' ? 'FN' : rowH.field === 'P_IMPLEMENT' ? 'IM' : ''))}>
                                                                                    {row[rowH.field]}</div> : row[rowH.field]}
                                                                            </td>
                                                                        </React.Fragment>
                                                                    ))}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>

                                        {DTSumLDList.length > 0 ? (
                                            <div className="grid-containerRPT">
                                                <div style={{ display: 'inline-flex' }}>
                                                    <div style={{ display: 'block' }}>
                                                        <div className='titleHeadTable' style={{ backgroundColor: '#12558E', border: '1px #12558E solid' }}>
                                                            Summary Report By Leader ({Hmonth})
                                                        </div>
                                                        <table className="grid-tableRPT2">
                                                            <thead>
                                                                <tr>
                                                                    {SumLDList.map((rowH) => (
                                                                        <th align={rowH.position} style={{ width: rowH.width }}>{rowH.name}</th>
                                                                    ))}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {DTSumLDList.map((row) => (
                                                                    <tr>
                                                                        {SumLDList.map((rowH) => (
                                                                            <React.Fragment key={rowH.field}>
                                                                                <td align={(rowH.field === 'P_MH' || rowH.field === 'P_MC' ? 'right' : rowH.position)}>
                                                                                    {rowH.field === 'P_WAIT_APP' || rowH.field === 'P_APP' || rowH.field === 'P_IMPLEMENT' ? <div className='textLink'
                                                                                        onClick={() => OnFilterDetailLeader(row['P_MONTH_SORT'], row['P_LEADER_ID'], row['P_LEADER_NAME'])}>
                                                                                        {row[rowH.field]}</div> : row[rowH.field]}
                                                                                </td>
                                                                            </React.Fragment>
                                                                        ))}
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>) : (null)}


                                        {LDList.length > 0 ? (
                                            <div className="grid-containerRPT">
                                                <div style={{ display: 'inline-flex' }}>
                                                    <div style={{ display: 'block' }}>
                                                        <div className='titleHeadTable' style={{ backgroundColor: '#065940', border: '1px #065940 solid' }}>
                                                            Detail Report Of Leader ({HLeader})
                                                        </div>
                                                        <table className="grid-tableRPT2">
                                                            <thead>
                                                                <tr>
                                                                    {DetailLDList.map((rowH) => (
                                                                        <th align={rowH.position} style={{ width: rowH.width }}>{rowH.name}</th>
                                                                    ))}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {LDList.map((row) => (
                                                                    <tr>
                                                                        {DetailLDList.map((rowH) => (
                                                                            <React.Fragment key={rowH.field}>
                                                                                <td align={(rowH.field === 'P_MH' || rowH.field === 'P_MC' ? 'right' : rowH.position)}>
                                                                                    {rowH.field === 'P_WAIT_APP' || rowH.field === 'P_APP' || rowH.field === 'P_IMPLEMENT' ? <div className='textLink'
                                                                                        onClick={() => OnFilterDetailOperator(row['P_MONTH_SORT'], row['P_LEADER_ID'], row['P_OPERATOR_ID'], (rowH.field === 'P_WAIT_APP' ? 'WT' : rowH.field === 'P_APP' ? 'FN' : 'IM'))}>
                                                                                        {row[rowH.field]}</div> : row[rowH.field]}
                                                                                </td>
                                                                            </React.Fragment>
                                                                        ))}
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>) : (null)}


                                        {OPList.length > 0 ? (
                                            <div className="grid-containerRPT">
                                                <div style={{ display: 'inline-flex' }}>
                                                    <div style={{ display: 'block' }}>
                                                        <div className='titleHeadTable' style={{ backgroundColor: '#A1ADA9', border: '1px #A1ADA9 solid' }}>
                                                            {Hop}
                                                        </div>
                                                        <table className="grid-tableRPT2">
                                                            <thead>
                                                                <tr>
                                                                    {DetailOPList.map((rowH) => (
                                                                        <th align={rowH.position} style={{ width: rowH.width }}>{rowH.name}</th>
                                                                    ))}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {OPList.map((row) => (
                                                                    <tr>
                                                                        {DetailOPList.map((rowH) => (
                                                                            <React.Fragment key={rowH.field}>
                                                                                <td align={(rowH.field === 'P_MH' || rowH.field === 'P_MC' ? 'right' : rowH.position)}>
                                                                                    {row[rowH.field]}
                                                                                </td>
                                                                            </React.Fragment>
                                                                        ))}
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>) : (null)}

                                    </div>
                                </div>
                            </div>) : (<div className='cPaneCenter' style={{ display: 'flex', textAlign: 'center' }}><h2>No data found</h2></div>)
                        }

                    </div>
                    <div className='AearLeftRightTM'></div>
                </div>
            </div>)
            }
        </div>
    )
}

export default ReportGroup