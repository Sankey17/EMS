import React, {Component} from "react";
import {Table} from "antd";
import {Row} from 'reactstrap';
import {Button} from "reactstrap";
import {addDepartment, getDepartment, deleteDepartment, editDepartment, deleteDesignation} from '../../actions'
import { toast } from 'react-toastify';
import {ToastTimeout} from "../../utils/CONST";
import {DepartmentModal, AlertModal} from "./modal.js"

class Department extends Component{
  constructor(props){
    super(props)
    this.state = {
      department: '',
      departmentList: [],
      addModal: false,
      alertModal: false,
      totalDepartment: 0,
      page: 1,
      pages: 0,
      pageSize: 10,
      deleteIndex: '',
      editIndex: '',
      error: ''
    }
  }

   componentWillMount () {
    this.fetchDepartment()
  }

  fetchDepartment = async() => {
    const{page, pageSize} = this.state
    const res = await getDepartment(page-1, pageSize)
    if (res && res.data) {
      this.setState({
        departmentList: res.data.department,
        page: res.data.page+1,
        totalDepartment: res.data.totalDepartment,
        pages: res.data.pages,
        deleteIndex: '',
        department: '',
        alertModal: false
      })
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleCancel = () => {
    this.setState({
      addModal: false,
      alertModal: false,
      department: '',
      error: '',
      editIndex: ''
    });
  }

  addDepartment = async() => {
    const {department} = this.state
    if(!department) {
      this.setState({
        error: "Department Name is require"
      })
      return
    }
    const response = await addDepartment(department)
    if (response && response.success) {
      toast.success("Department add successfully", {
        position: toast.POSITION.TOP_RIGHT
      })
      this.fetchDepartment()
    }else {
      toast(`${response.message.response.data.error}`, {autoClose: ToastTimeout, type: toast.TYPE.ERROR})
    }
    this.setState({
      addModal: false,
      department: '',
      error: '',
      editIndex:'',
    })
  }

  departmentModal = () => {
    this.setState({
      addModal: true,
    });
  }

  editDepartment = async() => {
    const {editIndex, department} = this.state
    if(!department) {
      this.setState({
        error: "Department Name is require"
      })
      return
    }
    const data = await editDepartment(editIndex, department)
    if(data && data.success) {
      toast.success("Department edit successfully", {
        position: toast.POSITION.TOP_RIGHT
      })
      this.fetchDepartment()
    }else {
      toast(`${data.message.response.data.error}`, {autoClose: ToastTimeout, type: toast.TYPE.ERROR})
    }
      this.setState({
        addModal: false,
        error: '',
        department: '',
        editIndex: ''
      })
  }

  editData = async(id, department) => {
    this.setState({
      addModal: true,
      editIndex: id,
      department: department
    })
  }

  deleteDepartment = async() => {
    const data = await deleteDepartment(this.state.deleteIndex)
    await deleteDesignation(this.state.deleteIndex)
    if(data.success) {
      toast.success("Department delete successfully", {
        position: toast.POSITION.TOP_RIGHT
      })
      this.fetchDepartment()
    }else {
      toast(`${data.message.response.data.error}`, {autoClose: ToastTimeout, type: toast.TYPE.ERROR})
    }
  }

  deleteData = async(index, departmentList) => {
    this.setState({
      alertModal: true,
      deleteIndex: index,
      department: departmentList
    })
  }

  onShowSizeChange = (page, pageSize) => {
    this.setState({
      page,
      pageSize
    }, () => this.fetchDepartment())
  }

  onPageChange = (page) => {
    this.setState({
      page
    }, () => this.fetchDepartment())
  };

  render() {
    const {addModal, department, departmentList, alertModal, error, editIndex, page, totalDepartment, pageSize} = this.state
    const columns = [
      {
        title: '#',
        key: 'title',
        render: (record, data, index) => (
          <span>{index + 1}</span>
        )
      },
      {
        title: 'Department',
        key: "departmentName",
        dataIndex: 'name',
        sorter: (a, b) => a.name.length - b.name.length,
      },
      {
        title: 'Action',
        key: 'button',
        render: (record, data) => (
          <div>
            <Button size="sm" className="btn-behance btn-brand mr-1 mb-1"
                    onClick = {() => this.editData(data._id, data.name)}>
              <i className="fa fa-edit"/><span>Edit</span>
            </Button>
            <Button size="sm" className="btn-danger btn-brand mr-1 mb-1"
                    onClick = {() => this.deleteData(data._id, data.name)}>
              <i className="fa fa-trash-o"/><span>Remove</span>
            </Button>
          </div>
        )
      }
    ];
    return (
      <div>
        <DepartmentModal
          addModal={addModal}
          department={department}
          handleChange={this.handleChange}
          addDepartment={this.addDepartment}
          handleCancel={this.handleCancel}
          editDepartment={this.editDepartment}
          editIndex={editIndex}
          error={error}
        />
         <AlertModal
           visible={alertModal}
           onConfirm={this.deleteDepartment}
           onCancel={this.handleCancel}
         >
           Are you sure to delete department <span className='text-success'>{department}</span> ?
         </AlertModal>
        <div className="text-right">
          <Button block color="primary" className="btn-success btn-pill w-auto float-right pointer" onClick={this.departmentModal}>
            <i className="fa fa-plus fa-lg" />
            &nbsp;&nbsp;
            Add Department
          </Button>
          <br/>
          <br/>
        </div>
        <Row className="table-responsive">
          <Table
            rowKey={record => record._id}
            pagination={{
              current: page,
              total: totalDepartment,
              defaultPageSize: pageSize,
              showSizeChanger: true,
              onShowSizeChange: this.onShowSizeChange,
              onChange: this.onPageChange,
              pageSizeOptions: ['10', '20', '30']
            }}
            columns={columns}
            dataSource={departmentList}
          />
        </Row>
      </div>
    )
  }
}

export default Department


