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

import { LinkContainer } from 'components/graylog/router';
import { Row, Col, Button } from 'components/graylog';
import { DocumentTitle, PageHeader, Spinner } from 'components/common';
import { IndexSetConfigurationForm } from 'components/indices';
import { DocumentationLink } from 'components/support';
import DateTime from 'logic/datetimes/DateTime';
import history from 'util/History';
import DocsHelper from 'util/DocsHelper';
import Routes from 'routing/Routes';
import CombinedProvider from 'injection/CombinedProvider';

const { IndexSetsStore, IndexSetsActions } = CombinedProvider.get('IndexSets');
const { IndicesConfigurationStore, IndicesConfigurationActions } = CombinedProvider.get('IndicesConfiguration');

const IndexSetCreationPage = createReactClass({
  displayName: 'IndexSetCreationPage',
  mixins: [Reflux.connect(IndexSetsStore), Reflux.connect(IndicesConfigurationStore)],

  getInitialState() {
    return {
      indexSet: {
        title: '',
        description: '',
        index_prefix: '',
        writable: true,
        shards: 4,
        replicas: 0,
        retention_strategy_class: 'org.graylog2.indexer.retention.strategies.DeletionRetentionStrategy',
        retention_strategy: {
          max_number_of_indices: 20,
          type: 'org.graylog2.indexer.retention.strategies.DeletionRetentionStrategyConfig',
        },
        rotation_strategy_class: 'org.graylog2.indexer.rotation.strategies.MessageCountRotationStrategy',
        rotation_strategy: {
          max_docs_per_index: 20000000,
          type: 'org.graylog2.indexer.rotation.strategies.MessageCountRotationStrategyConfig',
        },
        index_analyzer: 'standard',
        index_optimization_max_num_segments: 1,
        index_optimization_disabled: false,
        field_type_refresh_interval: 5 * 1000, // 5 seconds
      },
    };
  },

  componentDidMount() {
    IndicesConfigurationActions.loadRotationStrategies();
    IndicesConfigurationActions.loadRetentionStrategies();
  },

  _saveConfiguration(indexSet) {
    const copy = indexSet;

    copy.creation_date = DateTime.now().toISOString();

    IndexSetsActions.create(copy).then(() => {
      history.push(Routes.SYSTEM.INDICES.LIST);
    });
  },

  _isLoading() {
    return !this.state.rotationStrategies || !this.state.retentionStrategies;
  },

  render() {
    if (this._isLoading()) {
      return <Spinner />;
    }

    const { indexSet } = this.state;

    return (
      <DocumentTitle title="Create Index Set">
        <div>
          <PageHeader title="创建索引集">
            <span>
              创建一个新的索引集，让您可以配置来自一个或多个流的消息的保留、分片和复制。
            </span>
            <span>
              您可以在<DocumentationLink page={DocsHelper.PAGES.INDEX_MODEL} text="文档" />中了解有关索引模型的更多信息
            </span>
            <span>
              <LinkContainer to={Routes.SYSTEM.INDICES.LIST}>
                <Button bsStyle="info">索引集概述</Button>
              </LinkContainer>
            </span>
          </PageHeader>

          <Row className="content">
            <Col md={12}>
              <IndexSetConfigurationForm indexSet={indexSet}
                                         rotationStrategies={this.state.rotationStrategies}
                                         retentionStrategies={this.state.retentionStrategies}
                                         create
                                         cancelLink={Routes.SYSTEM.INDICES.LIST}
                                         onUpdate={this._saveConfiguration} />
            </Col>
          </Row>
        </div>
      </DocumentTitle>
    );
  },
});

export default IndexSetCreationPage;
