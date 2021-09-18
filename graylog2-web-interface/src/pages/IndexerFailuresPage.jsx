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

import { Col, Row } from 'components/graylog';
import StoreProvider from 'injection/StoreProvider';
import DocsHelper from 'util/DocsHelper';
import { DocumentTitle, Spinner, PageHeader, PaginatedList } from 'components/common';
import { DocumentationLink } from 'components/support';
import { IndexerFailuresList } from 'components/indexers';

const IndexerFailuresStore = StoreProvider.getStore('IndexerFailures');

class IndexerFailuresPage extends React.Component {
  state = {};

  componentDidMount() {
    IndexerFailuresStore.count(moment().subtract(10, 'years')).then((response) => {
      this.setState({ total: response.count });
    });

    this.loadData(1, this.defaultPageSize);
  }

  defaultPageSize = 50;

  loadData = (page, size) => {
    IndexerFailuresStore.list(size, (page - 1) * size).then((response) => {
      this.setState({ failures: response.failures });
    });
  };

  _onChangePaginatedList = (page, size) => {
    this.loadData(page, size);
  };

  render() {
    if (this.state.total === undefined || !this.state.failures) {
      return <Spinner />;
    }

    return (
      <DocumentTitle title="Indexer failures">
        <span>
          <PageHeader title="索引器故障">
            <span>
              这是失败的消息索引尝试列表。 失败意味着您发送到 Graylog 的消息已正确处理，但将其写入 Elasticsearch 集群失败。 请注意，该列表的大小上限为 50 MB，因此它将包含大量失败日志，但不一定包含所有发生过的日志。
            </span>

            <span>
              包含总共{numeral(this.state.total).format('0,0')}个索引器故障的集合。 在<DocumentationLink page={DocsHelper.PAGES.INDEXER_FAILURES} text="文件" />中阅读有关此主题的更多信息。
            </span>
          </PageHeader>
          <Row className="content">
            <Col md={12}>
              <PaginatedList totalItems={this.state.total} onChange={this._onChangePaginatedList} pageSize={this.defaultPageSize}>
                <IndexerFailuresList failures={this.state.failures} />
              </PaginatedList>
            </Col>
          </Row>
        </span>
      </DocumentTitle>
    );
  }
}

export default IndexerFailuresPage;
