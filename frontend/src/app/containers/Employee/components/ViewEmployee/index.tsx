import React, { Component } from 'react';

import 'react-datepicker/dist/react-datepicker.css';
import { EmployeeModel, SalaryType, Gender } from '../../models/EmployeeModel';
import { EmployeeState } from '../../reducer/state';
import { EmployeeActions } from '../../actions';
import { Dispatch, bindActionCreators } from 'redux';
import { omit } from 'app/utils';
import { connect } from 'react-redux';
import '../../../../style.local.css';
import style from '../../../../style.local.css';
import { EmployeesService } from '../../services';
import { RouteComponentProps } from 'react-router';
//import { SearchInput, Breadcrumb, SearchBar, Button } from 'app/components';
import { SearchInput, SearchBar } from 'app/components';

export namespace ViewEmployee {
  export interface Props extends RouteComponentProps<RoutePayload> {
    employees: EmployeeModel[];
    actions: EmployeeActions;
    isFetching: boolean;
    errorMessage: string;
    searchText: string;
  }

  export interface RoutePayload {
    employeeId: any;
  }

  export interface State {
    employeeId: string;
    firstName: string;
    middleName: string;
    lastName: string;
    secondLastName: string;
    displayName: string;
    companyEmail: string;
    personalEmail: string;
    birthdate: Date;
    phoneNumber: string;
    address: string;
    tags: any[];
    country: string;
    region: string;
    city: string;
    salary: number;
    salaryType: SalaryType;
    effectiveDate: Date;
    isActive: boolean;
    gender: Gender;
    startDate: Date;
    bankName: string;
    accountNumber: string;
  }
}

export class ViewEmployee extends Component<
  ViewEmployee.Props,
  ViewEmployee.State
> {
  private employeeService: EmployeesService;
  constructor(props: ViewEmployee.Props, context?: any) {
    super(props, context);

    const { employeeId } = this.props.match.params;
    this.employeeService = new EmployeesService();
    this.state = {
      employeeId,
      firstName: '',
      lastName: '',
      middleName: '',
      secondLastName: '',
      displayName: '',
      companyEmail: '',
      personalEmail: '',
      phoneNumber: '',
      address: '',
      birthdate: new Date(),
      tags: [],
      country: '',
      region: '',
      city: '',
      salary: 0,
      salaryType: SalaryType.YEARLY,
      effectiveDate: new Date(),
      isActive: true,
      gender: Gender.MALE,
      startDate: new Date(),
      bankName: '',
      accountNumber: '',
    };
  }

  async componentDidMount() {
    try {
      const employee: EmployeeModel = await this.employeeService.getEmployeeById(
        this.state.employeeId,
      );
      this.setState({
        firstName: employee.firstName,
        lastName: employee.lastName,
        middleName: employee.middleName,
        secondLastName: employee.secondLastName,
        displayName: employee.displayName,
        companyEmail: employee.companyEmail,
        personalEmail: employee.personalEmail,
        phoneNumber: employee.phoneNumber,
        address: employee.address,
        birthdate: new Date(employee.birthdate),
        tags: JSON.parse(employee.tags),
        country: employee.country,
        region: employee.region,
        city: employee.city,
        salary: employee.salary,
        salaryType: employee.salaryType,
        effectiveDate: employee.effectiveDate,
        isActive: employee.isActive,
        gender: employee.gender,
        startDate: employee.startDate,
        bankName: employee.bankName,
        accountNumber: employee.accountNumber,
      });
    } catch (err) {
      this.props.history.push('/employees');
    }
  }

  handleSearch = (searchText: string) => {};

  containerStyle: React.CSSProperties = {
    textAlign: 'center',
  };

  textStyle: React.CSSProperties = {
    fontFamily: 'Mukta, Helvetica, Roboto, Arial, sans-serif',
  };

  goBackToEmployees = () => {
    this.props.history.push('/employees');
  }

  goToEditEmployee = () => {
    this.props.history.push(`/employees/${this.state.employeeId}/edit`);
  }

  thirdLevelBreadcrumb: React.CSSProperties = {
    cursor: 'default',
    textDecoration: 'none',
  };

  render() {
    const { isFetching, searchText } = this.props;

    const generalSearch = (
      <SearchInput
        isFetching={isFetching}
        searchText={searchText}
        onSearchChange={this.handleSearch}
        placeholder='Search in the app'
        title='General Search'
      />
    );

    return (
      <div className={`${style['g-container']} ${style.fluid}`}>
        <SearchBar searchInput={generalSearch} />
        <br></br>
        <table>
          <tbody>
            <th>Display name</th>
            <th>Last name</th>
            <th>Email</th>
            <th>Tags</th>
            <th>Birthdate</th>
            <th>Start Date</th>
            <th>Action</th>
          </tbody>
          <tr>
            <td>Modani</td>
            <td>Ni</td>
            <td>nimd1@fpt.com</td>
            <td></td>
            <td>13/04/1984</td>
            <td>12/03/2009</td>
            <td></td>
          </tr>
        </table>
      </div>
    );
  }
}

function mapStateToProps(state: EmployeeState): Partial<ViewEmployee.Props> {
  return {
    employees: state.employees,
    isFetching: state.isFetching,
    errorMessage: state.errorMessage,
  };
}

function mapActionsToProps(
  dispatch: Dispatch,
): Pick<ViewEmployee.Props, 'actions'> {
  return {
    actions: bindActionCreators(omit(EmployeeActions, 'Type'), dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapActionsToProps,
)(ViewEmployee as any);
