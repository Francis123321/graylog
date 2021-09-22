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

const backendQueryHelperPopover = (
  <Popover id="user-search-query-help" title="搜索语法帮助">
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
          <td>标题</td>
          <td>后端的标题</td>
        </tr>
        <tr>
          <td>描述</td>
          <td>后端的描述。</td>
        </tr>
      </tbody>
    </Table>
    <p><strong>例子</strong></p>
    <p>
      查找标题包含 LDAP 的后端：<br />
      <kbd>标题:LDAP</kbd><br />
    </p>
  </Popover>
);

const BackendQueryHelper = () => (
  <OverlayTrigger overlay={backendQueryHelperPopover}
                  placement="right"
                  rootClose
                  trigger="click">
    <Button bsStyle="link">
      <Icon name="question-circle" />
    </Button>
  </OverlayTrigger>
);

export default BackendQueryHelper;
