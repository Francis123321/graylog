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
import { useEffect, useState, useContext } from 'react';

import { LinkContainer, Link } from 'components/graylog/router';
import { ButtonToolbar, Col, Row, Button } from 'components/graylog';
import { DocumentTitle, PageHeader, Spinner } from 'components/common';
import { isPermitted } from 'util/PermissionsMixin';
import CurrentUserContext from 'contexts/CurrentUserContext';
import UsersDomain from 'domainActions/users/UsersDomain';
import SidecarListContainer from 'components/sidecars/sidecars/SidecarListContainer';
import Routes from 'routing/Routes';

const SidecarsPage = () => {
  const [sidecarUser, setSidecarUser] = useState();
  const currentUser = useContext(CurrentUserContext);
  const canCreateSidecarUserTokens = isPermitted(currentUser?.permissions, ['users:tokenlist:graylog-sidecar']);

  useEffect(() => {
    if (canCreateSidecarUserTokens) {
      UsersDomain.loadByUsername('graylog-sidecar').then(setSidecarUser);
    }
  }, [canCreateSidecarUserTokens]);

  return (
    <DocumentTitle title="Sidecars">
      <span>
        <PageHeader title="探头概述">
          <span>
            Graylog sidecar 可以可靠地从您的服务器转发日志文件或 Windows EventLog 的内容。
          </span>

          {canCreateSidecarUserTokens && (
            <>
              {sidecarUser ? (
                <span>
                  您需要一个用于 sidecar 的 API 令牌吗？
                  <Link to={Routes.SYSTEM.USERS.TOKENS.edit(sidecarUser.id)}>
                    为 <em>graylog-Probes</em> 用户创建或重用令牌
                  </Link>
                </span>
              ) : <Spinner />}
            </>
          )}

          <ButtonToolbar>
            <LinkContainer to={Routes.SYSTEM.SIDECARS.OVERVIEW}>
              <Button bsStyle="info">概述</Button>
            </LinkContainer>
            <LinkContainer to={Routes.SYSTEM.SIDECARS.ADMINISTRATION}>
              <Button bsStyle="info">行政</Button>
            </LinkContainer>
            <LinkContainer to={Routes.SYSTEM.SIDECARS.CONFIGURATION}>
              <Button bsStyle="info">配置</Button>
            </LinkContainer>
          </ButtonToolbar>
        </PageHeader>

        <Row className="content">
          <Col md={12}>
            <SidecarListContainer />
          </Col>
        </Row>
      </span>
    </DocumentTitle>
  );
};

export default SidecarsPage;
