import React, {Component} from 'react'
import {toast} from "react-toastify";
import {Loader} from "../../globalutilities";
import {getBankInfo, updateBankInfo } from "../../actions/bankInformation";
import {Modal, ModalHeader, ModalFooter, Button, CardHeader, Input} from 'reactstrap';
import 'react-toastify/dist/ReactToastify.css';

class BankInformation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      bankInformation:{},
      editBankInfo: false,
      isNew:true
    }
  }
  toggle = () =>{
    this.setState(prevState => ({
      editBankInfo: !prevState.editBankInfo
    }));
  };

  updateBankInfo = async () =>{
    const data = this.state.bankInformation;
    data.employeeId = this.props._id;
    const res = await updateBankInfo(data);
    if (res.success) {
      toast.success(`Bank information updated successfully!`, {
        position: toast.POSITION.TOP_RIGHT
      });
      this.toggle()
    }else {
      toast.error(`something went wrong!`, {
        position: toast.POSITION.TOP_RIGHT
      });
      this.toggle()
    }
  };

  inputChange = (e) => {
    const {name, value} = e.target;
    this.setState(prevState => ({
      bankInformation: {
        ...prevState.bankInformation,
        [name]: value
      }
    }))
  };

  componentDidMount =  () => {
    this.setState({
      loading:true
    },async()=>{
      const bankInformation = await getBankInfo(this.props._id);
      if (bankInformation && bankInformation.length) {
        this.setState({bankInformation: bankInformation[0],loading:false, isNew:false})
      }else{
        this.setState({ isNew:true, loading:false})
      }
    })

  };

  render() {
    const {loading, bankInformation, isNew} = this.state;
    return (
      <>
          <div className="card">
          <CardHeader>
            <strong>Bank Information</strong>
            {" "}
              <div className="card-header-actions">

            { this.state.isNew ? <i onClick={this.toggle} className="cui-note icons"/> : <i onClick={this.toggle} className="cui-pencil icons "/>}
              </div>
          </CardHeader>
          {loading ? <Loader/> : null}
          { !isNew &&
          <div className="card-body">
            <div className="row">
              <div className="col-md-5 col-sm-6">
                <label>Bank Name</label>
              </div>
              <div className= "col-md-7 col-sm-6">
                <p>{bankInformation.bankName}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-5 col-sm-6">
                <label>Account No</label>
              </div>
              <div className="col-md-7 col-sm-6">
                <p>{bankInformation.bankAccountNo}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-5 col-sm-6">
                <label>IFSC Code</label>
              </div>
              <div className="col-md-7 col-sm-6">
                <p>{bankInformation.ifscCode}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-5 col-sm-6">
                <label>PAN No</label>
              </div>
              <div className="col-md-7 col-sm-6">
                <p>{bankInformation.panNo}</p>
              </div>
            </div>
          </div>}
          </div>

        <Modal isOpen={this.state.editBankInfo} toggle={this.toggle}  >
          <ModalHeader toggle={this.toggle}>Bank Information</ModalHeader>
          <div className="card-body">
            <div className="row mb-2">
              <div className="col-md-4">
                <label>Bank Name</label>
              </div>
              <div className="col-md-6">
                <Input type="text" name="bankName" value={bankInformation.bankName} onChange={this.inputChange} />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-md-4">
                <label>Account No</label>
              </div>
              <div className="col-md-6">
                <Input type="text" name="bankAccountNo" value={bankInformation.bankAccountNo} onChange={this.inputChange}/>
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-md-4">
                <label>IFSC Code</label>
              </div>
              <div className="col-md-6">
                <Input type="text" name="ifscCode" value={bankInformation.ifscCode} onChange={this.inputChange}/>
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-md-4">
                <label>PAN No</label>
              </div>
              <div className="col-md-6">
                <Input type="text" name="panNo" value={bankInformation.panNo} onChange={this.inputChange} />
              </div>
            </div>
          </div>
          <ModalFooter>
            <Button color="primary" onClick={this.updateBankInfo}>Submit</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </>
    )
  }
}

export default BankInformation
