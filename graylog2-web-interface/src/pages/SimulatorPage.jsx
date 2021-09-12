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

import { LinkContainer } from 'components/graylog/router';
import { Button, Col, Row } from 'components/graylog';
import { DocumentTitle, PageHeader, Spinner } from 'components/common';
import DocumentationLink from 'components/support/DocumentationLink';
import ProcessorSimulator from 'components/simulator/ProcessorSimulator';
import StoreProvider from 'injection/StoreProvider';
import DocsHelper from 'util/DocsHelper';
import Routes from 'routing/Routes';

const StreamsStore = StoreProvider.getStore('Streams');

// Events do not work on Pipelines yet, hide Events and System Events Streams.
const HIDDEN_STREAMS = [
  '000000000000000000000002',
  '000000000000000000000003',
];

class SimulatorPage extends React.Component {
  state = {
    streams: undefined,
  };

  componentDidMount() {
    StreamsStore.listStreams().then((streams) => {
      const filteredStreams = streams.filter((s) => !HIDDEN_STREAMS.includes(s.id));

      this.setState({ streams: filteredStreams });
    });
  }

  _isLoading = () => {
    const { streams } = this.state;

    return !streams;
  };

  render() {
    const { streams } = this.state;

    const content = this._isLoading() ? <Spinner /> : <ProcessorSimulator streams={streams} />;

    return (
      <DocumentTitle title="Simulate processing">
        <div>
          <PageHeader title="模拟加工">
            <span>
              处理消息可能很复杂。 使用此页面来模拟使用您当前的一组管道和规则处理传入消息的结果。
            </span>
            <span>
              在 <DocumentationLink page={DocsHelper.PAGES.PIPELINES} text="文件" /> 中阅读有关 Graylog 管道的更多信息。
            </span>

            <span>
              <LinkContainer to={Routes.SYSTEM.PIPELINES.OVERVIEW}>
                <Button bsStyle="info">管理管道</Button>
              </LinkContainer>
              &nbsp;
              <LinkContainer to={Routes.SYSTEM.PIPELINES.RULES}>
                <Button bsStyle="info">管理规则</Button>
              </LinkContainer>
              &nbsp;
              <LinkContainer to={Routes.SYSTEM.PIPELINES.SIMULATOR}>
                <Button bsStyle="info">模拟器</Button>
              </LinkContainer>
            </span>
          </PageHeader>

          <Row className="content">
            <Col md={12}>
              {content}
            </Col>
          </Row>
        </div>
      </DocumentTitle>
    );
  }
}

export default SimulatorPage;
