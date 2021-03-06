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
import Routes from 'routing/Routes';
import CombinedProvider from 'injection/CombinedProvider';
import { Row, Col, Table, Popover, OverlayTrigger, Button } from 'components/graylog';
import { PaginatedList, SearchForm, Icon } from 'components/common';
import LUTTableEntry from 'components/lookup-tables/LUTTableEntry';

import Styles from './Overview.css';

const { LookupTablesActions } = CombinedProvider.get('LookupTables');

class LookupTablesOverview extends React.Component {
  static propTypes = {
    tables: PropTypes.arrayOf(PropTypes.object).isRequired,
    caches: PropTypes.objectOf(PropTypes.object).isRequired,
    dataAdapters: PropTypes.objectOf(PropTypes.object).isRequired,
    pagination: PropTypes.object.isRequired,
    errorStates: PropTypes.object.isRequired,
  };

  _onPageChange = (newPage, newPerPage) => {
    LookupTablesActions.searchPaginated(newPage, newPerPage, this.props.pagination.query);
  };

  _onSearch = (query, resetLoadingStateCb) => {
    LookupTablesActions
      .searchPaginated(this.props.pagination.page, this.props.pagination.per_page, query)
      .then(resetLoadingStateCb);
  };

  _onReset = () => {
    LookupTablesActions.searchPaginated(this.props.pagination.page, this.props.pagination.per_page);
  };

  _lookupName = (id, map) => {
    const empty = { title: 'None' };

    if (!map) {
      return empty;
    }

    return map[id] || empty;
  };

  _lookupAdapterError = (table) => {
    if (this.props.errorStates.dataAdapters && this.props.dataAdapters) {
      const adapter = this.props.dataAdapters[table.data_adapter_id];

      if (!adapter) {
        return null;
      }

      return this.props.errorStates.dataAdapters[adapter.name];
    }

    return null;
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
              <td>????????? ID</td>
            </tr>
            <tr>
              <td>??????</td>
              <td>??????????????????</td>
            </tr>
            <tr>
              <td>??????</td>
              <td>????????????????????????</td>
            </tr>
            <tr>
              <td>??????</td>
              <td>???????????????</td>
            </tr>
          </tbody>
        </Table>
        <p><strong>??????</strong></p>
        <p>
          ????????????????????????????????????<br />
          <kbd>?????????geoip</kbd><br />
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
    const lookupTables = this.props.tables.map((table) => {
      const cache = this._lookupName(table.cache_id, this.props.caches);
      const dataAdapter = this._lookupName(table.data_adapter_id, this.props.dataAdapters);
      const errors = {
        table: this.props.errorStates.tables[table.name],
        cache: null,
        dataAdapter: this._lookupAdapterError(table),
      };

      return (
        <LUTTableEntry key={table.id}
                       table={table}
                       cache={cache}
                       dataAdapter={dataAdapter}
                       errors={errors} />
      );
    });

    return (
      <div>
        <Row className="content">
          <Col md={12}>
            <h2>
              ???????????????
              <span>&nbsp;<small>??????{this.props.pagination.total}</small></span>
            </h2>
            <PaginatedList onChange={this._onPageChange} totalItems={this.props.pagination.total}>
              <SearchForm onSearch={this._onSearch} onReset={this._onReset} useLoadingState>
                <LinkContainer to={Routes.SYSTEM.LOOKUPTABLES.CREATE}>
                  <Button bsStyle="success" style={{ marginLeft: 5 }}>???????????????</Button>
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
                    <th className={Styles.rowCache}>??????</th>
                    <th className={Styles.rowAdapter}>???????????????</th>
                    <th className={Styles.rowActions}>??????</th>
                  </tr>
                </thead>
                {lookupTables}
              </Table>
            </PaginatedList>
          </Col>
        </Row>
      </div>
    );
  }
}

export default LookupTablesOverview;
