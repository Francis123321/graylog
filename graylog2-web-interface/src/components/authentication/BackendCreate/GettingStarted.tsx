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

import { Row, Col } from 'components/graylog';
import { EmptyEntity } from 'components/common';

import ServiceSelect from './ServiceSelect';

type Props = {
  title?: string,
};

const GettingStarted = ({ title }: Props) => (
  <Row className="content">
    <Col md={6} mdOffset={3}>
      <EmptyEntity title={title}>
        <p>
          除了内部用户数据库或 LDAP/Active Directory 等内置身份验证机制外，身份验证服务还可以通过插件扩展以支持其他身份验证机制。
          选择一种身份验证服务以设置新的服务。
        </p>
        <ServiceSelect />
      </EmptyEntity>
    </Col>
  </Row>
);

GettingStarted.defaultProps = {
  title: undefined,
};

export default GettingStarted;
