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

import { OverlayTrigger, Popover, Table, Button } from 'components/graylog';
import { Icon } from 'components/common';

const userQueryHelperPopover = (
  <Popover id="user-search-query-help" title="Search Syntax Help">
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
          <td>全名</td>
          <td>用户的全名</td>
        </tr>
        <tr>
          <td>用户名</td>
          <td>用户登录用户名。</td>
        </tr>
        <tr>
          <td>电子邮件</td>
          <td>用户发送电子邮件。</td>
        </tr>
      </tbody>
    </Table>
    <p><strong>例子</strong></p>
    <p>
      查找电子邮件包含 example.com 的用户：<br />
      <kbd>电子邮件：example.com</kbd><br />
    </p>
  </Popover>
);

const UserQueryHelper = () => (
  <OverlayTrigger trigger="click" rootClose placement="right" overlay={userQueryHelperPopover}>
    <Button bsStyle="link"><Icon name="question-circle" /></Button>
  </OverlayTrigger>
);

export default UserQueryHelper;
