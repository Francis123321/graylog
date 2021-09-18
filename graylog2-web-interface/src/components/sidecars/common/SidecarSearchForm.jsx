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
import React from 'react';
import PropTypes from 'prop-types';

import { OverlayTrigger, Popover, Table, Button } from 'components/graylog';
import { SearchForm, Icon } from 'components/common';

import style from './SidecarSearchForm.css';

class SidecarSearchForm extends React.Component {
  static propTypes = {
    query: PropTypes.string.isRequired,
    onSearch: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    children: PropTypes.element,
  };

  static defaultProps = {
    children: undefined,
  };

  render() {
    const { query, onSearch, onReset, children } = this.props;

    const queryHelpPopover = (
      <Popover id="search-query-help" className={style.popoverWide} title="搜索语法帮助">
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
              <td>名称</td>
              <td>探针名称</td>
            </tr>
            <tr>
              <td>地位</td>
              <td>探针出现在列表中时的状态，即正在运行、失败或未知 </td>
            </tr>
            <tr>
              <td>操作系统</td>
              <td>Sidecar 运行的操作系统</td>
            </tr>
            <tr>
              <td>最后一次露面</td>
              <td>探针上次与 Graylog 通信的日期和时间</td>
            </tr>
            <tr>
              <td>节点 ID</td>
              <td>探针标识符</td>
            </tr>
            <tr>
              <td>探针版本</td>
              <td>探针版本</td>
            </tr>
          </tbody>
        </Table>
        <p><strong>例子</strong></p>
        <p>
          查找自某个日期以来未与 Graylog 通信的探针：<br />
          <kbd>{'last_seen:<=2018-04-10'}</kbd><br />
        </p>
        <p>
          查找具有 <code>失败</code> 或 <code>未知</code> 状态的探针：<br />
          <kbd>status:failing status:unknown</kbd><br />
        </p>
      </Popover>
    );

    const queryHelp = (
      <OverlayTrigger trigger="click" rootClose placement="right" overlay={queryHelpPopover}>
        <Button bsStyle="link"><Icon name="question-circle" /></Button>
      </OverlayTrigger>
    );

    return (
      <SearchForm query={query}
                  onSearch={onSearch}
                  onReset={onReset}
                  searchButtonLabel="Find"
                  placeholder="查找探针"
                  queryWidth={400}
                  queryHelpComponent={queryHelp}
                  topMargin={0}
                  useLoadingState>
        {children}
      </SearchForm>
    );
  }
}

export default SidecarSearchForm;
