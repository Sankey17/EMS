import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import {connect} from 'react-redux'
import photo from "../../assets/img/download.png"

const propTypes = {
  accnt: PropTypes.bool
};
const defaultProps = {
  accnt: false
};

class HeaderDropdown extends Component {

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
      pic:this.props.token.auth.photo || ""
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  dropAccnt() {
    const {  onProfile, onLogout, onResetPassword } =  this.props
    const {dropdownOpen,pic} = this.state;
    return (
      <Dropdown nav isOpen={dropdownOpen} toggle={this.toggle}>
        <DropdownToggle nav>
          {
            pic ? <img src={this.state.pic} className="img-avatar" width="40" alt="profile"/>
                : <img src={photo} className="img-avatar" width="40" alt="profile"/>
          }
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem onClick={onProfile}><i className="fa fa-user"/> Profile</DropdownItem>
          <DropdownItem onClick={onResetPassword}><i className="fa fa-shield"/> Reset Password</DropdownItem>
          <DropdownItem onClick={onLogout}><i className="fa fa-lock"/> Logout</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }

  render() {
    const {  accnt } = this.props;
    return (
        accnt ? this.dropAccnt() :null
    );
  }
}

HeaderDropdown.propTypes = propTypes;
HeaderDropdown.defaultProps = defaultProps;


const mapStateToProps = (state) => {
  return {
    token: state
  }
};

export default connect(mapStateToProps)(HeaderDropdown);
