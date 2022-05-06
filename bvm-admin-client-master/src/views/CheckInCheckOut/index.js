import { Table, Select, DatePicker } from "antd";
import { connect } from 'react-redux'
import React, { useEffect, useState } from "react";
import Button from "reactstrap/lib/Button";
import { createCheckIn, getCheckInCheckOut,/* getCheckInCheckOutByDate, getCheckInCheckOutByID,*/ getCheckInCheckOutFillter, getUserList, updateCheckOut } from "../../actions";
import moment from "moment";
import { Loader } from "../../globalutilities";

const ChaeckInCheckOut = (props) => {

    const { Option } = Select;

    const user = props.token.auth
    const columns = [
        {
            title: 'Date',
            key: 'date',
            dataIndex: 'date'
        },
        {
            title: 'Check In',
            key: 'checkIn',
            dataIndex: 'checkIn'
        },
        {
            title: 'Check Out',
            key: 'checkOut',
            dataIndex: 'checkOut'
        },
        {
            title: 'Total Work',
            key: 'totalWork',
            dataIndex: 'totalWork'
        },
        {
            title: 'Status',
            kry: 'status',
            dataIndex: 'status'
        },
    ]

    user.role === 'admin' && columns.unshift({
        title: 'User Name',
        key: 'userName',
        dataIndex: 'userName'
    })

    const [isCheckIn, setIsCheckIn] = useState(false)
    const [isCheckOut, setIsCheckInOut] = useState(false)
    const [dataSource, setDataSource] = useState([])
    const [lord, setLord] = useState(true)
    const [userData, setUserData] = useState([{}])
    const [userId, setUserId] = useState(undefined)
    const [date, setDate] = useState()

    const setUser = (data) => {
        let isCheckInStatus = true
        let isCheckOutStatus = false
        data.forEach(row => {
            row.date === moment().format('L') ? isCheckInStatus = false : isCheckInStatus = true;
            row.date === moment().format('L') && row.status === "Active" ? isCheckOutStatus = true : isCheckOutStatus = false;
        })
        setIsCheckIn(isCheckInStatus)
        setIsCheckInOut(isCheckOutStatus)
    }

    const setAdmin = async () => {
        const userListResponse = await getUserList()
        const userList = userListResponse.data || []
        setUserData(userList)
    }

    const setData = async (result) => {
        const newDataSource = []

        result && result.data && result.data.forEach(row => {

            const newData = {
                id: row._id,
                date: row.date,
                checkIn: row.checkIn,
                checkOut: row.checkOut,
                totalWork: row.totalWork,
                status: row.status,
                userId: row.employeeId,
                userName: row.employeeName
            }
            newDataSource.push(newData)
        })
        user.role === "user" && setUser(newDataSource)
        setDataSource(newDataSource)
        setLord(false)
    }

    const getCheckInCheckOutUserFillter = async (id, date) => {
        setLord(true)
        const result = await getCheckInCheckOutFillter(id, date)
        setData(result)
    }

    const getData = async () => {
        setLord(true)
        const result = await getCheckInCheckOut()
        setData(result)
    }

    useEffect(() => {
        user.role === "admin" && setAdmin()
        user._id && getData()
    }, [props.token.auth])

    const CheckInHandler = async () => {
        await createCheckIn()
        await getData()
    }
    const CheckOutHandler = async () => {
        await updateCheckOut()
        await getData()
    }

    const onSelectChangehandler = e => {
        const newUserId = e.length > 0 ? e : undefined
        setUserId(newUserId)
        getCheckInCheckOutUserFillter(newUserId, date)

    }

    const onDatePickerChangeHandler = e => {
        console.log("userid in date picker",userId)
        const dateFormat = e ? e.format('L') : undefined
        setDate(dateFormat)
        getCheckInCheckOutUserFillter(userId, dateFormat)

    }

    return <div className={'d-flex flex-column'} style={{ gap: '1rem' }}>
        {lord ? <Loader /> : null}
        {user.role === "user" && <div className={'d-flex'} style={{ gap: '1rem' }}>
            <Button color="primary" className="btn-success btn-pill pointer" disabled={!isCheckIn} onClick={CheckInHandler}>
                <i className="fa fa-sign-in fa-lg" />
                &nbsp;&nbsp;
                Check In
            </Button>
            <Button color="primary" className="btn-success btn-pill pointer" disabled={!isCheckOut} onClick={CheckOutHandler}>
                <i className="fa fa-sign-out fa-lg" />
                &nbsp;&nbsp;
                Check Out
            </Button>
        </div>}
        {user.role === 'admin' && <div className={'d-flex'} style={{ gap: '1rem' }}>
            <Select
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                placeholder="Please select"
                onChange={onSelectChangehandler}
            >
                {userData.map(user => <Option value={user._id} key={user._id}>{user.userName}</Option>)}
            </Select>
            <DatePicker onChange={onDatePickerChangeHandler} />
        </div>}
        <Table dataSource={dataSource} columns={columns} rowKey={data => data.id} />
    </div>
}

const mapStateToProps = (state) => {
    return {
        token: state
    }
};

export default connect(mapStateToProps)(ChaeckInCheckOut);
