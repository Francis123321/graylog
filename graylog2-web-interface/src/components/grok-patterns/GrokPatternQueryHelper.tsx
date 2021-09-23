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
import * as React from 'react';

import { Popover, Table } from 'components/graylog';

const GrokPatternQueryHelper = () => (
  <Popover id="search-query-help" className="popover-wide" title="搜索语法帮助">
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
          <td>Grok 模式名称</td>
        </tr>
        <tr>
          <td>图案</td>
          <td>grok 图案的图案</td>
        </tr>
      </tbody>
    </Table>
    <p><strong>例子 </strong></p>
    <p>
      在模式中查找包含 COMMON 的 grok 模式：<br />
      <kbd>图案：普通</kbd><br />
    </p>
  </Popover>
);

export default GrokPatternQueryHelper;
