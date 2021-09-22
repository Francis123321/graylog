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
import { PaginatedList, SearchForm, Spinner, Icon } from 'components/common';
import CacheTableEntry from 'components/lookup-tables/CacheTableEntry';

import Styles from './Overview.css';

const { LookupTableCachesActions } = CombinedProvider.get('LookupTableCaches');

class CachesOverview extends React.Component {
  static propTypes = {
    caches: PropTypes.array.isRequired,
    pagination: PropTypes.object.isRequired,
  };

  _onPageChange = (newPage, newPerPage) => {
    const { pagination } = this.props;

    LookupTableCachesActions.searchPaginated(newPage, newPerPage, pagination.query);
  };

  _onSearch = (query, resetLoadingStateCb) => {
    const { pagination } = this.props;

    LookupTableCachesActions
      .searchPaginated(pagination.page, pagination.per_page, query)
      .then(resetLoadingStateCb);
  };

  _onReset = () => {
    const { pagination } = this.props;

    LookupTableCachesActions.searchPaginated(pagination.page, pagination.per_page);
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
              <td>缓存 ID</td>
            </tr>
            <tr>
              <td>标题</td>
              <td>缓存的标题</td>
            </tr>
            <tr>
              <td>名称</td>
              <td>缓存的引用名称</td>
            </tr>
            <tr>
              <td>desc描述ription</td>
              <td>缓存说明</td>
            </tr>
          </tbody>
        </Table>
        <p><strong>例子</strong></p>
        <p>
          按部分名称查找缓存：<br />
          <kbd>名称:guava</kbd><br />
          <kbd>名称:gua</kbd>
        </p>
        <p>
          没有字段名称的搜索与 <code>标题</code> 字段匹配：<br />
          <kbd>guava</kbd> <br />是相同的<br />
          <kbd>标题:guava</kbd>
        </p>
      </Popover>
    );
  };

  render() {
    const { caches, pagination } = this.props;

    if (!caches) {
      return <Spinner text="Loading caches" />;
    }

    const cacheTableEntries = caches.map((cache) => {
      return (
        <CacheTableEntry key={cache.id}
                         cache={cache} />
      );
    });

    return (
      <div>
        <Row className="content">
          <Col md={12}>
            <h2>
              查找缓存配置
              <span>&nbsp;
                <small>总数{pagination.total}</small>
              </span>
            </h2>
            <PaginatedList onChange={this._onPageChange} totalItems={pagination.total}>
              <SearchForm onSearch={this._onSearch} onReset={this._onReset} useLoadingState>
                <LinkContainer to={Routes.SYSTEM.LOOKUPTABLES.CACHES.CREATE}>
                  <Button bsStyle="success" style={{ marginLeft: 5 }}>创建缓存</Button>
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
                    <th>入口</th>
                    <th>命中率</th>
                    <th>吞吐量</th>
                    <th className={Styles.rowActions}>操作</th>
                  </tr>
                </thead>
                {cacheTableEntries}
              </Table>
            </PaginatedList>
          </Col>
        </Row>
      </div>
    );
  }
}

export default CachesOverview;
