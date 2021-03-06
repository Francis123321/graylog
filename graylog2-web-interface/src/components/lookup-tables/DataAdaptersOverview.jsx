/*
 * Copyright (C) 2020 Graylog, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the Server Side Public License, version 1,
 * as published by MongoDB, Inc.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * Server Side Public License for more details.
 *
 * You should have received a copy of the Server Side Public License
 * along with this program. If not, see
 * <http://www.mongodb.com/licensing/server-side-public-license>.
 */
import PropTypes from 'prop-types';
import React from 'react';

import { LinkContainer } from 'components/graylog/router';
import { Row, Col, Table, Popover, OverlayTrigger, Button } from 'components/graylog';
import { PaginatedList, SearchForm, Spinner, Icon } from 'components/common';
import DataAdapterTableEntry from 'components/lookup-tables/DataAdapterTableEntry';
import Routes from 'routing/Routes';
import CombinedProvider from 'injection/CombinedProvider';

import Styles from './Overview.css';

const { LookupTableDataAdaptersActions } = CombinedProvider.get('LookupTableDataAdapters');

class DataAdaptersOverview extends React.Component {
  static propTypes = {
    dataAdapters: PropTypes.array.isRequired,
    pagination: PropTypes.object.isRequired,
    errorStates: PropTypes.object.isRequired,
  };

  _onPageChange = (newPage, newPerPage) => {
    const { pagination } = this.props;

    LookupTableDataAdaptersActions.searchPaginated(newPage, newPerPage, pagination.query);
  };

  _onSearch = (query, resetLoadingStateCb) => {
    const { pagination } = this.props;

    LookupTableDataAdaptersActions
      .searchPaginated(pagination.page, pagination.per_page, query)
      .then(resetLoadingStateCb);
  };

  _onReset = () => {
    const { pagination } = this.props;

    LookupTableDataAdaptersActions.searchPaginated(pagination.page, pagination.per_page);
  };

  _helpPopover = () => {
    return (
      <Popover id="search-query-help" className={Styles.popoverWide} title="??????????????????">
        <p><strong>?????????????????????</strong></p>
        <Table condensed>
          <thead>
            <tr>
              <th>??????</th>
              <th>??????</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>id</td>
              <td>??????????????? ID</td>
            </tr>
            <tr>
              <td>??????</td>
              <td>????????????????????????</td>
            </tr>
            <tr>
              <td>??????</td>
              <td>??????????????????????????????</td>
            </tr>
            <tr>
              <td>??????</td>
              <td>?????????????????????</td>
            </tr>
          </tbody>
        </Table>
        <p><strong>??????</strong></p>
        <p>
          ?????????????????????????????????????????????<br />
          <kbd>??????:geoip</kbd><br />
          <kbd>??????:geo</kbd>
        </p>
        <p>
          ?????????????????????????????? <code>??????</code> ???????????????<br />
          <kbd>geoip</kbd> <br />????????????<br />
          <kbd>??????:geoip</kbd>
        </p>
      </Popover>
    );
  };

  render() {
    const { dataAdapters, errorStates, pagination } = this.props;

    if (!dataAdapters) {
      return <Spinner text="Loading data adapters" />;
    }

    const dataAdapterEntries = dataAdapters.map((dataAdapter) => {
      return (
        <DataAdapterTableEntry key={dataAdapter.id}
                               adapter={dataAdapter}
                               error={errorStates.dataAdapters[dataAdapter.name]} />
      );
    });

    return (
      <div>
        <Row className="content">
          <Col md={12}>
            <h2>
              ??????????????????????????????
              <span>&nbsp;
                <small>??????{pagination.total}</small>
              </span>
            </h2>
            <PaginatedList onChange={this._onPageChange} totalItems={pagination.total}>
              <SearchForm onSearch={this._onSearch} onReset={this._onReset} useLoadingState>
                <LinkContainer to={Routes.SYSTEM.LOOKUPTABLES.DATA_ADAPTERS.CREATE}>
                  <Button bsStyle="success" style={{ marginLeft: 5 }}>?????????????????????</Button>
                </LinkContainer>
                <OverlayTrigger trigger="click" rootClose placement="right" overlay={this._helpPopover()}>
                  <Button bsStyle="link" className={Styles.searchHelpButton}><Icon name="question-circle" fixedWidth /></Button>
                </OverlayTrigger>
              </SearchForm>
              <Table condensed hover className={Styles.overviewTable}>
                <thead>
                  <tr>
                    <th className={Styles.rowTitle}>??????</th>
                    <th className={Styles.rowDescription}>??????</th>
                    <th className={Styles.rowName}>??????</th>
                    <th>?????????</th>
                    <th className={Styles.rowActions}>??????</th>
                  </tr>
                </thead>
                {dataAdapterEntries}
              </Table>
            </PaginatedList>
          </Col>
        </Row>
      </div>
    );
  }
}

export default DataAdaptersOverview;
