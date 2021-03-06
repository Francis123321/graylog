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
import numeral from 'numeral';
import moment from 'moment';

import { LinkContainer } from 'components/graylog/router';
import { Alert, Col, Row, Button } from 'components/graylog';
import { Icon, Spinner } from 'components/common';
import StoreProvider from 'injection/StoreProvider';
import DocsHelper from 'util/DocsHelper';
import Routes from 'routing/Routes';
import { SmallSupportLink, DocumentationLink } from 'components/support';

const IndexerFailuresStore = StoreProvider.getStore('IndexerFailures');

class IndexerFailuresComponent extends React.Component {
  state = {};

  componentDidMount() {
    const since = moment().subtract(24, 'hours');

    IndexerFailuresStore.count(since).then((response) => {
      this.setState({ total: response.count });
    });
  }

  _formatFailuresSummary = () => {
    return (
      <Alert bsStyle={this.state.total === 0 ? 'success' : 'danger'}>
        <Icon name={this._iconForFailureCount(this.state.total)} /> {this._formatTextForFailureCount(this.state.total)}

        <LinkContainer to={Routes.SYSTEM.INDICES.FAILURES}>
          <Button bsStyle="info" bsSize="xs" className="pull-right">
            显示错误
          </Button>
        </LinkContainer>
      </Alert>
    );
  };

  _formatTextForFailureCount = (count) => {
    if (count === 0) {
      return '在过去 24 小时内没有失败的索引尝试。';
    }

    return <strong>在过去 24 小时内有 {numeral(count).format('0,0')} 次失败的索引尝试。</strong>;
  };

  _iconForFailureCount = (count) => {
    if (count === 0) {
      return 'check-circle';
    }

    return 'ambulance';
  };

  render() {
    let content;

    if (this.state.total === undefined) {
      content = <Spinner />;
    } else {
      content = this._formatFailuresSummary();
    }

    return (
      <Row className="content">
        <Col md={12}>
          <h2>索引器故障</h2>

          <SmallSupportLink>
            每条未成功索引的消息都将记录为索引器故障。 您可以在<DocumentationLink page={DocsHelper.PAGES.INDEXER_FAILURES} text="Graylog文档" />中了解有关此功能的更多信息。
          </SmallSupportLink>

          {content}
        </Col>
      </Row>
    );
  }
}

export default IndexerFailuresComponent;
