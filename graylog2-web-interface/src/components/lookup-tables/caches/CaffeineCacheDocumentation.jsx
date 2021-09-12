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
/* eslint-disable react/no-unescaped-entities */
import React from 'react';

import { Alert } from 'components/graylog';

class CaffeineCacheDocumentation extends React.Component {
  render() {
    return (
      <div>
        <p>内存缓存维护来自数据适配器的最近使用的值。</p>
        <p>请确保您的 Graylog 服务器有足够的堆来容纳缓存条目并监控缓存效率。</p>

        <Alert style={{ marginBottom: 10 }} bsStyle="info">
          <h4 style={{ marginBottom: 10 }}>实施细则</h4>
          <p>缓存是每个 Graylog 服务器的本地缓存，它们不共享条目。</p>
          <p>例如，如果您有两台服务器，它们将保持彼此完全独立的缓存。</p>
        </Alert>

        <hr />

        <h3 style={{ marginBottom: 10 }}>缓存大小</h3>
        <p>每个缓存都有最大条目数，不支持无限缓存。</p>

        <h3 style={{ marginBottom: 10 }}>基于时间的到期</h3>

        <h5 style={{ marginBottom: 10 }}>访问后过期</h5>
        <p style={{ marginBottom: 10, padding: 0 }}>
          自上次使用以来，缓存将在固定时间后删除条目。<br />
          这导致缓存表现为空间受限的最近最少使用的缓存。
        </p>

        <h5 style={{ marginBottom: 10 }}>写入后过期</h5>
        <p style={{ marginBottom: 10, padding: 0 }}>
          自从条目进入缓存以来，缓存将在固定时间后删除条目。<br />
          这会导致条目永远不会超过给定时间，这对于定期更改数据（例如外部系统的配置状态）非常重要。
        </p>

      </div>
    );
  }
}

export default CaffeineCacheDocumentation;
