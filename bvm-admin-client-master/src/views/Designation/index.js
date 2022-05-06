import React, { Component } from "react";
import { Button } from "reactstrap";
import { AddModal } from "./modal.js";
import { AlertModal } from "../Department/modal";
import { Table } from "antd";
import {
  getDesignation,
  addDesignation,
  deleteDesignation,
  getDepartment,
  editDesignationData,
} from "../../actions";
import { ToastTimeout } from "../../utils/CONST";
import { toast } from "react-toastify";

class Designation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      pages: 0,
      pageSize: 10,
      designation: "",
      department: "",
      addModal: false,
      deleteModal: false,
      departmentList: [],
      list: [],
      deleteIndex: "",
      editIndex: "",
      departmentId: "",
      error: { designation: "", department: "" },
    };
  }

  async componentWillMount() {
    this.fetchDesignation();
    const department = await getDepartment();
    this.setState({
      departmentList: department.data,
    });
  }

  fetchDesignation = async () => {
    const { page, pageSize } = this.state;
    const designation = await getDesignation(page - 1, pageSize);
    if (designation && designation.success) {
      this.setState({
        list: designation.data.designation,
        page: designation.data.page + 1,
        totalDesignation: designation.data.totalDesignation,
        pages: designation.data.pages,
        deleteModal: false,
        designation: "",
      });
    }
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleCancel = () => {
    this.setState({
      addModal: false,
      deleteModal: false,
      designation: "",
      department: "",
      departmentId: "",
      editIndex: "",
      error: {},
    });
  };

  addDesignation = async () => {
    const { departmentId, designation } = this.state;
    const allError = {};
    if (!designation) {
      allError.designation = "Designation Name is require";
    }
    if (!departmentId) {
      allError.department = "Department is require";
    }
    if (!designation || !departmentId) {
      this.setState({
        error: allError,
      });
      return;
    }
    const userData = { departmentId, designation };
    const data = await addDesignation(userData);
    if (data.success) {
      toast.success("Designation add successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      this.fetchDesignation();
    } else {
      toast(`${data.message.response.data.error}`, {
        autoClose: ToastTimeout,
        type: toast.TYPE.ERROR,
      });
    }
    this.setState({
      addModal: false,
      designation: "",
      department: "",
      departmentId: "",
      error: {},
    });
  };

  designationModal = () => {
    this.setState({
      addModal: true,
    });
  };

  deleteDesignation = async () => {
    const data = await deleteDesignation(this.state.deleteIndex);
    if (data.success) {
      toast.success("Designation delete successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      this.fetchDesignation();
    } else {
      toast(`${data.message.response.data.error}`, {
        autoClose: ToastTimeout,
        type: toast.TYPE.ERROR,
      });
      this.setState({
        deleteModal: false,
      });
    }
  };

  deleteData = async (index, designation) => {
    this.setState({
      deleteModal: true,
      deleteIndex: index,
      designation: designation,
    });
  };

  editDesignation = async () => {
    const { editIndex, departmentId, designation } = this.state;
    const allError = {};
    if (!designation) {
      allError.designation = "Designation Name is require";
    }
    if (!departmentId) {
      allError.department = "Department Name is require";
    }
    if (!departmentId || !designation) {
      this.setState({
        error: allError,
      });
      return;
    }
    const data = await editDesignationData(
      editIndex,
      departmentId,
      designation
    );
    if (data && data.success) {
      toast.success("Designation edit successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      this.fetchDesignation();
    } else {
      toast(`${data.message.response.data.error}`, {
        autoClose: ToastTimeout,
        type: toast.TYPE.ERROR,
      });
    }
    this.setState({
      addModal: false,
      error: {},
      departmentId: "",
      department: "",
      designation: "",
      editIndex: "",
    });
  };

  editDesignationData = async (id, departmentId, department, designation) => {
    this.setState({
      addModal: true,
      editIndex: id,
      departmentId: departmentId,
      designation: designation,
    });
  };

  onShowSizeChange = (page, pageSize) => {
    this.setState(
      {
        page,
        pageSize,
      },
      () => this.fetchDesignation()
    );
  };

  onPageChange = (page) => {
    this.setState(
      {
        page,
      },
      () => this.fetchDesignation()
    );
  };

  render() {
    const {
      designation,
      departmentList,
      list,
      addModal,
      departmentId,
      deleteModal,
      error,
      editIndex,
      totalDesignation,
      pageSize,
      page,
    } = this.state;
    const columns = [
      {
        title: "#",
        key: "title",
        render: (record, data, index) => <span>{index + 1}</span>,
      },
      {
        title: "Designation",
        key: "designation",
        dataIndex: "designationName",
        sorter: (a, b) => a.designationName.length - b.designationName.length,
      },
      {
        title: "Department",
        key: "departmentName",
        dataIndex: "departmentId[0].name",
        sorter: (a, b) =>
          a.departmentId[0].name.length - b.departmentId[0].name.length,
      },
      {
        title: "Action",
        key: "button",
        render: (record, data) => (
          <div>
            <Button
              size="sm"
              className="btn-behance btn-brand mr-1 mb-1"
              onClick={() =>
                this.editDesignationData(
                  data._id,
                  data.departmentId[0]._id,
                  data.departmentId[0].name,
                  data.designationName
                )
              }
            >
              <i className="fa fa-edit" />
              <span>Edit</span>
            </Button>
            <Button
              size="sm"
              className="btn-danger btn-brand mr-1 mb-1"
              onClick={() => this.deleteData(data._id, data.designationName)}
            >
              <i className="fa fa-trash-o" />
              <span>Remove</span>
            </Button>
          </div>
        ),
      },
    ];
    return (
      <div>
        <AddModal
          addModal={addModal}
          designation={designation}
          handleChange={this.handleChange}
          addDesignation={this.addDesignation}
          editDesignation={this.editDesignation}
          handleCancel={this.handleCancel}
          departmentList={departmentList}
          departmentId={departmentId}
          error={error}
          editIndex={editIndex}
        />
        <AlertModal
          visible={deleteModal}
          onConfirm={this.deleteDesignation}
          onCancel={this.handleCancel}
        >
          Are you sure to delete designation{" "}
          <span className="text-success">{designation}</span> ?
        </AlertModal>
        <div className="text-right">
          <Button
            block
            color="primary"
            className="btn-success btn-pill w-auto float-right pointer"
            onClick={this.designationModal}
          >
            <i className="fa fa-plus fa-lg" />
            &nbsp;&nbsp; Add Designation
          </Button>
          <br />
          <br />
        </div>
        <Table
          rowKey={(record) => record._id}
          pagination={{
            current: page,
            total: totalDesignation,
            defaultPageSize: pageSize,
            showSizeChanger: true,
            onShowSizeChange: this.onShowSizeChange,
            onChange: this.onPageChange,
            pageSizeOptions: ["10", "20", "30"],
          }}
          columns={columns}
          dataSource={list}
        />
      </div>
    );
  }
}

export default Designation;
