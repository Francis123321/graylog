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
import createReactClass from 'create-react-class';
import Reflux from 'reflux';

import { LinkContainer } from 'components/graylog/router';
import { Row, Col, Button } from 'components/graylog';
import { DocumentTitle, PageHeader, Spinner } from 'components/common';
import { IndexSetConfigurationForm } from 'components/indices';
import { DocumentationLink } from 'components/support';
import CombinedProvider from 'injection/CombinedProvider';
import DocsHelper from 'util/DocsHelper';
import history from 'util/History';
import Routes from 'routing/Routes';
import withParams from 'routing/withParams';
import withLocation from 'routing/withLocation';

const { IndexSetsStore, IndexSetsActions } = CombinedProvider.get('IndexSets');
const { IndicesConfigurationStore, IndicesConfigurationActions } = CombinedProvider.get('IndicesConfiguration');

const IndexSetConfigurationPage = createReactClass({
  displayName: 'IndexSetConfigurationPage',

  propTypes: {
    params: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  },

  mixins: [Reflux.connect(IndexSetsStore), Reflux.connect(IndicesConfigurationStore)],

  getInitialState() {
    return {
      indexSet: undefined,
    };
  },

  componentDidMount() {
    IndexSetsActions.get(this.props.params.indexSetId);
    IndicesConfigurationActions.loadRotationStrategies();
    IndicesConfigurationActions.loadRetentionStrategies();
  },

  _formCancelLink() {
    if (this.props.location.query.from === 'details') {
      return Routes.SYSTEM.INDEX_SETS.SHOW(this.state.indexSet.id);
    }

    return Routes.SYSTEM.INDICES.LIST;
  },

  _saveConfiguration(indexSet) {
    IndexSetsActions.update(indexSet).then(() => {
      history.push(Routes.SYSTEM.INDICES.LIST);
    });
  },

  _isLoading() {
    return !this.state.indexSet || !this.state.rotationStrategies || !this.state.retentionStrategies;
  },

  render() {
    if (this._isLoading()) {
      return <Spinner />;
    }

    const { indexSet } = this.state;

    return (
      <DocumentTitle title="Configure Index Set">
        <div>
          <PageHeader title="配置索引集">
            <span>
              修改此索引集的当前配置，允许您自定义来自一个或多个流的消息的保留、分片和复制。
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
                                         cancelLink={this._formCancelLink()}
                                         onUpdate={this._saveConfiguration} />
            </Col>
          </Row>
        </div>
      </DocumentTitle>
    );
  },
});

export default withParams(withLocation(IndexSetConfigurationPage));
