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

import StoreProvider from 'injection/StoreProvider';
import ActionsProvider from 'injection/ActionsProvider';
import { DocumentTitle, PageHeader, Spinner } from 'components/common';
import { MetricsComponent } from 'components/metrics';
import withParams from 'routing/withParams';
import withLocation from 'routing/withLocation';

const NodesStore = StoreProvider.getStore('Nodes');
const MetricsStore = StoreProvider.getStore('Metrics');
const MetricsActions = ActionsProvider.getActions('Metrics');

const ShowMetricsPage = createReactClass({
  displayName: 'ShowMetricsPage',

  propTypes: {
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
  },

  mixins: [Reflux.connect(NodesStore), Reflux.connect(MetricsStore), Reflux.listenTo(NodesStore, '_getMetrics')],

  _getMetrics() {
    MetricsActions.names();
  },

  render() {
    if (!this.state.nodes || !this.state.metricsNames) {
      return <Spinner />;
    }

    let { nodeId } = this.props.params;

    // "master" node ID is a placeholder for master node, get first master node ID
    if (nodeId === 'master') {
      const nodeIDs = Object.keys(this.state.nodes);
      const masterNodes = nodeIDs.filter((nodeID) => this.state.nodes[nodeID].is_master);

      nodeId = masterNodes[0] || nodeIDs[0];
    }

    const { metricsNames, metricsErrors } = this.state;

    const node = this.state.nodes[nodeId];
    const title = <span>节点指标 {node.short_node_id} / {node.hostname}</span>;
    const { namespace } = MetricsStore;
    const names = metricsNames[nodeId];
    const error = metricsErrors ? metricsErrors[nodeId] : undefined;
    const { filter } = this.props.location.query;

    return (
      <DocumentTitle title={`Metrics of node ${node.short_node_id} / ${node.hostname}`}>
        <span>
          <PageHeader title={title}>
            <span>
              所有 Graylog 节点都提供一组用于诊断、调试和监控的内部指标。 请注意，您也可以通过 JMX 访问所有指标。
            </span>
            <span>该节点报告了总共 {(names || []).length} 指标。</span>
          </PageHeader>

          <MetricsComponent names={names} namespace={namespace} nodeId={nodeId} filter={filter} error={error} />
        </span>
      </DocumentTitle>
    );
  },
});

export default withParams(withLocation(ShowMetricsPage));
