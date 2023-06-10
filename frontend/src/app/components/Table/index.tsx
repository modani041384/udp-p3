import * as React from 'react';
import { Component } from 'react';
import classNames from 'classnames';
import ReactTable, { Column, SortingRule } from 'react-table';

import appstyle from '../../style.local.css';
import style from './react-table.css';
import '../../style.local.css';
import './react-table.css';

export namespace Table {
  export interface Props {
    data: ReadonlyArray<any>;
    loading: boolean;
    columns: Column[];
    headerStyle?: React.CSSProperties;
    style?: React.CSSProperties;
    defaultSorted: SortingRule[];
    onFilter(searchText: string): any;
    onToggleArchive(showActive: boolean): any;
  }

  export interface State {
    typingTimeout: NodeJS.Timer | number;
    searchText: string;
    showActiveEmployees: boolean;
  }
}

export class Table extends Component<Table.Props, Table.State> {
  constructor(props: Table.Props, context?: any) {
    super(props, context);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.state = {
      typingTimeout: 0,
      searchText: '',
      showActiveEmployees: true,
    };
  }

  tableClasses() {
    return classNames({
      [style.ReactTable]: true,
      'table-large': true,
      '-highlight': true,
      '-striped': true,
    });
  }

  getHeadersStyle = () => ({ style: { ...(this.props.headerStyle || {}) } });

  textStyle: React.CSSProperties = {
    fontFamily: 'Mukta, Helvetica, Roboto, Arial, sans-serif',
    color: '#4f4f4f',
  };

  handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout as NodeJS.Timer);
    }
    this.setState({
      searchText: event.target.value,
      typingTimeout: setTimeout(() => {
        const searchText = this.state.searchText;
        const shouldResetSearch = searchText.length === 0;
        if (searchText.length >= 2 || shouldResetSearch) {
          this.props.onFilter(this.state.searchText);
        }
      }, 500),
    });
  }

  toggleTab = (e: any) => {
    e.preventDefault();
    if (this.state.showActiveEmployees) return;
    this.setState({
      showActiveEmployees: true,
    });
    this.props.onToggleArchive(this.state.showActiveEmployees);
  }

  toggleArchiveTab = (e: any) => {
    e.preventDefault();
    if (!this.state.showActiveEmployees) return;
    this.setState({
      showActiveEmployees: false,
    });
    this.props.onToggleArchive(this.state.showActiveEmployees);
  }

  render() {
    const { data, columns, loading, defaultSorted } = this.props;
    return (
      <div
        className={`
        ${appstyle['g-content-fluid']} ${appstyle['table-container']} ${
          appstyle['grid-container']
        } ${appstyle.fluid} ${appstyle['grid-padding-x']} ${appstyle.full}
        `}
        style={this.textStyle}
      >
        <form>
          <div
            className={`
            ${appstyle['grid-x']}
            ${appstyle['grid-padding-x']}
            ${appstyle['table-controls']}`}
          >
            <div
              className={`${appstyle.cell} ${appstyle['medium-12']} ${
                appstyle['small-12']
              } ${appstyle['large-8']}`}
            >
              <ul className={`${appstyle.tabs}`} data-tabs='emp-list-control'>
                <li
                  className={`${appstyle['tabs-title']} ${
                    appstyle[this.state.showActiveEmployees ? 'is-active' : '']
                  }`}
                >
                  <a href='#' onClick={this.toggleTab}>
                    Active
                  </a>
                </li>
                <li
                  className={`${appstyle['tabs-title']} ${
                    appstyle[this.state.showActiveEmployees ? '' : 'is-active']
                  }`}
                >
                  <a href='#' onClick={this.toggleArchiveTab}>
                    Archived
                  </a>
                </li>
              </ul>
              <div className={`${appstyle['cont-table-filters']}`}>
                <div
                  className={`${appstyle['input-group']}`}
                  style={{ marginBottom: 0 }}
                >
                  <input
                    type='text'
                    placeholder='Type to filter...'
                    value={this.state.searchText}
                    onChange={this.handleInputChange}
                  />
                  <div className={`${appstyle['input-group-button']}`}>
                    <button className={`${appstyle.hollow}`}>
                      <i
                        className={`${appstyle.icon} ${appstyle['i-search']}`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`${appstyle.cell} ${appstyle['medium-12']} ${
                appstyle['small-12']
              } ${appstyle['large-4']} ${appstyle['text-right']}`}
            />
          </div>
          <div className={`${appstyle['g-main']}`}>
            <ReactTable
              data={data as any[]}
              pageSize={data.length}
              className={`${this.tableClasses()} ${appstyle.hover} ${
                appstyle['table-large']
              }`}
              getTheadThProps={() => ({
                ...this.getHeadersStyle(),
              })}
              columns={columns}
              noDataText=''
              showPagination={false}
              loading={loading}
              defaultSorted={defaultSorted}
              multiSort={true}
            />
          </div>

          <!--data -->
          <div
              className={`${style['g-main']} ${style['grid-x']} ${style['grid-margin-x']}`}
            >
              <div
                className={`${style.cell} ${style['medium-4']} ${style['large-3']}`}
              >
                <div className={style['cont-gravatar']}>
                  <Gravatar
                    email={this.state.companyEmail}
                    size={150}
                    className={style['e-avatar-empty']}
                  />
                </div>
                <h5 style={this.textStyle}>tags</h5>
                <div className={style['cont-tags']}>
                  <ul className={style['e-tags-list']}>
                    {this.state.tags.map((name, index) => {
                      return (
                        <li key={index}>
                          <span className={style['e-tag']}>{name}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              <div
                className={`${style.cell} ${style['medium-6']} ${style['large-6']}`}
              >
                <div className={style['input-cell']}>
                  <label htmlFor='displayname'>Display Name</label>
                  <div className={`${style['read-input']} ${style.big}`}>
                    modani
                  </div>
                </div>
                <div className={`${style['grid-x']} ${style['grid-margin-x']}`}>
                  <div
                    className={`${style.cell} ${style['small-12']} ${style['medium-6']}`}
                  >
                    <div className={style['input-cell']}>
                      <label htmlFor='firstname'>First Name</label>
                      <div className={`${style['read-input']}`}>
                        mo
                      </div>
                    </div>
                  </div>

                  <div
                    className={`${style.cell} ${style['small-12']} ${style['medium-6']}`}
                  >
                    <div className={style['input-cell']}>
                      <label htmlFor='middlename'>Middle name</label>
                      <div className={`${style['read-input']}`}>
                        da
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`${style['grid-x']} ${style['grid-margin-x']}`}>
                  <div
                    className={`${style.cell} ${style['small-12']} ${style['medium-6']}`}
                  >
                    <div className={style['input-cell']}>
                      <label htmlFor='lastname'>Last Name</label>
                      <div className={`${style['read-input']}`}>
                        ni
                      </div>
                    </div>
                  </div>
                  <div
                    className={`${style.cell} ${style['small-12']} ${style['medium-6']}`}
                  >
                    <div className={style['input-cell']}>
                      <label htmlFor='secondlastname'>Second Last Name</label>
                      <div className={`${style['read-input']}`}>
                        modani
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`${style['grid-x']} ${style['grid-margin-x']}`}>
                  <div
                    className={`${style.cell} ${style['small-12']} ${style['medium-6']}`}
                  >
                    <div className={style['input-cell']}>
                      <label htmlFor='lastname'>Gender</label>
                      <div className={`${style['read-input']}`}>
                        Male
                      </div>
                    </div>
                  </div>
                  <div
                    className={`${style.cell} ${style['small-12']} ${style['medium-6']}`}
                  >
                    <div className={style['input-cell']}>
                      <label htmlFor='secondlastname'>Start Date</label>
                      <div className={`${style['read-input']}`}>
                        22/04/2009
                      </div>
                    </div>
                  </div>
                </div>

                <h5 style={this.textStyle}>Salary</h5>
                <div className={style['input-cell']}>
                  <div className={`${style['read-input']}`}>
                    
                  </div>
                </div>
                <div className={`${style['grid-x']} ${style['grid-margin-x']}`}>
                  <div
                    className={`${style.cell} ${style['small-12']} ${style['medium-6']}`}
                  >
                    <div className={style['input-cell']}>
                      <label htmlFor='salary'>Amount</label>
                      <div className={style['input-group']}>
                        <span>$</span>
                        <div className={`${style['read-input']}`}>
                        
                        </div>
                        <label className={style['medium-gray']}>
                          
                        </label>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`${style.cell} ${style['small-12']} ${style['medium-6']}`}
                  >
                    <label htmlFor='effectiveDate'>Effective Date</label>
                    <div className={`${style['read-input']}`}>
                      13/04/1984
                    </div>
                  </div>
                </div>
                <h5 style={this.textStyle}>Contact info</h5>
                <div className={`${style['grid-x']} ${style['grid-margin-x']}`}>
                  <div
                    className={`${style.cell} ${style['small-12']} ${style['medium-6']}`}
                  >
                    <div className={style['input-cell']}>
                      <label htmlFor='companyEmail'>Company Email Address</label>
                      <div className={`${style['read-input']}`}>
                       nimd1@fpt.com
                      </div>
                    </div>
                  </div>
                  <div
                    className={`${style.cell} ${style['small-12']} ${style['medium-6']}`}
                  >
                    <div className={style['input-cell']}>
                      <label htmlFor='personalEmail'>
                        Personal Email Address
                      </label>
                      <div className={`${style['read-input']}`}>
                        nimd1@fpt.com
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`${style['grid-x']} ${style['grid-margin-x']}`}>
                  <div
                    className={`${style.cell} ${style['small-12']} ${style['medium-6']}`}
                  >
                    <div className={style['input-cell']}>
                      <label htmlFor='phoneNumber'>Phone Number</label>
                      <div className={`${style['read-input']}`}>
                        077796********
                      </div>
                    </div>
                  </div>
                  <div
                    className={`${style.cell} ${style['small-12']} ${style['medium-6']}`}
                  >
                    <div className={style['input-cell']}>
                      <label htmlFor='birthdate'>Birthday</label>
                      <div className={`${style['read-input']}`}>
                        13/04/1984
                      </div>
                    </div>
                  </div>
                </div>

                <h5 style={this.textStyle}>Bank Information</h5>
                <div className={`${style['grid-x']} ${style['grid-margin-x']}`}>
                  <div
                    className={`${style.cell} ${style['small-12']} ${style['medium-6']}`}
                  >
                    <div className={style['input-cell']}>
                      <label htmlFor='bankName'>Bank Name</label>
                      <div className={`${style['read-input']}`}>
                        Tien Phong bank
                      </div>
                    </div>
                  </div>
                  <div
                    className={`${style.cell} ${style['small-12']} ${style['medium-6']}`}
                  >
                    <div className={style['input-cell']}>
                      <label htmlFor='accountNumber'>Account Number</label>
                      <div className={`${style['read-input']}`}>
                        0778*******
                      </div>
                    </div>
                  </div>
                </div>

                <h5 style={this.textStyle}>Address</h5>
                <div
                  className={`${style.cell} ${style['small-12']} ${style['medium-8']} ${style['large-9']}`}
                >
                  <div className={style['input-cell']}>
                    <label htmlFor='addressLine'>Address line</label>
                    <div className={`${style['read-input']}`}>
                      719/2 Hoang Sa
                    </div>
                  </div>
                  <div
                    className={`${style['grid-x']} ${style['grid-margin-x']}`}
                  >
                    <div
                      className={`${style.cell} ${style['small-12']} ${style['medium-6']}`}
                    >
                      <div className={style['input-cell']}>
                        <label htmlFor='country'>Country</label>
                        <div className={`${style['read-input']}`}>
                          Ho chi minh
                        </div>
                      </div>
                    </div>
                    <div
                      className={`${style.cell} ${style['small-12']} ${style['medium-6']}`}
                    >
                      <div className={style['input-cell']}>
                        <label htmlFor='region'>State/Province</label>
                        <div className={`${style['read-input']}`}>
                          Quan 3
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`${style.cell} ${style['small-12']} ${style['medium-6']}`}
                  >
                    <div className={style['input-cell']}>
                      <label htmlFor='city'>City</label>
                      <div className={`${style['read-input']}`}>
                        Ho chi minh
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={`${style.cell} ${style['medium-2']} ${style['large-3']}`}
              >
                <div className={style['e-emp-status']}>
                  <label htmlFor='displayname'></label>
                  <div/>
                  <div className={`${style['read-input']}`}>
                    <div className={`${style['read-input']}`}>
                      Active
                    </div>
                  </div>
                </div>
              </div>
            </div> 

        </form>
      </div>
    );
  }
}
