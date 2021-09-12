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
import { Row, Col, Button } from 'components/graylog';
import { DocumentTitle, PageHeader } from 'components/common';
import DocumentationLink from 'components/support/DocumentationLink';
import ProcessingTimelineComponent from 'components/pipelines/ProcessingTimelineComponent';
import Routes from 'routing/Routes';
import DocsHelper from 'util/DocsHelper';

const PipelinesOverviewPage = () => (
  <DocumentTitle title="Pipelines">
    <div>
      <PageHeader title="管道概述">
        <span>
          管道使您可以转换和处理来自流的消息。 管道由评估和应用规则的阶段组成。 消息可以经过一个或多个阶段。
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
          <ProcessingTimelineComponent />
        </Col>
      </Row>
    </div>
  </DocumentTitle>
);

export default PipelinesOverviewPage;
