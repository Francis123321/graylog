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
import PropTypes from 'prop-types';
import Reflux from 'reflux';
import createReactClass from 'create-react-class';

import { Link } from 'components/graylog/router';
import { Col } from 'components/graylog';
import { ContentHeadRow, DocumentTitle, Spinner } from 'components/common';
import OutputsComponent from 'components/outputs/OutputsComponent';
import SupportLink from 'components/support/SupportLink';
import StoreProvider from 'injection/StoreProvider';
import Routes from 'routing/Routes';
import withParams from 'routing/withParams';

const CurrentUserStore = StoreProvider.getStore('CurrentUser');
const StreamsStore = StoreProvider.getStore('Streams');

const StreamOutputsPage = createReactClass({
  displayName: 'StreamOutputsPage',
  propTypes: {
    params: PropTypes.shape({
      streamId: PropTypes.string.isRequired,
    }).isRequired,
  },

  mixins: [Reflux.connect(CurrentUserStore)],

  getInitialState() {
    return { stream: undefined };
  },

  componentDidMount() {
    const { params } = this.props;

    StreamsStore.get(params.streamId, (stream) => {
      this.setState({ stream: stream });
    });
  },

  render() {
    const { stream, currentUser } = this.state;

    if (!stream) {
      return <Spinner />;
    }

    return (
      <DocumentTitle title={`Outputs for Stream ${stream.title}`}>
        <div>
          <ContentHeadRow className="content">
            <Col md={10}>
              <h1>
                输出流 &raquo;{stream.title}&laquo;
              </h1>

              <p className="description">
                Graylog 节点可以通过输出转发流的消息。 在此处启动或终止任意数量的输出。 您还可以重用已经为其他流运行的输出。

                <Link to={Routes.SYSTEM.OUTPUTS}>此处</Link>提供所有配置输出的全局视图。
                您可以在<a href="https://marketplace.graylog.org/" rel="noopener noreferrer" target="_blank">the Graylog Marketplace</a>上找到输出插件。
              </p>

              <SupportLink>
                <i>删除</i>输出会将其从此流中删除，但它仍将位于可用输出列表中。
                <i>全局</i>删除输出会将其从该流和所有其他流中删除并终止它。
                您可以在{' '} <Link to={Routes.SYSTEM.OUTPUTS}>全局输出列表</Link>中详细查看所有定义的输出。
              </SupportLink>
            </Col>
          </ContentHeadRow>
          <OutputsComponent streamId={stream.id} permissions={currentUser.permissions} />
        </div>
      </DocumentTitle>
    );
  },
});

export default withParams(StreamOutputsPage);
