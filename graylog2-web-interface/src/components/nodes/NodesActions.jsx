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
import { DropdownButton, DropdownSubmenu, MenuItem, Button } from 'components/graylog';
import { ExternalLinkButton, IfPermitted } from 'components/common';
import StoreProvider from 'injection/StoreProvider';
import Routes from 'routing/Routes';
import HideOnCloud from 'util/conditional/HideOnCloud';

const SystemProcessingStore = StoreProvider.getStore('SystemProcessing');
const SystemLoadBalancerStore = StoreProvider.getStore('SystemLoadBalancer');
const SystemShutdownStore = StoreProvider.getStore('SystemShutdown');

class NodesActions extends React.Component {
  static propTypes = {
    node: PropTypes.object.isRequired,
    systemOverview: PropTypes.object.isRequired,
  };

  _toggleMessageProcessing = () => {
    if (confirm(`您将${this.props.systemOverview.is_processing ? '暂停' : '恢复'}此节点中的消息处理。 你确定吗？`)) {
      if (this.props.systemOverview.is_processing) {
        SystemProcessingStore.pause(this.props.node.node_id);
      } else {
        SystemProcessingStore.resume(this.props.node.node_id);
      }
    }
  };

  _changeLBStatus = (status) => {
    return () => {
      if (confirm(`您即将将此节点的负载均衡器状态更改为${status}。 你确定吗？`)) {
        SystemLoadBalancerStore.override(this.props.node.node_id, status);
      }
    };
  };

  _shutdown = () => {
    if (prompt('你真的要关闭这个节点吗？ 输入“SHUTDOWN”进行确认。') === 'SHUTDOWN') {
      SystemShutdownStore.shutdown(this.props.node.node_id);
    }
  };

  render() {
    const apiBrowserURI = new URI(`${this.props.node.transport_address}/api-browser`).normalizePathname().toString();

    return (
      <div className="item-actions">
        <LinkContainer to={Routes.SYSTEM.NODES.SHOW(this.props.node.node_id)}>
          <Button bsStyle="info">细节</Button>
        </LinkContainer>

        <LinkContainer to={Routes.SYSTEM.METRICS(this.props.node.node_id)}>
          <Button bsStyle="info">指标</Button>
        </LinkContainer>

        <ExternalLinkButton bsStyle="info" href={apiBrowserURI}>
          API浏览器
        </ExternalLinkButton>

        <DropdownButton title="更多操作" id={`more-actions-dropdown-${this.props.node.node_id}`} pullRight>
          <IfPermitted permissions="processing:changestate">
            <MenuItem onSelect={this._toggleMessageProcessing}>
              {this.props.systemOverview.is_processing ? '暂停' : '恢复'}消息处理
            </MenuItem>
          </IfPermitted>

          <IfPermitted permissions="lbstatus:change">
            <DropdownSubmenu title="覆盖 LB 状态" left>
              <MenuItem onSelect={this._changeLBStatus('ALIVE')}>激活</MenuItem>
              <MenuItem onSelect={this._changeLBStatus('DEAD')}>死亡</MenuItem>
            </DropdownSubmenu>
          </IfPermitted>

          <IfPermitted permissions="node:shutdown">
            <MenuItem onSelect={this._shutdown}>正常关机</MenuItem>
          </IfPermitted>

          <IfPermitted permissions={['processing:changestate', 'lbstatus:change', 'node:shutdown']} anyPermissions>
            <IfPermitted permissions={['inputs:read', 'threads:dump']} anyPermissions>
              <MenuItem divider />
            </IfPermitted>
          </IfPermitted>

          <HideOnCloud>
            <IfPermitted permissions="inputs:read">
              <LinkContainer to={Routes.node_inputs(this.props.node.node_id)}>
                <MenuItem>本地消息输入</MenuItem>
              </LinkContainer>
            </IfPermitted>
          </HideOnCloud>
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
        </DropdownButton>
      </div>
    );
  }
}

export default NodesActions;
