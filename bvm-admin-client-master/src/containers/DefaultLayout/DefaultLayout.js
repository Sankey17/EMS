import React, {Component, Suspense} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {Container} from 'reactstrap';
import {Modal} from 'antd';
import {connect} from 'react-redux'
import {ToastContainer} from "react-toastify"
import {
  AppAside,
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import {academy,company} from '../../Navigation/_nav';
import navigation2 from '../../Navigation/_nav2';
// routes config
import {routesAcademy,routesCompany, routes2} from '../../routes';
import {signOut} from "../../Services/actions/auth";
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

class DefaultLayout extends Component {

  constructor(props) {
    super(props);
    this.state = {
      Text: "",
      visible: false,
      toggleCompanyAcademy: company,
      toggleRoutes: routesCompany,
    }

  }

  handleCompanyAcademy = (e) => {
    if (e.target.value === "company") {
      this.setState({toggleCompanyAcademy: company, toggleRoutes:routesCompany});
    }
    else {
      this.setState({toggleCompanyAcademy: academy, toggleRoutes:routesAcademy});
    }

  };
  componentWillMount() {
    const {role} = this.props.auth || {};
    if(role){
      this.setState({
        role:role
      })
    }
  }

  handleOk = () => {
    signOut()
  };

  handleCancel= () => {
    this.setState({
      visible: false,
    });
  };

  showModal = () => {
    this.setState({
      Text: "Are you sure for logout?",
      visible: true,
    });
  };

  warning = () => {
    Modal.success({
      content: `check your mail and reset your password`,
    });
  };

  loading = () => <div className="animated fadeIn pt-1 text-center">
    <div className="sk-spinner sk-spinner-pulse"/>
  </div>;

  signOut = () => {
    this.showModal()
  };

  profile = () => {
    this.props.history.push('/editprofile')
  };

  onResetPassword = async () => {
    this.props.history.push('/resetpassword')
  };

  render() {
    const {Text, visible, toggleRoutes} = this.state;
    const {role} = this.props.auth || {};
    return (
      <div className="app">
        <ToastContainer position="top-right" autoClose={3000} style={{zIndex: 1999}}/>
        <AppHeader fixed>
          <Suspense fallback={this.loading()}>
            <DefaultHeader userprofile={this.profile} onLogout={this.signOut} onResetPassword={this.onResetPassword} onHandleCompanyAcademy={this.handleCompanyAcademy}/>
          </Suspense>
        </AppHeader>
        <Modal
          className="modal-dialog modal-sm"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>{Text}</p>
        </Modal>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader/>
            <AppSidebarForm/>
            <Suspense>
              {role === "admin"
                ? <AppSidebarNav navConfig={this.state.toggleCompanyAcademy} {...this.props} />
                : <AppSidebarNav navConfig={navigation2} {...this.props} />
              }
            </Suspense>
            <AppSidebarFooter/>
            <AppSidebarMinimizer/>
          </AppSidebar>
          <main className="main">
            {role === "admin"
              ? <AppBreadcrumb appRoutes={toggleRoutes}/>
              : <AppBreadcrumb appRoutes={routes2}/>
            }
            <Container fluid>
              <Suspense fallback={this.loading()}>
                <Switch>
                  {role === "admin"
                    ? toggleRoutes.map((route, idx) => {
                      return route.component ? (
                        <Route
                          key={idx}
                          path={route.path}
                          exact={route.exact}
                          name={route.name}
                          render={props => (
                            <route.component {...props} />
                          )}/>
                      ) : (null);
                    })
                    : routes2.map((route, idx) => {
                      return route.component ? (
                        <Route
                          key={idx}
                          path={route.path}
                          exact={route.exact}
                          name={route.name}
                          render={props => (
                            <route.component {...props} />
                          )}/>
                      ) : (null);
                    })
                  }
                  {}
                  <Redirect from="/" to="/dashboard"/>
                </Switch>
              </Suspense>
            </Container>
          </main>
          <AppAside fixed>
            <Suspense fallback={this.loading()}>
            </Suspense>
          </AppAside>
        </div>
        <AppFooter>
          <Suspense fallback={this.loading()}>
            <DefaultFooter/>
          </Suspense>
        </AppFooter>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth || {}
  }
};

export default connect(mapStateToProps)(DefaultLayout);
