import React, { useState, useEffect } from 'react';
import axios from 'axios';

const username = import.meta.env.VITE_API_USER;
const password = import.meta.env.VITE_API_PASS;
const token = btoa(`${username}:${password}`);

function Login_Fn() {
    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');
    const [load, setLoad] = useState(false);

    const LoginUser = async () => {
        if (username !== password){
            alert("Username or Password incorrect")
            return
        }
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API}/login/getLoginHR?P_EMPID=${username}`,
                {
                    headers: {
                        'Authorization': `Basic ${token}`, // ใส่ Authorization header แบบ Basic
                    },
                }
            );
            const data = await response.data;
            console.log(data);
            if (data.length > 0) {
                localStorage.setItem("emp_id", data[0][0]);
                localStorage.setItem("emp_name", data[0][1] + ' ' + data[0][2]);
                localStorage.setItem("emp_fname", data[0][1]);
                localStorage.setItem("emp_sname", data[0][2]);
                localStorage.setItem("emp_user", data[0][3]);
                localStorage.setItem("emp_fac_code", data[0][4]);
                localStorage.setItem("emp_fac_desc", data[0][5]);
                localStorage.setItem("emp_cc", data[0][6]);
                localStorage.setItem("emp_status", data[0][7]);

                window.location.href = '/LOCTSystem/Home';
            } else {
                alert(data);
            }
        } catch (error) {
            // console.error("Error RequesterORType:", error);
            alert(error.message);
            console.log(error);
        }
    };
    return { username, setusername, password, setpassword, LoginUser, load, setLoad}
}

export { Login_Fn }