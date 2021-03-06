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

class MessageCountRotationStrategySummary extends React.Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div>
        <dl>
          <dt>索引轮换策略:</dt>
          <dd>Message Count</dd>
          <dt>每个索引的最大文档数:</dt>
          <dd>{this.props.config.max_docs_per_index}</dd>
        </dl>
      </div>
    );
  }
}

export default MessageCountRotationStrategySummary;
