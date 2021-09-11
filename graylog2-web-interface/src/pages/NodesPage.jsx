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
import createReactClass from 'create-react-class';
import Reflux from 'reflux';
import URI from 'urijs';

import * as URLUtils from 'util/URLUtils';
import StoreProvider from 'injection/StoreProvider';
import { DocumentTitle, ExternalLinkButton, PageHeader, Spinner } from 'components/common';
import { NodesList } from 'components/nodes';

const CurrentUserStore = StoreProvider.getStore('CurrentUser');
const NodesStore = StoreProvider.getStore('Nodes');

const GLOBAL_API_BROWSER_URL = '/api-browser/global/index.html';

const NodesPage = createReactClass({
  displayName: 'NodesPage',
  mixins: [Reflux.connect(CurrentUserStore), Reflux.connect(NodesStore)],

  _isLoading() {
    const { nodes } = this.state;

    return !(nodes);
  },

  _renderGlobalAPIButton() {
    if (this._isLoading()) {
      return <Spinner />;
    }

    if (this._hasExternalURI()) {
      return (
        <ExternalLinkButton bsStyle="info" href={URLUtils.qualifyUrl(GLOBAL_API_BROWSER_URL)}>
          集群全局 API 浏览器
        </ExternalLinkButton>
      );
    }

    return null;
  },

  _hasExternalURI() {
    const { nodes } = this.state;
    const nodeVals = Object.values(nodes);
    const publishURI = URLUtils.qualifyUrl('/');

    return (nodeVals.findIndex((node) => new URI(node.transport_address).normalizePathname().toString() !== publishURI) >= 0);
  },

  render() {
    const { nodes, currentUser } = this.state;

    return (
      <DocumentTitle title="Nodes">
        <div>
          <PageHeader title="节点">
            <span>此页面提供 Graylog 集群中节点的实时概览。</span>

            <span>
              您可以随时暂停消息处理。 在您恢复之前，进程缓冲区不会接受任何新消息。 如果为某个节点启用了消息日志（默认情况下），则传入的消息将持久保存到磁盘，即使在禁用处理时也是如此。
            </span>
            <span>
              {this._renderGlobalAPIButton()}
            </span>
          </PageHeader>
          <NodesList permissions={currentUser.permissions} nodes={nodes} />
        </div>
      </DocumentTitle>
    );
  },
});

export default NodesPage;
