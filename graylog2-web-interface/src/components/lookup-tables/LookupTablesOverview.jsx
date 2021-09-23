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
      <Popover id="search-query-help" className={Styles.popoverWide} title="搜索语法帮助">
        <p><strong>可用的搜索字段</strong></p>
        <Table condensed>
          <thead>
            <tr>
              <th>字段</th>
              <th>描述</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>id</td>
              <td>查找表 ID</td>
            </tr>
            <tr>
              <td>标题</td>
              <td>查找表的标题</td>
            </tr>
            <tr>
              <td>名称</td>
              <td>查找表的引用名称</td>
            </tr>
            <tr>
              <td>描述</td>
              <td>查找表说明</td>
            </tr>
          </tbody>
        </Table>
        <p><strong>例子</strong></p>
        <p>
          按名称的部分查找查找表：<br />
          <kbd>名称：geoip</kbd><br />
          <kbd>名称:geo</kbd>
        </p>
        <p>
          没有字段名称的搜索与 <code>标题</code> 字段匹配：<br />
          <kbd>geoip</kbd> <br />是相同的<br />
          <kbd>标题:geoip</kbd>
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
              查找表配置
              <span>&nbsp;<small>总数{this.props.pagination.total}</small></span>
            </h2>
            <PaginatedList onChange={this._onPageChange} totalItems={this.props.pagination.total}>
              <SearchForm onSearch={this._onSearch} onReset={this._onReset} useLoadingState>
                <LinkContainer to={Routes.SYSTEM.LOOKUPTABLES.CREATE}>
                  <Button bsStyle="success" style={{ marginLeft: 5 }}>创建查找表</Button>
                </LinkContainer>
                <OverlayTrigger trigger="click" rootClose placement="right" overlay={this._helpPopover()}>
                  <Button bsStyle="link" className={Styles.searchHelpButton}><Icon name="question-circle" fixedWidth /></Button>
                </OverlayTrigger>
              </SearchForm>
              <Table condensed hover className={Styles.overviewTable}>
                <thead>
                  <tr>
                    <th className={Styles.rowTitle}>标题</th>
                    <th className={Styles.rowDescription}>描述</th>
                    <th className={Styles.rowName}>名称</th>
                    <th className={Styles.rowCache}>缓存</th>
                    <th className={Styles.rowAdapter}>数据适配器</th>
                    <th className={Styles.rowActions}>操作</th>
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
