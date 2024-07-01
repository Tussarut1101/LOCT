import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../Page/Menu';
import PageLoad from '../../Page/PageLoad';
import './PrintOut.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint, faMinus, faPlus, faPlusCircle, faPlusSquare, faCheck, faSearch, faRefresh, faDownload, faChevronDown, faChevronUp, faTimes, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import IconButton from "@mui/material/IconButton";
import { FaSignOutAlt } from 'react-icons/fa';
import { RadioWrapper, HiddenRadio, StyledRadio, RadioLabel, StyledSelect, StyledTextBox, RadioButton } from '../../StyledToos/StyledCommon';
import { GetFactory, GetCostCenter, GetYearMonth, PrintOut_Fn } from './PrintOut_Fn';
import Select from 'react-select';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

function PrintOut() {
    const location = useLocation();
    const { FactoryList, facList, } = GetFactory();
    const { CostCenterList, ccList } = GetCostCenter();
    const { yearList, monthList } = GetYearMonth();
    const { loading,
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
        OnPrint } = PrintOut_Fn();

    useEffect(() => {
        setloading(true);
        const params = new URLSearchParams(location.search);
        FactoryList();
        setloading(false);
    }, [location]);

    useEffect(() => {
        if (STC_FORM.LTD_FACTORY !== null) {
            CostCenterList(STC_FORM.LTD_FACTORY.value)
        }
    }, [STC_FORM.LTD_FACTORY]);

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
                        <div className='cHeaderPrtout'>
                            Print out report
                        </div>
                        <div className='cPanelPrtout'>
                            <div className='cRowPrtout'>
                                <div className='titlePrt'><label style={{ color: 'red' }}>*</label>&nbsp;Leader Id</div>
                                <div className='toolsPrt'>
                                    <StyledTextBox
                                        className='dTextPrtout'
                                        type="text"
                                        placeholder=""
                                        name='LTD_LD_EMP_ID'
                                        value={STC_FORM.LTD_LD_EMP_ID}
                                        onChange={handleInputChangeText}
                                        disabled={isVisible}
                                    />
                                </div>
                            </div>

                            <div className='cRowPrtout'>
                                <div className='titlePrt'></div>
                                <div className='toolsPrt' style={{ padding: '0 0.5rem' }}>
                                    <div className='btnSearchRPT' style={{marginLeft: '0rem'}} onClick={() => OnSearch()}>
                                        <FontAwesomeIcon icon={faSearch} style={{ marginRight: '5px' }} /> Search
                                    </div>
                                    <div className='btnResetRPT' onClick={() => OnRest()}>
                                        <FontAwesomeIcon icon={faRefresh} style={{ marginRight: '5px' }} /> Reset
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: (isVisible ? '' : 'none') }}>

                                <div className='cRowPrtout'>
                                    <div className='titlePrt'><label style={{ color: 'red' }}>*</label>&nbsp;Factory (โรงงาน)</div>
                                    <div className='toolsPrt'>
                                        <StyledSelect
                                            className='react-selectPrt'
                                            value={STC_FORM.LTD_FACTORY}
                                            onChange={(selectOption) => handleChangeFac(selectOption)}
                                            options={facList}
                                            placeholder="-- Select --"
                                            classNamePrefix="react-select"
                                            isDisabled={isMode}
                                        />
                                    </div>
                                </div>

                                <div className='cRowPrtout'>
                                    <div className='titlePrt'>Cost Center</div>
                                    <div className='toolsPrt'>
                                        <StyledSelect
                                            className='react-selectPrt'
                                            value={STC_FORM.LTD_CC}
                                            onChange={(selectOption) => handleChangeCC(selectOption)}
                                            options={ccList}
                                            placeholder="-- Select --"
                                            classNamePrefix="react-select"
                                            isDisabled={isMode}
                                        />
                                    </div>
                                </div>

                                <div className='cRowPrtout'>
                                    <div className='titlePrt'><label style={{ color: 'red' }}>*</label>&nbsp;Fiscal Year (ปีงบประมาณ)</div>
                                    <div className='toolsPrt'>
                                        <StyledSelect
                                            className='react-selectPrt'
                                            value={STC_FORM.LTD_YEAR}
                                            onChange={(selectOption) => handleChangeFisical(selectOption)}
                                            options={yearList}
                                            placeholder="-- Select --"
                                            classNamePrefix="react-select"
                                            isDisabled={false}
                                        />
                                    </div>
                                </div>

                                <div className='cRowPrtout'>
                                    <div className='titlePrt'>
                                        <div><label style={{ color: 'red' }}>*</label>&nbsp;Month</div>
                                        <div>(เดือนที่ต้องการดูผลการทำกิจกรรม)</div>
                                    </div>
                                    <div className='toolsPrt'>
                                        <StyledSelect
                                            className='react-selectPrt'
                                            value={STC_FORM.LTD_MONTH}
                                            onChange={(selectOption) => handleChangeMonth(selectOption)}
                                            options={monthList}
                                            placeholder="-- Select --"
                                            classNamePrefix="react-select"
                                            isDisabled={false}
                                        />
                                    </div>
                                </div>

                                <div className='cRowPrtout'>
                                    <div className='titlePrt'>
                                        <div><label style={{ color: 'red' }}>*</label>&nbsp;Total Operator</div>
                                        <div>(จำนวนพนักงานใต้บังคับบัญชา)</div>
                                    </div>
                                    <div className='toolsPrt'>
                                        <StyledTextBox
                                            className='dPsnPrtout'
                                            type="text"
                                            placeholder=""
                                            name='LTD_MEMBER_AMOUNT'
                                            value={STC_FORM.LTD_MEMBER_AMOUNT}
                                            onChange={handleInputChangeText}
                                            disabled={isMode}
                                        />
                                    </div>
                                </div>

                                <div className='cRowPrtout'>
                                    <div className='titlePrt'>
                                        <div><label style={{ color: 'red' }}>*</label>&nbsp;Accept/Acknowledge By</div>
                                        <div>(รหัสหัวหน้างานที่ทำการรับรองผลการทำกิจกรรม)</div>
                                    </div>
                                    <div className='toolsPrt'>
                                        <StyledTextBox
                                            className='dTextPrtout'
                                            type="text"
                                            placeholder=""
                                            name='LTD_MGR_EMP_ID'
                                            value={STC_FORM.LTD_MGR_EMP_ID}
                                            onChange={handleInputChangeText}
                                            disabled={isMode}
                                        />
                                    </div>
                                </div>

                                <div className='cRowPrtout'>
                                    <div className='titlePrt'></div>
                                    <div className='toolsPrt'>
                                        <div style={{ padding: '0.5rem', backgroundColor: '#acd7cc', display: (STC_FORM.LTD_MGR_EMP_NAME.trim() === '' ? 'none':'inline-flex'), borderRadius: '4px' }}>
                                            {STC_FORM.LTD_MGR_EMP_NAME}
                                        </div>
                                    </div>
                                </div>

                                <div className='cRowPrtout'>
                                    <div className='titlePrt'></div>
                                    <div className='toolsPrt' style={{ padding: '0 0.5rem' }}>
                                        <div className='btnPrint' onClick={() => OnPrint()}>
                                            <FontAwesomeIcon icon={faPrint} style={{ marginRight: '5px' }} /> Print
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                    <div className='AearLeftRightTM'></div>
                </div>
            </div>)}
        </div>
    )
}

export default PrintOut