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

import { LinkContainer } from 'components/graylog/router';
import Routes from 'routing/Routes';
import DocsHelper from 'util/DocsHelper';
import { Button } from 'components/graylog';
import { PageHeader, DocumentTitle } from 'components/common';
import UserCreate from 'components/users/UserCreate';
import DocumentationLink from 'components/support/DocumentationLink';
import UserOverviewLinks from 'components/users/navigation/UserOverviewLinks';

const UserCreatePage = () => (
  <DocumentTitle title="Create New User">
    <PageHeader title="创建新用户"
                subactions={(
                  <LinkContainer to={Routes.SYSTEM.USERS.CREATE}>
                    <Button bsStyle="success">创建用户</Button>
                  </LinkContainer>
                )}>
      <span>
        使用此页面创建新的 Graylog 用户。 此处创建的用户及其权限不仅限于 Web 界面，而且对于您的 Graylog 服务器节点的 REST API 也是有效和必需的。
      </span>

      <span>
        在<DocumentationLink page={DocsHelper.PAGES.USERS_ROLES} text="文档" />中了解更多信息
      </span>

      <UserOverviewLinks />
    </PageHeader>

    <UserCreate />
  </DocumentTitle>
);

export default UserCreatePage;
