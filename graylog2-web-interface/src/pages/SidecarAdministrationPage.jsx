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

import { LinkContainer } from 'components/graylog/router';
import { ButtonToolbar, Col, Row, Button } from 'components/graylog';
import DocsHelper from 'util/DocsHelper';
import { DocumentTitle, PageHeader } from 'components/common';
import Routes from 'routing/Routes';
import DocumentationLink from 'components/support/DocumentationLink';
import CollectorsAdministrationContainer from 'components/sidecars/administration/CollectorsAdministrationContainer';
import withLocation from 'routing/withLocation';

const SidecarAdministrationPage = ({ location: { query: { node_id: nodeId } } }) => (
  <DocumentTitle title="Collectors Administration">
    <span>
      <PageHeader title="收藏家管理">
        <span>
          Graylog 收集器可以可靠地从您的服务器转发日志文件或 Windows EventLog 的内容。
        </span>

        <span>
          在 <DocumentationLink page={DocsHelper.PAGES.COLLECTOR_SIDECAR} text="Graylog 文档" /> 中阅读有关收集器以及如何设置收集器的更多信息。
        </span>

        <ButtonToolbar>
          <LinkContainer to={Routes.SYSTEM.SIDECARS.OVERVIEW}>
            <Button bsStyle="info">概述</Button>
          </LinkContainer>
          <LinkContainer to={Routes.SYSTEM.SIDECARS.ADMINISTRATION}>
            <Button bsStyle="info">行政</Button>
          </LinkContainer>
          <LinkContainer to={Routes.SYSTEM.SIDECARS.CONFIGURATION}>
            <Button bsStyle="info">配置</Button>
          </LinkContainer>
        </ButtonToolbar>
      </PageHeader>

      <Row className="content">
        <Col md={12}>
          <CollectorsAdministrationContainer nodeId={nodeId} />
        </Col>
      </Row>
    </span>
  </DocumentTitle>
);

SidecarAdministrationPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default withLocation(SidecarAdministrationPage);
