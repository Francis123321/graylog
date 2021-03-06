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

class CSVFileAdapterDocumentation extends React.Component {
  render() {
    const csvFile1 = `"ipaddr","hostname"
"127.0.0.1","localhost"
"10.0.0.1","server1"
"10.0.0.2","server2"`;

    const csvFile2 = `'ipaddr';'lladdr';'hostname'
'127.0.0.1';'e4:b2:11:d1:38:14';'localhost'
'10.0.0.1';'e4:b2:12:d1:48:28';'server1'
'10.0.0.2';'e4:b2:11:d1:58:34';'server2'`;

    return (
      <div>
        <p>CSV 数据适配器可以从 CSV 文件中读取键值对。</p>
        <p>请确保根据您的配置设置格式化您的 CSV 文件。</p>

        <Alert style={{ marginBottom: 10 }} bsStyle="info">
          <h4 style={{ marginBottom: 10 }}>CSV 文件要求：</h4>
          <ul className="no-padding">
            <li>CSV 文件中的第一行需要是字段/列名称列表</li>
            <li>文件使用<strong>utf-8</strong>编码</li>
              <li><strong>每个</strong> Graylog 服务器节点都可以读取该文件 </li>
          </ul>
        </Alert>

        <hr />

        <h3 style={{ marginBottom: 10 }}>示例 1</h3>

        <h5 style={{ marginBottom: 10 }}>配置</h5>
        <p style={{ marginBottom: 10, padding: 0 }}>
          分隔器: <code>,</code><br />
          引用字符: <code>"</code><br />
          重点栏目: <code>ipaddr</code><br />
          值列: <code>hostname</code>
        </p>

        <h5 style={{ marginBottom: 10 }}>CSV文件</h5>
        <pre>{csvFile1}</pre>

        <h3 style={{ marginBottom: 10 }}>示例 2</h3>

        <h5 style={{ marginBottom: 10 }}>配置</h5>
        <p style={{ marginBottom: 10, padding: 0 }}>
          分隔器: <code>;</code><br />
          引用字符: <code>'</code><br />
          重点栏目: <code>ipaddr</code><br />
          值列: <code>hostname</code>
        </p>

        <h5 style={{ marginBottom: 10 }}>CSV文件</h5>
        <pre>{csvFile2}</pre>
      </div>
    );
  }
}

export default CSVFileAdapterDocumentation;
