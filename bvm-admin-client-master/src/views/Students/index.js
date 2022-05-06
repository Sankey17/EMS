import React from "react"
import {Button, CardHeader} from "reactstrap";
import {Table} from "antd";
import {getStudent, deleteStudent} from "../../actions"
import {AlertModal} from "../Department/modal"
import { toast } from 'react-toastify'

class Student extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      page: 1,
      pages: 0,
      pageSize: 10,
      list: [],
      totalList: '',
      alertModal: false,
      deleteId: '',
      firstName: '',
      fees: '',
      name: 'Course list',
      error: {course: '', fees: ''}
    }
  }

  componentDidMount() {
    this.fetchStudent()
  }

  fetchStudent = async() => {
    const {page, pageSize} = this.state
    const list = await getStudent(page-1, pageSize)
    if(list && list.success) {
      this.setState({
        list: list.data.student || [],
        page: list.data.page+1,
        totalList: list.data.totalStudent,
        pages: list.data.pages,
        alertModal: false
      })
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  onShowSizeChange = (page, pageSize) => {
    this.setState({
      page,
      pageSize
    }, () => this.fetchStudent())
  }

  onPageChange = (page) => {
    this.setState({
      page
    }, () => this.fetchStudent())
  }

  ShowModel = (id, firstName) => {
    this.setState({
      alertModal: true,
      deleteId: id,
      firstName: firstName
    })
  }

  handleCancel = () => {
    this.setState({
      alertModal: false
    })
  }

  deleteCourse = async() => {
    const {deleteId} = this.state
    const result = await deleteStudent(deleteId)
    if(result.success) {
      toast.success('student removed successfully', {
        position: toast.POSITION.TOP_RIGHT
      })
      this.fetchStudent()
    }else {
      toast.success('something went wrong!', {
        position: toast.POSITION.TOP_RIGHT
      })
    }
  }

  editData = async(id) => {
    this.props.history.push(`/student/edit/${id}`, id)
  }

  render = () => {
    const {page, pageSize, totalList, list, alertModal, firstName, name} = this.state
    const columns = [
      {
        title: 'Name',
        key: "name",
        dataIndex: 'firstName',
        sorter: (a, b) => a.firstName.length - b.firstName.length,
      },
      {
        title: 'Email',
        key: "email" ,
        dataIndex: 'email',
        sorter: (a,b) => a.email.length - b.email.length,
      },
      {
        title: 'Number',
        key: "number",
        dataIndex: 'phone',
      },
      {
        title: 'Course',
        key: "course",
        render: (record) => (
          <span>{record.tags.toString().split(' , ')}</span>
        ),
        sorter: (a,b) => a.tags.length - b.tags.length
      },
      {
        title: 'Action',
        key: 'Button',
        align: 'center',
        render: (record, data) => (
          <div>
            <Button size="sm" className="btn-behance btn-brand mr-1 mb-1"
                    onClick = {() => this.editData(data._id)}>
              <i className="fa fa-edit"/><span>Edit</span>
            </Button>
            <Button size="sm" className="btn-danger btn-brand mr-1 mb-1"
                    onClick = {() => this.ShowModel(data._id, data.firstName)}>
              <i className="fa fa-trash-o"/><span>Remove</span>
            </Button>
          </div>
        )
      }
    ]
    return(
      <div>
        <CardHeader>
          <strong>{name}</strong>
        </CardHeader>
        <AlertModal
          visible={alertModal}
          onConfirm={this.deleteCourse}
          onCancel={this.handleCancel}
        >
          Are you sure to delete data of <span className='text-success'>{firstName}</span> ?
        </AlertModal>
        <Table
          rowKey={record => record._id}
          pagination={{
            current: page,
            total: totalList,
            defaultPageSize: pageSize,
            showSizeChanger: true,
            onShowSizeChange: this.onShowSizeChange,
            onChange: this.onPageChange,
            pageSizeOptions: ['10', '20', '30']
          }}
          columns={columns}
          dataSource={list}
        />
      </div>
    )
  }
}

export default Student
