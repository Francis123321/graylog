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

import AuthenticationOverviewLinks from 'components/authentication/AuthenticationOverviewLinks';
import { PageHeader } from 'components/common';
import useActiveBackend from 'components/authentication/useActiveBackend';
import DocumentationLink from 'components/support/DocumentationLink';
import BackendActionLinks from 'components/authentication/BackendActionLinks';
import DocsHelper from 'util/DocsHelper';
import StringUtils from 'util/StringUtils';
import { DirectoryServiceBackend } from 'logic/authentication/directoryServices/types';

type Props = {
  authenticationBackend?: DirectoryServiceBackend,
};

const _pageTitle = (authBackend) => {
  if (authBackend) {
    const backendTitle = StringUtils.truncateWithEllipses(authBackend.title, 30);

    return <>Edit Authentication Service - <i>{backendTitle}</i></>;
  }

  return '创建 Active Directory 身份验证服务';
};

const WizardPageHeader = ({ authenticationBackend: authBackend }: Props) => {
  const { finishedLoading, activeBackend } = useActiveBackend();
  const pageTitle = _pageTitle(authBackend);

  return (
    <PageHeader title={pageTitle}
                subactions={(
                  <BackendActionLinks activeBackend={activeBackend}
                                      finishedLoading={finishedLoading} />
                )}>
      <span>配置此 Graylog 集群的 Graylog 身份验证服务。</span>
      <span>
        在<DocumentationLink page={DocsHelper.PAGES.USERS_ROLES} text="文件" />中阅读更多身份验证。
      </span>
      <AuthenticationOverviewLinks />
    </PageHeader>
  );
};

WizardPageHeader.defaultProps = {
  authenticationBackend: undefined,
};

export default WizardPageHeader;
