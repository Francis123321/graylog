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

import { Row, Col, Alert, Button } from 'components/graylog';
import { IfPermitted, Icon } from 'components/common';
import { DocumentationLink } from 'components/support';
import NodeThroughput from 'components/throughput/NodeThroughput';
import DocsHelper from 'util/DocsHelper';
import StringUtils from 'util/StringUtils';
import StoreProvider from 'injection/StoreProvider';

const SystemProcessingStore = StoreProvider.getStore('SystemProcessing');

class SystemOverviewDetails extends React.Component {
  static propTypes = {
    node: PropTypes.object.isRequired,
    information: PropTypes.object.isRequired,
  };

  _toggleMessageProcessing = () => {
    if (confirm(`你即将 ${this.props.information.is_processing ? '暂停' : '恢复'} 此节点中的消息处理。 你确定吗？`)) {
      if (this.props.information.is_processing) {
        SystemProcessingStore.pause(this.props.node.node_id);
      } else {
        SystemProcessingStore.resume(this.props.node.node_id);
      }
    }
  };

  render() {
    const { information } = this.props;
    const lbStatus = information.lb_status.toUpperCase();
    let processingStatus;

    if (information.is_processing) {
      processingStatus = (
        <span>
          <Icon name="info-circle" />&nbsp; <NodeThroughput nodeId={this.props.node.node_id} longFormat />
        </span>
      );
    } else {
      processingStatus = (
        <span>
          <Icon name="exclamation-triangle" />&nbsp; 节点<strong>不</strong>处理消息
        </span>
      );
    }

    return (
      <Row>
        <Col md={4}>
          <Alert bsStyle="info">
            <span className="pull-right"> <DocumentationLink page={DocsHelper.PAGES.LOAD_BALANCERS} text="这是什么意思？" /></span>
            <Icon name="exchange-alt" />&nbsp;
            生命周期状态: <strong>{StringUtils.capitalizeFirstLetter(this.props.information.lifecycle)}</strong>
          </Alert>
        </Col>
        <Col md={4}>
          <Alert bsStyle={lbStatus === 'ALIVE' ? 'success' : 'danger'}>
            <span className="pull-right"> <DocumentationLink page={DocsHelper.PAGES.LOAD_BALANCERS} text="这是什么意思？" /></span>
            <Icon name="heart" />&nbsp;
            对于负载平衡器标记为 <strong>{lbStatus}</strong>
          </Alert>
        </Col>
        <Col md={4}>
          <Alert bsStyle={information.is_processing ? 'success' : 'danger'}>
            <IfPermitted permissions="processing:changestate">
              <span className="pull-right">
                <Button onClick={this._toggleMessageProcessing} bsSize="xsmall" bsStyle={information.is_processing ? 'danger' : 'success'}>
                  {information.is_processing ? '暂停' : '恢复'} 加工
                </Button>
              </span>
            </IfPermitted>
            {processingStatus}
          </Alert>
        </Col>
      </Row>
    );
  }
}

export default SystemOverviewDetails;
