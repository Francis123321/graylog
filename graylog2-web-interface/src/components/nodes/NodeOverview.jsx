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

import { LinkContainer } from 'components/graylog/router';
import { Row, Col, Button } from 'components/graylog';
import Routes from 'routing/Routes';
import HideOnCloud from 'util/conditional/HideOnCloud';

import BufferUsage from './BufferUsage';
import SystemOverviewDetails from './SystemOverviewDetails';
import JvmHeapUsage from './JvmHeapUsage';
import JournalDetails from './JournalDetails';
import SystemInformation from './SystemInformation';
import RestApiOverview from './RestApiOverview';
import PluginsDataTable from './PluginsDataTable';
import InputTypesDataTable from './InputTypesDataTable';

class NodeOverview extends React.Component {
  static propTypes = {
    node: PropTypes.object.isRequired,
    systemOverview: PropTypes.object.isRequired,
    jvmInformation: PropTypes.object,
    plugins: PropTypes.array,
    inputDescriptions: PropTypes.object,
    inputStates: PropTypes.array,
  };

  render() {
    const { node } = this.props;
    const { systemOverview } = this.props;

    let pluginCount;

    if (this.props.plugins) {
      pluginCount = `安装了${this.props.plugins.length}个插件`;
    }

    let inputCount;

    if (this.props.inputStates) {
      const runningInputs = this.props.inputStates.filter((inputState) => inputState.state.toUpperCase() === 'RUNNING');

      inputCount = `在此节点上运行${runningInputs.length}个输入`;
    }

    return (
      <div>
        <Row className="content">
          <Col md={12}>
            <SystemOverviewDetails node={node} information={systemOverview} />
          </Col>
        </Row>

        <Row className="content">
          <Col md={12}>
            <h2 style={{ marginBottom: 5 }}>内存/堆使用</h2>
            <JvmHeapUsage nodeId={node.node_id} />
          </Col>
        </Row>

        <Row className="content">
          <Col md={12}>
            <h2>缓冲器</h2>
            <p className="description">
              缓冲区用于在通过不同处理器的过程中在很短的时间内（通常为毫秒）缓存少量消息。
            </p>
            <Row>
              <Col md={4}>
                <BufferUsage nodeId={node.node_id} title="输入缓冲器" bufferType="input" />
              </Col>
              <Col md={4}>
                <BufferUsage nodeId={node.node_id} title="进程缓冲区" bufferType="process" />
              </Col>
              <Col md={4}>
                <BufferUsage nodeId={node.node_id} title="输出缓冲器" bufferType="output" />
              </Col>
            </Row>
          </Col>
        </Row>

        <Row className="content">
          <Col md={12}>
            <h2>磁盘日志</h2>
            <p className="description">
              传入的消息被写入磁盘日志，以确保它们在服务器出现故障时保持安全。 如果任何输出太慢而无法跟上消息速率，或者每当传入消息出现峰值时，日志还有助于保持 Graylog 正常工作。 它确保 Graylog 不会在主内存中缓冲所有这些消息，并避免过长的垃圾收集暂停。
            </p>
            <JournalDetails nodeId={node.node_id} />
          </Col>
        </Row>

        <Row className="content">
          <Col md={6}>
            <h2>系统</h2>
            <SystemInformation node={node} systemInformation={systemOverview} jvmInformation={this.props.jvmInformation} />
          </Col>
          <Col md={6}>
            <h2>REST API</h2>
            <RestApiOverview node={node} />
          </Col>
        </Row>

        <Row className="content">
          <Col md={12}>
            <h2>已安装的插件 <small>{pluginCount}</small></h2>
            <PluginsDataTable plugins={this.props.plugins} />
          </Col>
        </Row>

        <Row className="content">
          <Col md={12}>
            <HideOnCloud>
              <span className="pull-right">
                <LinkContainer to={Routes.node_inputs(node.node_id)}>
                  <Button bsStyle="success" bsSize="small">管理输入</Button>
                </LinkContainer>
              </span>
            </HideOnCloud>
            <h2 style={{ marginBottom: 15 }}>可用的输入类型 <small>{inputCount}</small></h2>
            <InputTypesDataTable inputDescriptions={this.props.inputDescriptions} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default NodeOverview;
