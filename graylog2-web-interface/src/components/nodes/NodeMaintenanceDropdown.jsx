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
import PropTypes from 'prop-types';
import React from 'react';
import URI from 'urijs';

import { LinkContainer } from 'components/graylog/router';
import { ButtonGroup, DropdownButton, MenuItem } from 'components/graylog';
import { ExternalLink, IfPermitted } from 'components/common';
import Routes from 'routing/Routes';
import HideOnCloud from 'util/conditional/HideOnCloud';

class NodeMaintenanceDropdown extends React.Component {
  static propTypes = {
    node: PropTypes.object.isRequired,
  };

  render() {
    const apiBrowserURI = new URI(`${this.props.node.transport_address}/api-browser`).normalizePathname().toString();

    return (
      <ButtonGroup>
        <DropdownButton bsStyle="info" bsSize="lg" title="操作" id="node-maintenance-actions" pullRight>
          <IfPermitted permissions="threads:dump">
            <LinkContainer to={Routes.SYSTEM.THREADDUMP(this.props.node.node_id)}>
              <MenuItem>获取线程转储</MenuItem>
            </LinkContainer>
          </IfPermitted>

          <IfPermitted permissions="processbuffer:dump">
            <LinkContainer to={Routes.SYSTEM.PROCESSBUFFERDUMP(this.props.node.node_id)}>
              <MenuItem>获取进程缓冲区转储</MenuItem>
            </LinkContainer>
          </IfPermitted>

          <LinkContainer to={Routes.SYSTEM.METRICS(this.props.node.node_id)}>
            <MenuItem>指标</MenuItem>
          </LinkContainer>

          <HideOnCloud>
            <IfPermitted permissions="loggers:read">
              <LinkContainer to={Routes.SYSTEM.LOGGING}>
                <MenuItem>配置内部日志记录</MenuItem>
              </LinkContainer>
            </IfPermitted>
          </HideOnCloud>

          <MenuItem href={apiBrowserURI} target="_blank">
            <ExternalLink>API浏览器</ExternalLink>
          </MenuItem>
        </DropdownButton>
      </ButtonGroup>
    );
  }
}

export default NodeMaintenanceDropdown;
