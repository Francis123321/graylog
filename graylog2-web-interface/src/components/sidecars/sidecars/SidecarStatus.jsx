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
import PropTypes from 'prop-types';
import lodash from 'lodash';

import { Col, Row, Button } from 'components/graylog';
import { Icon } from 'components/common';
import SidecarStatusEnum from 'logic/sidecar/SidecarStatusEnum';
import commonStyles from 'components/sidecars/common/CommonSidecarStyles.css';

import SidecarStatusFileList from './SidecarStatusFileList';
import VerboseMessageModal from './VerboseMessageModal';

const SidecarStatus = createReactClass({
  propTypes: {
    sidecar: PropTypes.object.isRequired,
    collectors: PropTypes.array.isRequired,
  },

  getInitialState() {
    return { collectorName: '', collectorVerbose: '' };
  },

  formatNodeDetails(details) {
    if (!details) {
      return <p>Node details are currently unavailable. Please wait a moment and ensure the sidecar is correctly connected to the server.</p>;
    }

    const metrics = details.metrics || {};

    return (
      <dl className={`${commonStyles.deflist} ${commonStyles.topMargin}`}>
        <dt>IP地址</dt>
        <dd>{lodash.defaultTo(details.ip, 'Not available')}</dd>
        <dt>操作系统</dt>
        <dd>{lodash.defaultTo(details.operating_system, 'Not available')}</dd>
        <dt>CPU空闲</dt>
        <dd>{lodash.isNumber(metrics.cpu_idle) ? `${metrics.cpu_idle}%` : 'Not available' }</dd>
        <dt>加载</dt>
        <dd>{lodash.defaultTo(metrics.load_1, 'Not available')}</dd>
        <dt>卷 &gt; 75% 充分</dt>
        {metrics.disks_75 === undefined
          ? <dd>Not available</dd>
          : <dd>{metrics.disks_75.length > 0 ? metrics.disks_75.join(', ') : 'None'}</dd>}
      </dl>
    );
  },

  formatCollectorStatus(details, collectors) {
    if (!details || !collectors) {
      return <p>收集器状态当前不可用。 请稍等片刻，确保探针正确连接到服务器。</p>;
    }

    if (!details.status) {
      return <p>没有收到收集器状态，在探针配置中设置选项<code>send_status: true</code>可以看到这个信息。</p>;
    }

    const collectorStatuses = details.status.collectors;

    if (collectorStatuses.length === 0) {
      return <p>此探针中没有配置收集器。</p>;
    }

    const statuses = [];

    collectorStatuses.forEach((status) => {
      const collector = collectors.find((c) => c.id === status.collector_id);

      let statusMessage;
      let statusBadge;
      let statusClass;
      let verboseButton;

      switch (status.status) {
        case SidecarStatusEnum.RUNNING:
          statusMessage = 'Collector is running.';
          statusClass = 'text-success';
          statusBadge = <Icon name="play" fixedWidth />;
          break;
        case SidecarStatusEnum.FAILING:
          statusMessage = status.message;
          statusClass = 'text-danger';
          statusBadge = <Icon name="exclamation-triangle" fixedWidth />;

          if (status.verbose_message) {
            verboseButton = (
              <Button bsStyle="link"
                      bsSize="xs"
                      onClick={() => this._onShowVerbose(collector.name, status.verbose_message)}>
                Show Details
              </Button>
            );
          }

          break;
        case SidecarStatusEnum.STOPPED:
          statusMessage = status.message;
          statusClass = 'text-danger';
          statusBadge = <Icon name="stop" fixedWidth />;
          break;
        default:
          statusMessage = 'Collector status is currently unknown.';
          statusClass = 'text-info';
          statusBadge = <Icon name="question-circle" fixedWidth />;
      }

      if (collector) {
        statuses.push(
          <dt key={`${collector.id}-key`} className={statusClass}>{collector.name}</dt>,
          <dd key={`${collector.id}-description`} className={statusClass}>{statusBadge}&ensp;{statusMessage}&ensp;{verboseButton}</dd>,
        );
      }
    });

    return (
      <dl className={commonStyles.deflist}>
        {statuses}
      </dl>
    );
  },

  _onShowVerbose(name, verbose) {
    this.setState({ collectorName: name, collectorVerbose: verbose });
    this.modal.open();
  },

  render() {
    const { sidecar } = this.props;

    const logFileList = sidecar.node_details.log_file_list || [];

    return (
      <div>
        <Row className="content">
          <Col md={12}>
            <h2>节点详情</h2>
            {this.formatNodeDetails(sidecar.node_details)}
          </Col>
        </Row>
        <Row className="content">
          <Col md={12}>
            <h2>收集器状态</h2>
            <div className={commonStyles.topMargin}>
              {this.formatCollectorStatus(sidecar.node_details, this.props.collectors)}
            </div>
          </Col>
        </Row>
        <Row className="content" hidden={logFileList.length === 0}>
          <Col md={12}>
            <h2>Log Files</h2>
            <p className={commonStyles.topMargin}>Recently modified files will be highlighted in blue.</p>
            <div>
              <SidecarStatusFileList files={logFileList} />
            </div>
          </Col>
        </Row>
        <VerboseMessageModal ref={(c) => { this.modal = c; }}
                             collectorName={this.state.collectorName}
                             collectorVerbose={this.state.collectorVerbose} />,
      </div>
    );
  },

});

export default SidecarStatus;
