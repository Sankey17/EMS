import React, {Component} from "react";
import {Nav} from "reactstrap";
import PropTypes from "prop-types";
import HeaderDropdown from './HeaderDropdown'

import {
  AppHeaderDropdown,
  AppNavbarBrand,
  AppSidebarToggler
} from "@coreui/react";

import logo from "../../assets/img/brand/bvmlogo.png";
import miniLogo from "../../assets/img/brand/favicon.ico";
import {qualificationValue} from "../../globalutilities";

const propTypes = {
  children: PropTypes.node
};

const defaultProps = {};

class DefaultHeader extends Component {


  render() {
    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile/>
        <AppNavbarBrand
          full={{src: logo, width: 120, height: 60, alt: "BVM Logo"}}
          minimized={{src: miniLogo, width: 30, height: 30, alt: "BVM Logo"}}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg"/>
        <Nav className="ml-auto" navbar>
          <AppHeaderDropdown>
            <Nav className="ml-auto" navbar>
              <select
                className="form-control"
                name="academyCompanyToggle"
                id="academyCompanyToggle"
                required
                onChange={this.props.onHandleCompanyAcademy}
              > <option key="company" value="company">
                Company
              </option>
                <option key="academy" value="academy">
                  Academy
                </option>

                );
                })}
              </select>
              <HeaderDropdown onLogout={this.props.onLogout}
                              onResetPassword={this.props.onResetPassword}
                              onProfile={this.props.userprofile} accnt/>
            </Nav>
          </AppHeaderDropdown>
        </Nav>
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
