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
import React from 'react';
import PropTypes from 'prop-types';
import { PluginStore } from 'graylog-web-plugin/plugin';
import naturalSort from 'javascript-natural-sort';

import withLocation from 'routing/withLocation';
import { NavDropdown } from 'components/graylog';
import HideOnCloud from 'util/conditional/HideOnCloud';
import IfPermitted from 'components/common/IfPermitted';
import Routes from 'routing/Routes';
import { appPrefixed } from 'util/URLUtils';

import NavigationLink from './NavigationLink';

const _isActive = (requestPath, prefix) => {
  return requestPath.indexOf(appPrefixed(prefix)) === 0;
};

const _systemTitle = (pathname) => {
  const prefix = '系统';

  if (_isActive(pathname, '/system/overview')) {
    return `${prefix} / 概述`;
  }

  if (_isActive(pathname, '/system/nodes')) {
    return `${prefix} / 节点`;
  }

  if (_isActive(pathname, '/system/inputs')) {
    return `${prefix} / 输入`;
  }

  if (_isActive(pathname, '/system/outputs')) {
    return `${prefix} / 输出`;
  }

  if (_isActive(pathname, '/system/indices')) {
    return `${prefix} / 指数`;
  }

  if (_isActive(pathname, '/system/logging')) {
    return `${prefix} / 日志记录`;
  }

  if (_isActive(pathname, '/system/authentication')) {
    return `${prefix} / 验证`;
  }

  if (_isActive(pathname, '/system/contentpacks')) {
    return `${prefix} / 内容包`;
  }

  if (_isActive(pathname, '/system/grokpatterns')) {
    return `${prefix} / 格罗克模式`;
  }

  if (_isActive(pathname, '/system/lookuptables')) {
    return `${prefix} / 查找表`;
  }

  if (_isActive(pathname, '/system/configurations')) {
    return `${prefix} / 配置`;
  }

  if (_isActive(pathname, '/system/pipelines')) {
    return `${prefix} / 管道`;
  }

  if (_isActive(pathname, '/system/sidecars')) {
    return `${prefix} / 探测`;
  }

  const pluginRoute = PluginStore.exports('systemnavigation').filter((route) => _isActive(pathname, route.path))[0];

  if (pluginRoute) {
    return `${prefix} / ${pluginRoute.description}`;
  }

  return prefix;
};

const SystemMenu = ({ location }) => {
  const pluginSystemNavigations = PluginStore.exports('systemnavigation')
    .sort((route1, route2) => naturalSort(route1.description.toLowerCase(), route2.description.toLowerCase()))
    .map(({ description, path, permissions }) => {
      const prefixedPath = appPrefixed(path);
      const link = <NavigationLink description={description} path={prefixedPath} />;

      if (permissions) {
        return <IfPermitted key={description} permissions={permissions}>{link}</IfPermitted>;
      }

      return <NavigationLink key={description} path={prefixedPath} description={description} />;
    });

  return (
    <NavDropdown title={_systemTitle(location.pathname)} id="system-menu-dropdown">
      <NavigationLink path={Routes.SYSTEM.OVERVIEW} description="概述" />
      <IfPermitted permissions={['clusterconfigentry:read']}>
        <NavigationLink path={Routes.SYSTEM.CONFIGURATIONS} description="配置" />
      </IfPermitted>
      <HideOnCloud>
        <NavigationLink path={Routes.SYSTEM.NODES.LIST} description="节点" />
      </HideOnCloud>
      <HideOnCloud>
        <IfPermitted permissions={['inputs:read']}>
          <NavigationLink path={Routes.SYSTEM.INPUTS} description="输入" />
        </IfPermitted>
        <IfPermitted permissions={['outputs:read']}>
          <NavigationLink path={Routes.SYSTEM.OUTPUTS} description="输出" />
        </IfPermitted>
      </HideOnCloud>
      <IfPermitted permissions={['indices:read']}>
        <NavigationLink path={Routes.SYSTEM.INDICES.LIST} description="指数" />
      </IfPermitted>
      <HideOnCloud>
        <IfPermitted permissions={['loggers:read']}>
          <NavigationLink path={Routes.SYSTEM.LOGGING} description="日志记录" />
        </IfPermitted>
      </HideOnCloud>
      <IfPermitted permissions={['users:list']} anyPermissions>
        <NavigationLink path={Routes.SYSTEM.USERS.OVERVIEW} description="用户和团队" />
      </IfPermitted>
      <IfPermitted permissions={['roles:read']} anyPermissions>
        <NavigationLink path={Routes.SYSTEM.AUTHZROLES.OVERVIEW} description="角色" />
      </IfPermitted>
      <HideOnCloud>
        <IfPermitted permissions={['authentication:edit']} anyPermissions>
          <NavigationLink path={Routes.SYSTEM.AUTHENTICATION.BACKENDS.ACTIVE} description="验证" />
        </IfPermitted>
      </HideOnCloud>
      <IfPermitted permissions={['dashboards:create', 'inputs:create', 'streams:create']}>
        <NavigationLink path={Routes.SYSTEM.CONTENTPACKS.LIST} description="内容包" />
      </IfPermitted>
      <IfPermitted permissions={['inputs:read']}>
        <NavigationLink path={Routes.SYSTEM.GROKPATTERNS} description="格罗克模式" />
      </IfPermitted>
      <IfPermitted permissions={['inputs:edit']}>
        <NavigationLink path={Routes.SYSTEM.LOOKUPTABLES.OVERVIEW} description="查找表" />
      </IfPermitted>
      <IfPermitted permissions={['inputs:create']}>
        <NavigationLink path={Routes.SYSTEM.PIPELINES.OVERVIEW} description="管道" />
      </IfPermitted>
      <HideOnCloud>
        <IfPermitted permissions={['sidecars:read']}>
          <NavigationLink path={Routes.SYSTEM.SIDECARS.OVERVIEW} description="探测" />
        </IfPermitted>
      </HideOnCloud>
      {pluginSystemNavigations}
    </NavDropdown>
  );
};

SystemMenu.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default withLocation(SystemMenu);
