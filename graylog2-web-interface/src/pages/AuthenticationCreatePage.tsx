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

import {} from 'components/authentication/bindings'; // Bind all authentication plugins
import AuthenticationOverviewLinks from 'components/authentication/AuthenticationOverviewLinks';
import GettingStarted from 'components/authentication/BackendCreate/GettingStarted';
import { DocumentTitle, PageHeader } from 'components/common';
import useActiveBackend from 'components/authentication/useActiveBackend';
import DocsHelper from 'util/DocsHelper';
import DocumentationLink from 'components/support/DocumentationLink';
import BackendActionLinks from 'components/authentication/BackendActionLinks';

const AuthenticationCreatePage = () => {
  const { finishedLoading, activeBackend } = useActiveBackend();

  return (
    <DocumentTitle title="Create Authentication Service">
      <PageHeader title="创建认证服务"
                  subactions={(
                    <BackendActionLinks activeBackend={activeBackend}
                                        finishedLoading={finishedLoading} />
                  )}>
        <span>配置此 Graylog 集群的 Graylog 身份验证服务。</span>
        <span>
          在<DocumentationLink page={DocsHelper.PAGES.USERS_ROLES} text="文档" />中阅读更多身份验证。
        </span>
        <AuthenticationOverviewLinks />
      </PageHeader>

      <GettingStarted title="创建新的身份验证服务" />
    </DocumentTitle>
  );
};

export default AuthenticationCreatePage;
