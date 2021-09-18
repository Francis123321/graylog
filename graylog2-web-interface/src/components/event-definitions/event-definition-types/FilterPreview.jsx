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

import { Panel, Table } from 'components/graylog';
import { Spinner } from 'components/common';
import HelpPanel from 'components/event-definitions/common/HelpPanel';

import styles from './FilterPreview.css';

class FilterPreview extends React.Component {
  static propTypes = {
    searchResult: PropTypes.object,
    errors: PropTypes.array,
    isFetchingData: PropTypes.bool,
    displayPreview: PropTypes.bool,
  };

  static defaultProps = {
    searchResult: {},
    errors: [],
    isFetchingData: false,
    displayPreview: false,
  };

  renderMessages = (messages) => {
    return messages.map(({ index, message }) => {
      return (
        <tr key={`${index}-${message._id}`}>
          <td>{message.timestamp}</td>
          <td>{message.message}</td>
        </tr>
      );
    });
  };

  renderSearchResult = (searchResult = {}) => {
    if (!searchResult.messages || searchResult.messages.length === 0) {
      return <p>Could not find any messages with the current search criteria.</p>;
    }

    return (
      <Table striped condensed bordered>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {this.renderMessages(searchResult.messages)}
        </tbody>
      </Table>
    );
  };

  render() {
    const { isFetchingData, searchResult, errors, displayPreview } = this.props;

    const renderedResults = isFetchingData ? <Spinner text="加载过滤器预览..." /> : this.renderSearchResult(searchResult);

    return (
      <>
        <HelpPanel collapsible
                   defaultExpanded={!displayPreview}
                   title="过滤和聚合将创建多少事件？">
          <p>
            过滤和聚合条件将生成不同数量的事件，具体取决于它的配置方式：
          </p>
          <ul>
            <li><b>过滤器：</b>&emsp;与过滤器匹配的每条消息一个事件 </li>
            <li>
              <b>无组聚合：</b>&emsp;每次聚合结果满足条件时一个事件
            </li>
            <li>
              <b>分组聚合：</b>&emsp;每组一个事件，其聚合结果满足条件
            </li>
          </ul>
        </HelpPanel>

        {displayPreview && (
          <Panel className={styles.filterPreview} bsStyle="default">
            <Panel.Heading>
              <Panel.Title>过滤预览</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              {errors.length > 0 ? <p className="text-danger">{errors[0].description}</p> : renderedResults}
            </Panel.Body>
          </Panel>
        )}
      </>
    );
  }
}

export default FilterPreview;
