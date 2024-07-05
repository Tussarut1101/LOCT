import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from "axios";
import PageLoad from '../../Page/PageLoad';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const username = import.meta.env.VITE_API_USER;
const password = import.meta.env.VITE_API_PASS;
const token = btoa(`${username}:${password}`);

function PrintFile() {
    const [loading, setloading] = useState(false);

    const generatePDF = () => {
        const doc = new jsPDF({
            orientation: 'landscape', // ตั้งค่าแนวนอน (landscape) หรือแนวตั้ง (portrait)
            unit: 'mm', // หน่วยเป็นมิลลิเมตร
            format: 'a4', // ขนาดกระดาษ A4
            compress: true, // บีบอัดเอกสารเพื่อลดขนาดไฟล์
            fontSize: 12, // ตั้งค่าขนาดตัวอักษรเริ่มต้น
            lineHeight: 1.2, // ความสูงของบรรทัด
            autoSize: false, // ปรับขนาดเอกสารอัตโนมัติ
            margin: { top: 10, right: 10, bottom: 10, left: 10 } // กำหนดขอบกระดาษ
          });

        // ตั้งค่าหัวเรื่อง
        let startY = 0;
        doc.autoTable({
            startY: startY,
            margin: { top: 0, right: 0, bottom: 0, left: 0 },            
            head: [
                [{ content: `Management Find out RISK & Improvement`}]
            ],
            
            body: [],
            theme: 'grid', // ใช้ theme 'grid' เพื่อให้มีเส้นขอบ
            headStyles: {
                fontSize: 10,
                fillColor: [41, 128, 185], // สีพื้นหลังของหัวตาราง
                textColor: [255, 255, 255], // สีข้อความในหัวตาราง
                fontStyle: 'bold', // ลักษณะตัวอักษร
                lineWidth: 0.5, // ความหนาของเส้นขอบ
                lineColor: [0, 0, 0], // สีขอบของเส้นขอบ
                halign: 'center'
              },
            styles: {
                cellPadding: 2,
                fontSize: 7,
                textColor: [0, 0, 0], // สีข้อความเป็นสีดำ
                fillColor: [255, 255, 255], // สีพื้นหลังเป็นสีขาว
                lineColor: [0, 0, 0], // สีขอบเป็นสีดำ
            },
        });

        startY = doc.previousAutoTable.finalY + 2;

        doc.autoTable({
            startY: startY,
            margin: { top: 0, right: 5, bottom: 2, left: 5 },
            head: [
                [{ content: `Detail`, colSpan: 6}, { content: `Before Improvement`}, { content: `After Improvement`}]
            ],
            
            body: [
                    [{ content: 'Manager ID Name', styles: {cellWidth: 40 }},{ content: '3004168', styles: {cellWidth: 14 }},{ content: 'Mrs,Sujinda Sukuna', colSpan: 4},{ content: `Image Before`, rowSpan: 6 , styles: { halign:'center' }},{ content: `Image After`, rowSpan: 6 , styles: { halign:'center' }}],
                    [{ content: 'Cost Center', styles: {cellWidth: 40 }},{ content: 'M502', colSpan: 5}],
                    [{ content: 'Area Inspection', styles: {cellWidth: 40 }},{ content: '2nd floor Fac.C', colSpan: 5}],
                    [{ content: 'Date Issue', styles: {cellWidth: 40 }},{ content: '05-04-2024', colSpan: 5}],
                    [{ content: 'Improvement Complete Date', styles: {cellWidth: 40 }},{ content: '18-04-2024', colSpan: 5}],
                    [{ content: 'Risk Class(A,B,C,D)', styles: {cellWidth: 40 }},{ content: 'B', colSpan: 5}],
                    [{ content: 'Acciden Effect for', styles: {cellWidth: 40 }},{ content: 'Man', styles: {cellWidth: 14, halign:'center', fillColor: '#ccc' }},{ content: 'Machine', styles: {cellWidth: 14, halign:'center' }},{ content: 'Product', styles: {cellWidth: 14, halign:'center' }},{ content: 'Cost', styles: {cellWidth: 14, halign:'center' }},{ content: 'Others', styles: {cellWidth: 14, halign:'center' }},{ content: `Detail Before`, rowSpan: 4},{ content: `Detail After`, rowSpan: 4}],
                    [{ content: 'Cost of Improvement(THB)', styles: {cellWidth: 40 }},{ content: '0', colSpan: 5}],
                    [{ content: 'Approve by (FM Level , DM Up)', styles: {cellWidth: 40 }},{ content: 'Mr.Chayawit Chaihoi', colSpan: 5}],
                    [{ content: '', colSpan: 6, styles: {minCellHeight: 25 }}]
            ],
            theme: 'grid', // ใช้ theme 'grid' เพื่อให้มีเส้นขอบ
            headStyles: {
                fontSize: 8,
                fillColor: [41, 128, 185], // สีพื้นหลังของหัวตาราง
                textColor: [255, 255, 255], // สีข้อความในหัวตาราง
                fontStyle: 'bold', // ลักษณะตัวอักษร
                lineWidth: 0.5, // ความหนาของเส้นขอบ
                lineColor: [0, 0, 0], // สีขอบของเส้นขอบ
                halign: 'center'
              },
            styles: {
                cellPadding: 2,
                fontSize: 7,
                textColor: [0, 0, 0], // สีข้อความเป็นสีดำ
                fillColor: [255, 255, 255], // สีพื้นหลังเป็นสีขาว
                lineColor: [0, 0, 0], // สีขอบเป็นสีดำ
            },
        });

        startY = doc.previousAutoTable.finalY + 2;

        doc.autoTable({
            startY: startY,
            margin: { top: 0, right: 5, bottom: 2, left: 5 },
            head: [
                [{ content: `Detail`, colSpan: 6}, { content: `Before Improvement`}, { content: `After Improvement`}]
            ],
            
            body: [
                    [{ content: 'Manager ID Name', styles: {cellWidth: 40 }},{ content: '3004168', styles: {cellWidth: 14 }},{ content: 'Mrs,Sujinda Sukuna', colSpan: 4},{ content: `Image Before`, rowSpan: 6 , styles: { halign:'center' }},{ content: `Image After`, rowSpan: 6 , styles: { halign:'center' }}],
                    [{ content: 'Cost Center', styles: {cellWidth: 40 }},{ content: 'M502', colSpan: 5}],
                    [{ content: 'Area Inspection', styles: {cellWidth: 40 }},{ content: '2nd floor Fac.C', colSpan: 5}],
                    [{ content: 'Date Issue', styles: {cellWidth: 40 }},{ content: '05-04-2024', colSpan: 5}],
                    [{ content: 'Improvement Complete Date', styles: {cellWidth: 40 }},{ content: '18-04-2024', colSpan: 5}],
                    [{ content: 'Risk Class(A,B,C,D)', styles: {cellWidth: 40 }},{ content: 'B', colSpan: 5}],
                    [{ content: 'Acciden Effect for', styles: {cellWidth: 40 }},{ content: 'Man', styles: {cellWidth: 14, halign:'center', fillColor: '#ccc' }},{ content: 'Machine', styles: {cellWidth: 14, halign:'center' }},{ content: 'Product', styles: {cellWidth: 14, halign:'center' }},{ content: 'Cost', styles: {cellWidth: 14, halign:'center' }},{ content: 'Others', styles: {cellWidth: 14, halign:'center' }},{ content: `Detail Before`, rowSpan: 4},{ content: `Detail After`, rowSpan: 4}],
                    [{ content: 'Cost of Improvement(THB)', styles: {cellWidth: 40 }},{ content: '0', colSpan: 5}],
                    [{ content: 'Approve by (FM Level , DM Up)', styles: {cellWidth: 40 }},{ content: 'Mr.Chayawit Chaihoi', colSpan: 5}],
                    [{ content: '', colSpan: 6, styles: {minCellHeight: 25 }}]
            ],
            theme: 'grid', // ใช้ theme 'grid' เพื่อให้มีเส้นขอบ
            headStyles: {
                fontSize: 8,
                fillColor: [41, 128, 185], // สีพื้นหลังของหัวตาราง
                textColor: [255, 255, 255], // สีข้อความในหัวตาราง
                fontStyle: 'bold', // ลักษณะตัวอักษร
                lineWidth: 0.5, // ความหนาของเส้นขอบ
                lineColor: [0, 0, 0], // สีขอบของเส้นขอบ
                halign: 'center'
              },
            styles: {
                cellPadding: 2,
                fontSize: 7,
                textColor: [0, 0, 0], // สีข้อความเป็นสีดำ
                fillColor: [255, 255, 255], // สีพื้นหลังเป็นสีขาว
                lineColor: [0, 0, 0], // สีขอบเป็นสีดำ
            },
        });

       
       

        // Save the PDF
        doc.save('table.pdf');
    };


    return (
        <div>
            {loading ?
                (<div><PageLoad></PageLoad></div>) :
                (<div>
                    <div className='btnPrint' onClick={() => generatePDF()}>
                        <FontAwesomeIcon icon={faPrint} style={{ marginRight: '5px' }} /> Print
                    </div>
                </div>)}
        </div>
    )
}

export default PrintFile