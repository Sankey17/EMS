import React from "react"
import {Button, CardHeader} from "reactstrap";
import {Table} from "antd";
import {getCourse, deleteCourse, getCourseById} from "../../actions"
import {AlertModal} from "../Department/modal"
import {IsModal} from "./modal"
import { toast } from 'react-toastify'

class Course extends React.Component {
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
      course: '',
      fees: '',
      name: 'Course list',
      isModalShow: false,
      error: {course: '', fees: ''}
    }
  }

  componentDidMount() {
    this.fetchCourse()
  }

  fetchCourse = async() => {
    const {page, pageSize} = this.state
    const list = await getCourse(page-1, pageSize)
    if(list.success) {
      this.setState({
        list: list.data.course || [],
        page: list.data.page+1,
        totalList: list.data.totalCourse,
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
    }, () => this.fetchCourse())
  }

  onPageChange = (page) => {
    this.setState({
      page
    }, () => this.fetchCourse())
  }

  ShowModel = (id, course) => {
    this.setState({
      alertModal: true,
      deleteId: id,
      course: course
    })
  }

  handleCancel = () => {
    this.setState({
      alertModal: false,
      isModalShow: false,
      error: {},
      course: '',
    })
  }

  deleteCourse = async() => {
    const {deleteId} = this.state
    const result = await deleteCourse(deleteId)
    if(result.success) {
      toast.success('course removed successfully', {
        position: toast.POSITION.TOP_RIGHT
      })
      this.fetchCourse()
    }else {
      toast.success('something went wrong!', {
        position: toast.POSITION.TOP_RIGHT
      })
    }
  }

  editData = async(id, description) => {
    this.props.history.push(`/course/edit/${id}`, {id, description})
  }

  isModelShow = async(id) => {
    const result = await getCourseById(id)
    this.setState({
      isModalShow: true,
      editId: id,
      course: result.data.course.course,
      fees: result.data.course.fees,
      description: result.data.course.description
    })
  }

  render = () => {
    const {page, pageSize, totalList, list, alertModal, course, name, isModalShow, fees, description} = this.state
    const columns = [
      {
        title: '#',
        key: 'Name',
        render: (record, data, index) => (
          <span>{index + 1}</span>
        )
      },
      {
        title: 'Course',
        key: "Course",
        dataIndex: 'course',
        sorter: (a, b) => a.course.length - b.course.length,
      },
      {
        title: 'Fees',
        key: "Fees",
        dataIndex: 'fees'
      },
      {
        title: 'Action',
        key: 'Button',
        align: 'center',
        render: (record, data) => (
          <div>
            <Button size="sm" className="btn-behance btn-brand mr-1 mb-1"
                    onClick = {() => this.editData(data._id, data.description)}>
              <i className="fa fa-edit"/><span>Edit</span>
            </Button>
            <Button size="sm" className="btn-danger btn-brand mr-1 mb-1"
                    onClick = {() => this.ShowModel(data._id, data.course)}>
              <i className="fa fa-trash-o"/><span>Remove</span>
            </Button>
            <Button size="sm" className="btn-info btn-brand mr-1 mb-1"
                    onClick = {() => this.isModelShow(data._id)}>
              <i className="fa fa-eye"/><span>View</span>
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
          Are you sure to delete course <span className='text-success'>{course}</span> ?
        </AlertModal>
        <IsModal
          isModal={isModalShow}
          course={course}
          fees={fees}
          description={description}
          handleChange={this.handleChange}
          onCancel={this.handleCancel}
        />

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

export default Course
