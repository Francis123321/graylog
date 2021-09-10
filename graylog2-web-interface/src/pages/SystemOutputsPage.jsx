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

import StoreProvider from 'injection/StoreProvider';
import { DocumentTitle, PageHeader } from 'components/common';
import OutputsComponent from 'components/outputs/OutputsComponent';

const CurrentUserStore = StoreProvider.getStore('CurrentUser');

const SystemOutputsPage = createReactClass({
  displayName: 'SystemOutputsPage',
  mixins: [Reflux.connect(CurrentUserStore)],

  render() {
    return (
      <DocumentTitle title="Outputs">
        <span>
          <PageHeader title="集群中的输出">
            <span>
              Graylog 节点可以通过输出转发消息。 在此处启动或终止任意数量的输出，<strong>然后将它们分配给流以实时转发流的所有消息。</strong>
            </span>

            <span>
              您可以在<a href="https://marketplace.graylog.org/" target="_blank">Graylog Marketplace</a>中找到输出插件。
            </span>
          </PageHeader>

          <OutputsComponent permissions={this.state.currentUser.permissions} />
        </span>
      </DocumentTitle>
    );
  },
});

export default SystemOutputsPage;
