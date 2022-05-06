import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {Button, Input, InputNumber, Select} from "antd";
import {Loader} from "../../globalutilities";
import {creatWorkReport, getUserReported} from "../../actions";

const {Option} = Select;

const WorkReportForm = (props) => {

  const initialFormValue = {
    project: undefined,
    task: undefined,
    hours: undefined,
    minutes: undefined,
    status: undefined
  };

  const [formDetails, setFormDetails] = useState(initialFormValue);
  const [lord, setLord] = useState(false)
  const [disable, setDisable] = useState(true);
  const [invalidField, setInvalidField] = useState(["project", "task", "hours", "minutes", "status"]);

  const checkValidation = (value, key) => {
    if (value === undefined || value === null || value === "") {
      return false
    }
    switch (key) {
      case "project":
        break;
      case "task":
        break;
      case "hours":
        break;
      case "minutes":
        break;
      case "status":
        break;
      default:
        break
    }
    return true
  };

  const onChangeHandler = (value, key) => {
    if (checkValidation(value, key)) {
      setInvalidField(fields => fields.filter(name => name !== key))
    } else {
      setInvalidField(fields => fields.includes(key) ? fields : fields.push(key) && fields)
    }
    setFormDetails(oldData => {
      return {...oldData, [key]: value}
    })
  };
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLord(true);
    const response = await creatWorkReport(formDetails)
    setLord(false);
    if (response.success) {
      props.history.goBack()
    } else {
      alert(response.message)
    }
  };
  const onCancelHandler = () => {
    props.history.goBack()
  };

  useEffect(() => {
    setDisable(() => invalidField.length !== 0)
  }, [invalidField]);

  useEffect(() => {
    if (props.token.auth._id) {
      const result = async () => await getUserReported()
      if (result && result.data && result.data.length !== 0) {
        props.history.goBack()
      }
    }
  }, [props.token.auth])

  return (
    <div>
      {lord ? <Loader/> : null}
      <div className={'container d-flex justify-content-center'}>
        <form className={"col-md-8 col-sm-12"}>
          <div className="form-group">
            <label>Project</label>
            <Select name="project" placeholder="Select a Project"
                    onChange={(value) => onChangeHandler(value, "project")}
                    allowClear>
              <Option value="Project 1">Project 1</Option>
              <Option value="Project 2">Project 2</Option>
              <Option value="Project 3">Project 3</Option>
              <Option value="Project 4">Project 4</Option>
              <Option value="Project 5">Project 5</Option>
            </Select>
          </div>
          <div className="form-group">
            <label>Task</label>
            <Input.TextArea rows={4} onChange={(e) => onChangeHandler(e.target.value, "task")} required={true}/>
          </div>
          <div className="form-row" style={{gap: "10px"}}>
            <div className="form-group d-flex align-items-center" style={{gap: "10px"}}>
              <label>Hours</label>
              <InputNumber min={0} max={24} onChange={(value) => onChangeHandler(value, "hours")}/>
            </div>
            <div className="form-group d-flex align-items-center" style={{gap: "10px"}}>
              <label>Minutes</label>
              <InputNumber min={0} max={60} onChange={(value) => onChangeHandler(value, "minutes")}/>
            </div>
          </div>
          <div className="form-group">
            <label>Status</label>
            <Select placeholder="Select a Status" allowClear onChange={(value) => onChangeHandler(value, "status")}>
              <Option value="Complete">Complete</Option>
              <Option value="In Progress">In Progress</Option>
            </Select>
          </div>
          <Button type="primary" htmlType="submit" style={{marginRight: '10px'}} onClick={onSubmitHandler}
                  disabled={disable}>
            Create Work Report
          </Button>
          <Button htmlType="button" onClick={onCancelHandler}>
            Cancel
          </Button>
        </form>
      </div>
    </div>
  )
};

const mapStateToProps = (state) => {
  return {
    token: state
  }
};

export default connect(mapStateToProps)(WorkReportForm);
