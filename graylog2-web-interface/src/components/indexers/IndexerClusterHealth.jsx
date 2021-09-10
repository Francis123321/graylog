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

import { Row, Col } from 'components/graylog';
import StoreProvider from 'injection/StoreProvider';
import { Spinner } from 'components/common';
import { DocumentationLink, SmallSupportLink } from 'components/support';
import DocsHelper from 'util/DocsHelper';
import { IndexerClusterHealthSummary } from 'components/indexers';

const IndexerClusterStore = StoreProvider.getStore('IndexerCluster');

const IndexerClusterHealth = createReactClass({
  displayName: 'IndexerClusterHealth',
  mixins: [Reflux.connect(IndexerClusterStore)],

  componentDidMount() {
    IndexerClusterStore.update();
  },

  render() {
    const { health } = this.state;

    let content;

    if (health) {
      content = <IndexerClusterHealthSummary health={health} />;
    } else {
      content = <Spinner />;
    }

    return (
      <Row className="content">
        <Col md={12}>
          <h2>弹性搜索集群</h2>

          <SmallSupportLink>
            <DocumentationLink page={DocsHelper.PAGES.CONFIGURING_ES} text="Graylog文档" />中提供了可能的 Elasticsearch 集群状态和更多相关信息。
          </SmallSupportLink>

          {content}
        </Col>
      </Row>
    );
  },
});

export default IndexerClusterHealth;
