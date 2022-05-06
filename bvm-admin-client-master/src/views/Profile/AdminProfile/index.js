import React, {Component} from 'react'
import {connect} from 'react-redux'
import {CardHeader} from "reactstrap";
import {findEmployeeEmail} from "../../../actions";
import {Loader} from "../../../globalutilities";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      id: this.props.token.auth._id,
      photo: this.props.token.auth.photo
    }
  }

  componentDidMount =  () => {
    const {id} = this.state;
    this.setState({loading:true},async()=>{
      const res = await findEmployeeEmail(id);
      if (res && res.data && res.data.length) {
        this.setState({data: res.data[0],loading:false})
      }else{
        this.setState({loading:false})
      }
    })

  };

  editProfile = () => {
    this.props.history.push("/editprofile")
  };

  render() {
    const {data, loading} = this.state;
    return (
      <div>
        <div className="card">
          <CardHeader>
            <strong className="mr-sm-auto ">Profile Details</strong>
            <button className="btn btn-primary psss" style={{marginleft: "860px"}} onClick={this.editProfile}>Edit
              profile
            </button>
          </CardHeader>
          {loading ? <Loader/> : null}
          <div className="card-body bg-secondary">
            <div className="all">
              <div className="container emp-profile ">
                <div className="row mr-auto mr-auto">
                  <div className="col-md-4">
                    <img src={data.photo} className="pointer" alt="profile" width="110"/>
                  </div>
                  <div className="col-md-8 ">
                    <div className="tab-content profile-tab " id="myTabContent ">
                      <div className="tab-pane fade show active mr-auto" id="home" role="tabpanel"
                           aria-labelledby="home-tab">
                        <div className="row">
                          <div className="col-md-6">
                            <label>Name</label>
                          </div>
                          <div className="col-md-6">
                            <p>{data.username}</p>
                          </div>
                        </div>
                        <hr/>
                        <div className="row">
                          <div className="col-md-6">
                            <label>Email</label>
                          </div>
                          <div className="col-md-6">
                            <p>{data.userEmailId}</p>
                          </div>
                        </div>
                        <hr/>
                        <div className="row">
                          <div className="col-md-6">
                            <label>Mobile No</label>
                          </div>
                          <div className="col-md-6">
                            <p>{data.phone}</p>
                          </div>
                        </div>
                        <hr/>
                        <div className="row">
                          <div className="col-md-6">
                            <label>Gender</label>
                          </div>
                          <div className="col-md-6">
                            <p>{data.gender}</p>
                          </div>
                        </div>
                        <hr/>
                        <div className="row">
                          <div className="col-md-6">
                            <label>Country</label>
                          </div>
                          <div className="col-md-6">
                            <p>{data.country}</p>
                          </div>
                        </div>
                        <hr/>
                        <div className="row">
                          <div className="col-md-6">
                            <label>State</label>
                          </div>
                          <div className="col-md-6">
                            <p>{data.state}</p>
                          </div>
                        </div>
                        <hr/>
                        <div className="row">
                          <div className="col-md-6">
                            <label>City</label>
                          </div>
                          <div className="col-md-6">
                            <p>{data.city}</p>
                          </div>
                        </div>
                        <hr/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    token: state
  }
};


export default connect(mapStateToProps)(Profile)
