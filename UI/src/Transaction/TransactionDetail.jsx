import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../Page/Menu';
import PageLoad from '../Page/PageLoad';
import './TransactionDetail.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faMinus, faPlus, faPlusCircle, faPlusSquare, faCheck, faSearch,faArrowLeft, faRefresh, faTimesCircle, faTimes, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import IconButton from "@mui/material/IconButton";
import { FaSignOutAlt } from 'react-icons/fa';
import { RadioWrapper, HiddenRadio, StyledRadio, RadioLabel, RadioButton, StyledSelect, StyledTextBox, TextArea } from '../StyledToos/StyledCommon';
import { GetFactory, GetCostCenter, GetTypeSGT, TransactionDetail_Fn } from './TransactionDetail_Fn';
import Select from 'react-select';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { useDropzone } from 'react-dropzone';

function TransactionDetail() {
    const location = useLocation();
    const { FactoryList, facList, } = GetFactory();
    const { CostCenterList, ccList } = GetCostCenter();
    const { TypeSGTList, sgtList } = GetTypeSGT();
    const { loading,
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
        GetData } = TransactionDetail_Fn();

    useEffect(() => {
        setloading(true);
        FactoryList();
        CostCenterList('');
        TypeSGTList();
        setloading(false);
        GetData(localStorage.getItem('LOCT_IECT_NO'))
    }, [location]);

    const handleBack = () => {
        if (localStorage.getItem('TYPE_ACTION') === 'VIEW'){
            window.location.href = `/LOCTSystem/Transaction?P_TYPE=MASTERLIST&P_REQTYPE=ALL`;
        }else{
            window.location.href = `/LOCTSystem/Transaction?P_TYPE=ISSUE&P_REQTYPE=${STC_FORM.ISS_TYPE}`;
        }
    }
    return (
        <div>
            <Header></Header>
            {loading ? (
                <div>
                    <PageLoad></PageLoad>
                </div>
            ) : (
                <div>
                    <div className='AearF'>
                        <div className='AearLeftRightF'></div>
                        <div className='AearCenterF'>
                            <div className='HeadLinkBack'><div style={{cursor: 'pointer', color: (localStorage.getItem('TYPEDOC') === 'LOCT' ? '#DEAB62' : '#B7D3CB')}} onClick={handleBack}>{localStorage.getItem('TYPE_ACTION') === 'VIEW' ? '' : 'Issue'} {STC_FORM.ISS_TYPE}</div>&nbsp;{'>'}&nbsp;
                                {localStorage.getItem('TYPEDOC') === 'LOCT' ? (<div>
                                    {localStorage.getItem('TYPE_ACTION') === 'ADD' ? 'New' : 
                                    localStorage.getItem('TYPE_ACTION') === 'EDIT' ? 'Edit' : ''} Issue LOCT & SGT
                                </div>) : (<div>
                                    {localStorage.getItem('TYPE_ACTION') === 'ADD' ? 'New' : 
                                    localStorage.getItem('TYPE_ACTION') === 'EDIT' ? 'Edit' : ''} Issue IECT & SGT
                                </div>)}
                            </div>
                            {localStorage.getItem('TYPEDOC') === 'LOCT' ? (<div className='cHeadLoct'>
                                Issue LOCT & SGT
                            </div>) : (<div className='cHeadIect'>
                                Issue IECT & SGT
                            </div>)}

                            <div className='cPanelForm'>
                                <div className='cRowFlexForm'>
                                    <div className='cTilteFF'>
                                    </div>
                                    <div className='cToolsF'>
                                    </div>
                                    <div className='cTilteEF'>
                                    </div>
                                    <div className='cToolsF2'>
                                        Status : &nbsp;
                                        <div style={{ backgroundColor: '#DEAB62', padding: '1% 1% 1% 1%', borderRadius: '20px', display: 'inline-flex' }}>{STC_FORM.LRH_REQ_STATUS_DESC}</div>
                                    </div>
                                    <div className='cNoneF'></div>
                                </div>

                                <div className='cRowFlexForm'>
                                    <div className='cTilteFF'>
                                        <div className='cTilteSubF'>
                                            <div>Register No</div>
                                            <div>(หมายเลขเอกสาร)</div>

                                        </div>
                                    </div>
                                    <div className='cToolsF'>
                                        <StyledTextBox
                                            disabled={true}
                                            className='dTextF'
                                            type="text"
                                            placeholder=""
                                            name='LRH_REQ_NO'
                                            value={STC_FORM.LRH_REQ_NO}
                                            onChange={handleInputChangeText}
                                        />
                                    </div>
                                    <div className='cTilteEF'>
                                        <div className='cTilteSubF'>
                                            <div>Register Date</div>
                                            <div>(บันทึกเอกสารวันที่)</div>

                                        </div></div>
                                    <div className='cToolsF'>
                                        <StyledTextBox
                                            disabled={true}
                                            className='dTextF'
                                            type="text"
                                            placeholder=""
                                            name='LRH_REQ_DATE'
                                            value={STC_FORM.LRH_REQ_DATE}
                                            onChange={handleInputChangeText}
                                        />
                                    </div>
                                    <div className='cNoneF'></div>
                                </div>


                                <div className='cRowFlexForm'>
                                    <div className='d10Per'></div><div className='d80Per'></div><div className='d10Per'></div>
                                </div>
                                <div className='cRowFlexForm'>
                                    <div className='cTilteFF'>
                                        <div className='cTilteSubF'>
                                            <div><label style={{ color: 'red' }}>*</label>&nbsp;Employee ID.</div>
                                            <div>(รหัสพนักงาน)</div>

                                        </div>
                                    </div>
                                    <div className='cToolsF'>
                                        <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
                                        <StyledTextBox
                                            disabled={localStorage.getItem('TYPE_ACTION') === 'VIEW'}
                                            className='dTextEmpF'
                                            type="text"
                                            placeholder=""
                                            name='LRH_REQ_BY'
                                            value={STC_FORM.LRH_REQ_BY}
                                            onChange={handleInputChangeText}
                                        />
                                        <FontAwesomeIcon icon={faTimesCircle} style={{ display : (localStorage.getItem('TYPE_ACTION') === 'VIEW' ? 'none': ''), color: 'red', fontSize: '28px', cursor: 'pointer', marginLeft: '0.2rem' }} onClick={OnClearRequester} /></div>
                                    </div>
                                    <div className='cTilteEF'>
                                    </div>
                                    <div className='cToolsF'>

                                    </div>
                                    <div className='cNoneF'></div>
                                </div>

                                <div className='cRowFlexForm'>
                                    <div className='cTilteFF'>
                                        <div className='cTilteSubF'>
                                            <div>Name-Surname</div>
                                            <div>(ชื่อ-นามสกุล พนักงาน)</div>

                                        </div>
                                    </div>
                                    <div className='cToolsF'>
                                        <StyledTextBox
                                            disabled={true}
                                            className='dTextF'
                                            type="text"
                                            placeholder=""
                                            name='LRH_REQ_NAME_FULL'
                                            value={STC_FORM.LRH_REQ_NAME_FULL}
                                            onChange={handleInputChangeText}
                                        />
                                    </div>
                                    <div className='cTilteEF'>
                                        <div className='cTilteSubF'>
                                            <div>Position</div>
                                            <div>(ตำแหน่งงาน)</div>

                                        </div></div>
                                    <div className='cToolsF'>
                                        <StyledTextBox
                                            disabled={true}
                                            className='dTextF'
                                            type="text"
                                            placeholder=""
                                            name='LRH_REQ_POSITION'
                                            value={STC_FORM.LRH_REQ_POSITION}
                                            onChange={handleInputChangeText}
                                        />
                                    </div>
                                    <div className='cNoneF'></div>
                                </div>
                                <div className='cRowFlexForm'>
                                    <div className='cTilteFF'>
                                        <div className='cTilteSubF'>
                                            <div>Employee Type</div>
                                            <div>(ประเภทการทำงาน)</div>

                                        </div>
                                    </div>
                                    <div className='cToolsF'>
                                        <StyledTextBox
                                            disabled={true}
                                            className='dTextF'
                                            type="text"
                                            maxLength={7}
                                            placeholder=""
                                            name='LRH_REQ_EMP_TYPE'
                                            value={STC_FORM.LRH_REQ_EMP_TYPE}
                                            onChange={handleInputChangeText}
                                        />
                                    </div>
                                    <div className='cTilteEF'>
                                        <div className='cTilteSubF'>
                                            <div>Factory</div>
                                            <div>(โรงงาน)</div>

                                        </div></div>
                                    <div className='cToolsF'>
                                        <StyledTextBox
                                            disabled={true}
                                            className='dTextF'
                                            type="text"
                                            placeholder=""
                                            name='LRH_FACTORY'
                                            value={STC_FORM.LRH_FACTORY}
                                            onChange={handleInputChangeText}
                                        />
                                    </div>
                                    <div className='cNoneF'></div>
                                </div>
                                <div className='cRowFlexForm'>
                                    <div className='cTilteFF'>
                                        Cost Center
                                    </div>
                                    <div className='cToolsF'>
                                        <StyledTextBox
                                            disabled={true}
                                            className='dTextF'
                                            type="text"
                                            placeholder=""
                                            name='LRH_COST_CENTER'
                                            value={STC_FORM.LRH_COST_CENTER}
                                            onChange={handleInputChangeText}
                                        />
                                    </div>
                                    <div className='cTilteEF'>
                                        Process</div>
                                    <div className='cToolsF'>
                                        <StyledTextBox
                                            disabled={true}
                                            className='dTextF'
                                            type="text"
                                            placeholder=""
                                            name='LRH_REQ_PROCESS'
                                            value={STC_FORM.LRH_REQ_PROCESS}
                                            onChange={handleInputChangeText}
                                        />
                                    </div>
                                    <div className='cNoneF'></div>
                                </div>
                                <div className='cRowFlexForm'>
                                    <div className='cTilteFF'>
                                        <div className='cTilteSubF'>
                                            <div>Manager</div>
                                            <div>(หัวหน้างาน)</div>
                                        </div>
                                    </div>
                                    <div className='cToolsF'>
                                        <StyledTextBox
                                            disabled={true}
                                            className='dTextF'
                                            type="text"
                                            placeholder=""
                                            name='LRH_REQ_MANAGER_NANE'
                                            value={STC_FORM.LRH_REQ_MANAGER_NANE}
                                            onChange={handleInputChangeText}
                                        />
                                    </div>
                                    <div className='cTilteEF'>
                                    </div>
                                    <div className='cToolsF'>
                                    </div>
                                    <div className='cNoneF'></div>
                                </div>

                                <div className='cRowFlexForm'>
                                    <div className='d10Per'></div><div className='d80Per'></div><div className='d10Per'></div>
                                </div>

                                <div className='cRowFlexForm'>
                                    <div className='cTilteFF'>
                                        <div className='cTilteSubF'>
                                            <div><label style={{ color: 'red' }}>*</label>&nbsp;Type of Suggestion</div>
                                            <div>(ประเภทของข้อเสนอแนะ)</div>
                                        </div>
                                    </div>
                                    <div className='cToolsF'>
                                        <StyledSelect
                                            className='react-select'
                                            value={STC_FORM.LRH_SG_TYPE}
                                            onChange={handleChangeSGType}
                                            options={sgtList}
                                            placeholder="-- Select --"
                                            classNamePrefix="react-select"
                                            isDisabled={localStorage.getItem('TYPE_ACTION') === 'VIEW'}
                                        />
                                    </div>
                                    <div className='cTilteEF'>
                                    </div>
                                    <div className='cToolsF'>
                                    </div>
                                    <div className='cNoneF'></div>
                                </div>

                                <div className='cRowFlexForm'>
                                    <div className='cTilteFF'>
                                        <label style={{ color: 'red' }}>*</label>&nbsp;Subject &nbsp;(เรื่อง)
                                    </div>
                                    <div className='cToolsF3'>
                                        <StyledTextBox
                                            disabled={localStorage.getItem('TYPE_ACTION') === 'VIEW'}
                                            className='dTextSupject'
                                            type="text"
                                            placeholder=""
                                            name='LRH_PROBLEM'
                                            value={STC_FORM.LRH_PROBLEM}
                                            onChange={handleInputChangeText}
                                        />
                                    </div>
                                    <div className='cNoneF'></div>
                                </div>

                                <div className='cRowFlexForm'>
                                    <div className='cTilteFF2'>
                                        <div className='cTilteSubF'>
                                            <div><label style={{ color: 'red' }}>*</label>&nbsp;Before Improvement</div>
                                            <div>(ก่อนการปรับปรุง)</div>
                                        </div>
                                    </div>
                                    <div className='cToolsF3'>
                                        <TextArea
                                            disabled={localStorage.getItem('TYPE_ACTION') === 'VIEW'}
                                            className='dTextAear'
                                            type="text"
                                            placeholder=""
                                            name='LRH_DET_BEFORE'
                                            value={STC_FORM.LRH_DET_BEFORE}
                                            onChange={handleInputChangeText}
                                        />
                                    </div>
                                    <div className='cNoneF'></div>
                                </div>

                                <div className='cRowFlexForm'>
                                    <div className='cTilteFF2'>
                                        <div className='cTilteSubF'>
                                            <div><label style={{ color: 'red' }}>*</label>&nbsp;After Improvement</div>
                                            <div>(หลังการปรับปรุง)</div>
                                        </div>
                                    </div>
                                    <div className='cToolsF3'>
                                        <TextArea
                                            disabled={localStorage.getItem('TYPE_ACTION') === 'VIEW'}
                                            className='dTextAear'
                                            type="text"
                                            placeholder=""
                                            name='LRH_DET_AFTER'
                                            value={STC_FORM.LRH_DET_AFTER}
                                            onChange={handleInputChangeText}
                                        />
                                    </div>
                                    <div className='cNoneF'></div>
                                </div>

                                <div className='cRowFlexForm'>
                                    <div className='cTilteFF'>
                                        Mhr Saving (MH)
                                    </div>
                                    <div className='cToolsF'>
                                        <StyledTextBox
                                            disabled={localStorage.getItem('TYPE_ACTION') === 'VIEW'}
                                            className='dTextNumber'
                                            type="text"
                                            placeholder=""
                                            name='LRH_MH_TSAVE'
                                            value={STC_FORM.LRH_MH_TSAVE}
                                            onChange={handleInputChangeText}
                                        />
                                    </div>
                                    <div className='cTilteEF'>
                                        Cost Saving</div>
                                    <div className='cToolsF'>
                                        <StyledTextBox
                                            disabled={localStorage.getItem('TYPE_ACTION') === 'VIEW'}
                                            className='dTextNumber'
                                            type="text"
                                            placeholder=""
                                            name='LRH_MC_TSAVE'
                                            value={STC_FORM.LRH_MC_TSAVE}
                                            onChange={handleInputChangeText}
                                        />
                                    </div>
                                    <div className='cNoneF'></div>
                                </div>



                                <div className='cRowFlexForm'>
                                    <div className='cTilteFF2'>
                                        <label style={{ color: 'red' }}>*</label>&nbsp;Request Suggestion
                                    </div>
                                    <div className='cToolsF3'>
                                        <div style={{ display: 'block' }}>
                                            <RadioButton
                                                id="N"
                                                name="options"
                                                value="N"
                                                checked={STC_FORM.LRH_SUMIT_TO_SG === 'N'}
                                                onChange={handleChangeRaditoReqSGT}
                                                disabled={STC_FORM.LRH_SUMIT_TO_SG_BL}
                                                label={localStorage.getItem('TYPEDOC') === 'LOCT' ? 'LOCT Only (เฉพาะ LOCT เท่านั้น)' : 'IECT Only (เฉพาะ IECT เท่านั้น)'} //"LOCT Only (เฉพาะ LOCT เท่านั้น)"
                                            />
                                            <div style={{ display: (STC_FORM.LRH_FACTORY_CODE === '1000' ? 'none' : '') }}>
                                                <RadioButton
                                                    id="Y"
                                                    name="options"
                                                    value="Y"
                                                    checked={STC_FORM.LRH_SUMIT_TO_SG === 'Y'}
                                                    onChange={handleChangeRaditoReqSGT}
                                                    disabled={STC_FORM.LRH_SUMIT_TO_SG_BL}
                                                    label={localStorage.getItem('TYPEDOC') === 'LOCT' ? 'Suggestion & LOCT (Suggestion และ LOCT)' : 'Suggestion & IECT (Suggestion และ IECT)'}//""
                                                />
                                            </div>
                                            <RadioButton
                                                id="5"
                                                name="options"
                                                value="5"
                                                checked={STC_FORM.LRH_SUMIT_TO_SG === '5'}
                                                onChange={handleChangeRaditoReqSGT}
                                                disabled={STC_FORM.LRH_SUMIT_TO_SG_BL}
                                                label="Suggestion Only (เฉพาะ Suggestion เท่านั้น)"
                                            />
                                        </div>

                                    </div>
                                    <div className='cNoneF'></div>
                                </div>
                                <div style={{ display: (STC_FORM.LRH_SUMIT_TO_SG.trim() === '' ? 'none' : '') }}>
                                    {STC_FORM.LRH_FILE_URL !== null ? (<div className='cRowFlexForm'>
                                        <div className='cTilteFF2'>
                                        </div>
                                        <div className='cToolsF3'>
                                            <div className="file-link">
                                                <a href={STC_FORM.LRH_FILE_URL} target="_blank" rel="noopener noreferrer">
                                                    {STC_FORM.LRH_FILENAME}
                                                </a>
                                                <FontAwesomeIcon icon={faTimes} style={{ color: 'red', fontSize: '20px', cursor: 'pointer', marginLeft: '0.5rem', display: (localStorage.getItem('TYPE_ACTION') === 'VIEW' ? 'none' : '') }} onClick={handleClickClear} />
                                            </div>
                                        </div>
                                        <div className='cNoneF'></div>
                                    </div>) : (null)}

                                    <div className='cRowFlexForm' style={{display: (localStorage.getItem('TYPE_ACTION') === 'VIEW' ? 'none' : '')}}>
                                        <div className='cTilteFF2'>
                                            Attach &nbsp;(แนบไฟล์)
                                        </div>
                                        <div className='cToolsF3'>
                                            <div
                                                className={`dropzone ${isDragging ? 'dragging' : ''}`}
                                                onDragEnter={handleDragEnter}
                                                onDragLeave={handleDragLeave}
                                                onDragOver={handleDragOver}
                                                onDrop={handleDrop}
                                                onClick={handleClick}
                                            >
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleFileChange}
                                                    className="file-input"
                                                />
                                                {STC_FORM.LRH_FILE_BL ? (
                                                    <p>{STC_FORM.LRH_FILENAME}</p>
                                                ) : (
                                                    <p>Drag 'n' drop a file here, or click to select one</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className='cNoneF'></div>
                                    </div>
                                </div>
                                <div className='cRowFlexForm' style={{ display: ((STC_FORM.LRH_SUMIT_TO_SG === 'Y' || STC_FORM.LRH_SUMIT_TO_SG === '5') ? '' : 'none') }}>
                                    <div className='cTilteFF'>
                                    </div>
                                    <div className='cToolsF3'>
                                        <div className='panelLeader' style={{ backgroundColor: (localStorage.getItem('TYPEDOC') === 'LOCT' ? '#F8E3C6' : '#D4FAEF') }}>
                                            <div style={{ fontWeight: 'bold' }}>For Suggestion (สำหรับ Suggestion)</div>
                                            <div className='panelSubLeader'>
                                                <div className='sLeaderFirst2'>
                                                    Type
                                                </div>
                                                <div className='sLeaderEnd2'>
                                                    <RadioButton
                                                        id="RTY001"
                                                        name="teams"
                                                        value="RTY001"
                                                        checked={STC_FORM.SSH_REQ_TYPE === 'RTY001'}
                                                        onChange={handleChangeRaditoTeams}
                                                        disabled={true}
                                                        label="Team (ทีม)"
                                                    />
                                                    <RadioButton
                                                        id="RTY002"
                                                        name="teams"
                                                        value="RTY002"
                                                        checked={STC_FORM.SSH_REQ_TYPE === 'RTY002'}
                                                        onChange={handleChangeRaditoTeams}
                                                        disabled={true}
                                                        label="Individual (บุคคล)"
                                                    />
                                                </div>
                                            </div>

                                            <div className='panelSubLeader' style={{ display: (STC_FORM.SSH_REQ_TYPE === 'RTY002' ? 'none' : '') }}>
                                                <div className='sLeaderFirst2'>
                                                    Team
                                                </div>
                                                <div className='sLeaderEnd2'>
                                                    <StyledTextBox
                                                        disabled={localStorage.getItem('TYPE_ACTION') === 'VIEW'}
                                                        className='dTextLeader'
                                                        type="text"
                                                        placeholder=""
                                                        name='SSH_TEAM_NAME'
                                                        value={STC_FORM.SSH_TEAM_NAME}
                                                        onChange={handleInputChangeText}
                                                    />
                                                </div>
                                            </div>

                                            <div className='panelSubLeader' style={{ display: (STC_FORM.SSH_REQ_TYPE === 'RTY002' ? 'none' : ('')) }}>
                                                <div className='sLeaderFirst2'>
                                                    Employee ID
                                                </div>
                                                <div className='sLeaderEnd2'>
                                                    <StyledTextBox
                                                        disabled={localStorage.getItem('TYPE_ACTION') === 'VIEW'}
                                                        className='dTextSTG'
                                                        type="text"
                                                        placeholder=""
                                                        name='T_EMP_ID'
                                                        value={STC_TEAM.T_EMP_ID}
                                                        onChange={handleInputChangeTextTeam}
                                                    />
                                                    <div className='sLeaderCC'>
                                                        <div>CC</div>&nbsp;
                                                        <StyledTextBox
                                                            disabled={true}
                                                            className='dTextCC'
                                                            type="text"
                                                            placeholder=""
                                                            name='T_EMP_CC'
                                                            value={STC_TEAM.T_EMP_CC}
                                                            onChange={handleInputChangeTextTeam}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='panelSubLeader' style={{ display: (STC_FORM.SSH_REQ_TYPE === 'RTY002' ? 'none' : '') }}>
                                                <div className='sLeaderFirst2'>
                                                    Name - Surname
                                                </div>
                                                <div className='sLeaderEnd2'>
                                                    <StyledTextBox
                                                        disabled={true}
                                                        className='dTextName'
                                                        type="text"
                                                        placeholder=""
                                                        name='T_EMP_NAME'
                                                        value={STC_TEAM.T_EMP_NAME}
                                                        onChange={handleInputChangeTextTeam}
                                                    />
                                                    <div style={{display: (localStorage.getItem('TYPE_ACTION') === 'VIEW' ? 'none' : '')}}>
                                                        <button className="icon-buttonADDTeam" onClick={addMember}>
                                                            <FontAwesomeIcon icon={faPlus} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='panelSubLeader' style={{ display: (STC_FORM.SSH_REQ_TYPE === 'RTY002' ? 'none' : '') }}>
                                                <div className="grid-containerTeam">
                                                    <table className="grid-tableTeam">
                                                        <thead>
                                                            <tr>
                                                                <th style={{ width: '100px' }} align='center'></th>
                                                                <th style={{ width: '150px' }} align='center'>Emp ID</th>
                                                                <th style={{ width: '250px' }} align='Left'>Name - Surname</th>
                                                                <th style={{ width: '150px' }} align='center'>Job Grade</th>
                                                                <th style={{ width: '150px' }} align='center'>CC</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {STC_FORM.SSH_MEMBER_TEAM.map((row, index) => (
                                                                <tr key={index}>
                                                                    <td align='center'>
                                                                        <button className="icon-buttonDel" style={{display: (localStorage.getItem('TYPE_ACTION') === 'VIEW' ? 'none' : '')}} onClick={(e) => removeMember(row.T_EMP_ID)}>
                                                                            <FontAwesomeIcon icon={faMinus} />
                                                                        </button>
                                                                    </td>
                                                                    <td align='center'>{row.T_EMP_ID}</td>
                                                                    <td align='Left'>{row.T_EMP_NAME}</td>
                                                                    <td align='center'>{row.T_EMP_JOBGRAD}</td>
                                                                    <td align='center'>{row.T_EMP_CC}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>

                                                    </table>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='cNoneF'></div>
                                </div>
                                <div className='cRowFlexForm' style={{ display: ((STC_FORM.LRH_SUMIT_TO_SG === '') ? 'none' : '') }}>
                                    <div className='cTilteFF'>
                                    </div>
                                    <div className='cToolsF3'>
                                        <div className='panelLeader' style={{ backgroundColor: (localStorage.getItem('TYPEDOC') === 'LOCT' ? '#F8E3C6' : '#D4FAEF') }}>
                                            <div style={{ fontWeight: 'bold', display: (STC_FORM.LRH_SUMIT_TO_SG === 'N' || STC_FORM.LRH_SUMIT_TO_SG === 'Y' ? '' : 'none') }}>{localStorage.getItem('TYPEDOC') === 'LOCT' ? 'For LOCT(สำหรับ LOCT)' : 'For IECT(สำหรับ IECT)'}</div>
                                            <div className='panelSubLeader' style={{ display: (STC_FORM.LRH_SUMIT_TO_SG === 'Y' || STC_FORM.LRH_SUMIT_TO_SG === 'N' ? '' : 'none') }}>
                                                <div className='sLeaderFirst'>
                                                    <div className='cTilteSubF'>
                                                        <div><label style={{ color: 'red' }}>*</label>&nbsp;Leader Approve</div>
                                                        <div>(รหัสหัวหน้างาน อนุมัติ)</div>
                                                    </div>
                                                </div>
                                                <div className='sLeaderEnd'>
                                                    <StyledTextBox
                                                        disabled={localStorage.getItem('TYPE_ACTION') === 'VIEW'}
                                                        className='dTextLeader'
                                                        type="text"
                                                        placeholder=""
                                                        name='LRH_LEADER_APP_BY'
                                                        value={STC_FORM.LRH_LEADER_APP_BY}
                                                        onChange={handleInputChangeText}
                                                    />
                                                    <FontAwesomeIcon icon={faTimesCircle} style={{ color: 'red', fontSize: '20px', cursor: 'pointer', marginLeft: '0.2rem', display: (localStorage.getItem('TYPE_ACTION') === 'VIEW' ? 'none' : '') }} onClick={OnClearLeader} />
                                                </div>
                                            </div>
                                            <div className='panelSubLeader' style={{ display: (STC_FORM.LRH_SUMIT_TO_SG === 'Y' || STC_FORM.LRH_SUMIT_TO_SG === 'N' ? '' : 'none') }}>
                                                <div className='sLeaderFirst'>
                                                    <div className='cTilteSubF'>
                                                        <div>Leader Name-Surname</div>
                                                        <div>(รหัสหัวหน้างาน อนุมัติ)</div>
                                                    </div>
                                                </div>
                                                <div className='sLeaderEnd'>
                                                    <StyledTextBox
                                                        disabled={true}
                                                        className='dTextLeader'
                                                        type="text"
                                                        placeholder=""
                                                        name='LRH_LEADER_APP_NAME'
                                                        value={STC_FORM.LRH_LEADER_APP_NAME}
                                                        onChange={handleInputChangeText}
                                                    />
                                                </div>
                                            </div>
                                            <div style={{ fontWeight: 'bold', display: (STC_FORM.LRH_SUMIT_TO_SG === '5' || STC_FORM.LRH_SUMIT_TO_SG === 'Y' ? '' : 'none') }}>For Suggestion (สำหรับ Suggestion)</div>
                                            <div className='panelSubLeader' style={{ display: (STC_FORM.LRH_SUMIT_TO_SG === '5' || STC_FORM.LRH_SUMIT_TO_SG === 'Y' ? '' : 'none') }}>
                                                <div className='sLeaderFirst'>
                                                    <div className='cTilteSubF'>
                                                        <div><label style={{ color: 'red' }}>*</label>&nbsp;Supervisor Approve</div>
                                                        <div>(ชื่อหัวหน้างาน อนุมัติ)</div>
                                                    </div>
                                                </div>
                                                <div className='sLeaderEnd'>
                                                    <StyledSelect
                                                        className='react-selectSup'
                                                        value={STC_FORM.SSH_SV_APP_BY}
                                                        onChange={handleChangeSup}
                                                        options={supList}
                                                        placeholder="-- Select --"
                                                        classNamePrefix="react-selectSup"
                                                        isDisabled={localStorage.getItem('TYPE_ACTION') === 'VIEW'}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='cNoneF'></div>
                                </div>

                                <div className='cRowFlexForm' style={{ display: (STC_FORM.LRH_SUMIT_TO_SG === '' ? 'none' : '') }}>
                                    <div className='cRowbtn'>
                                        <button className="icon-buttonSaveD" style={{ display: (STC_FORM.LRH_SUMIT_TO_SG === '5' || localStorage.getItem('TYPE_ACTION') === 'VIEW' ? 'none' : '') }} onClick={OnSave}>
                                            <FontAwesomeIcon icon={faSave} /> Save
                                        </button>
                                        <button className="icon-buttonSubmitD" style={{ display: (localStorage.getItem('TYPE_ACTION') === 'VIEW' ? 'none' : '') }} onClick={OnSubmit}>
                                            <FontAwesomeIcon icon={faPaperPlane} /> Submit
                                        </button>
                                        <button className="icon-buttonReD" onClick={STC_FORM.LRH_REQ_NO.trim() !== '' ? handleBack : OnReset}>
                                            {STC_FORM.LRH_REQ_NO.trim() !== '' ? <><FontAwesomeIcon icon={faArrowLeft} />Back</> : <><FontAwesomeIcon icon={faRefresh} />Reset</>}
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className='AearLeftRightF'></div>
                    </div>
                </div>
            )}
        </div>

    )
}

export default TransactionDetail