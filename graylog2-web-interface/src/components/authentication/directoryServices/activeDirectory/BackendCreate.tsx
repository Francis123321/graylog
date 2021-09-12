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

import { DocumentTitle } from 'components/common';
import { getEnterpriseGroupSyncPlugin } from 'util/AuthenticationService';
import { WizardFormValues } from 'components/authentication/directoryServices/BackendWizard/BackendWizardContext';

import WizardPageHeader from './WizardPageHeader';

import BackendWizard from '../BackendWizard';
import handleCreate from '../HandleCreate';

export const HELP = {
  // server config help
  systemUserDn: (
    <span>
      初始连接到 Active Directory 服务器的用户名，例如 <code>ldapbind@some.domain</code>。<br />
      这需要匹配该用户的 <code>userPrincipalName</code>。
    </span>
  ),
  systemUserPassword: '初始连接到 Active Directory 服务器的密码。',
  // user sync help
  userSearchBase: (
    <span>
      将 Active Directory 搜索查询限制为例如的基本树 <code>cn=users,dc=example,dc=com</code>。
    </span>
  ),
  userSearchPattern: (
    <span>
      例如 <code className="text-nowrap">{'(&(objectClass=user)(|(sAMAccountName={0})(userPrincipalName={0})))'}</code>。
      字符串 <code>{'{0}'}</code> 将替换为输入的用户名。
    </span>
  ),
  userNameAttribute: (
    <span>
      哪个 Active Directory 属性用于 Graylog 中用户的全名，例如 <code>userPrincipalName</code>。<br />
      如果您不确定要使用哪个属性，请尝试在侧边栏部分 <i>用户登录测试</i> 中加载测试用户。
    </span>
  ),
  userFullNameAttribute: (
    <span>
      哪个 Active Directory 属性用于同步的 Graylog 用户的全名，例如 <code>显示名称</code>。<br />
    </span>
  ),
  defaultRoles: (
    <span>同步用户将获得默认的 Graylog 角色。 所有用户都需要 <code>Reader</code> 角色，才能使用 Graylog Web 界面</span>
  ),
};

export const AUTH_BACKEND_META = {
  serviceTitle: 'Active Directory',
  serviceType: 'active-directory',
};

const INITIAL_VALUES: Partial<WizardFormValues> = {
  title: AUTH_BACKEND_META.serviceTitle,
  serverHost: 'localhost',
  serverPort: 636,
  transportSecurity: 'tls',
  userSearchPattern: '(&(objectClass=user)(|(sAMAccountName={0})(userPrincipalName={0})))',
  userFullNameAttribute: 'displayName',
  userNameAttribute: 'userPrincipalName',
  verifyCertificates: true,
};

const BackendCreate = () => {
  const enterpriseGroupSyncPlugin = getEnterpriseGroupSyncPlugin();
  const {
    help: groupSyncHelp = {},
    excludedFields: groupSyncExcludedFields = {},
    initialValues: initialGroupSyncValues,
  } = enterpriseGroupSyncPlugin?.wizardConfig?.activeDirectory ?? {};
  const help = { ...HELP, ...groupSyncHelp };
  const initialValues = { ...INITIAL_VALUES, ...initialGroupSyncValues };
  const excludedFields = { ...groupSyncExcludedFields, userUniqueIdAttribute: true };

  return (
    <DocumentTitle title="Create Active Directory Authentication Services">
      <WizardPageHeader />
      <BackendWizard authBackendMeta={AUTH_BACKEND_META}
                     help={help}
                     excludedFields={excludedFields}
                     initialValues={initialValues}
                     onSubmit={handleCreate} />
    </DocumentTitle>
  );
};

export default BackendCreate;
