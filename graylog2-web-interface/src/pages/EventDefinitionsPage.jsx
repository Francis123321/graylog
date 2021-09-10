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
import { Button, ButtonToolbar, Col, Row } from 'components/graylog';
import { DocumentTitle, IfPermitted, PageHeader } from 'components/common';
import DocumentationLink from 'components/support/DocumentationLink';
import EventDefinitionsContainer from 'components/event-definitions/event-definitions/EventDefinitionsContainer';
import Routes from 'routing/Routes';
import DocsHelper from 'util/DocsHelper';

const EventDefinitionsPage = () => {
  return (
    <DocumentTitle title="Event Definitions">
      <span>
        <PageHeader title="事件定义">
          <span>
            创建新的事件定义，允许您搜索不同的条件并对其发出警报。
          </span>

          <span>
            Graylog 的新警报系统让您可以定义更灵活、更强大的规则。 在<DocumentationLink page={DocsHelper.PAGES.ALERTS} text="文档" />中了解更多信息
          </span>

          <ButtonToolbar>
            <LinkContainer to={Routes.ALERTS.LIST}>
              <Button bsStyle="info">警报和事件</Button>
            </LinkContainer>
            <LinkContainer to={Routes.ALERTS.DEFINITIONS.LIST}>
              <Button bsStyle="info">事件定义</Button>
            </LinkContainer>
            <LinkContainer to={Routes.ALERTS.NOTIFICATIONS.LIST}>
              <Button bsStyle="info">通知</Button>
            </LinkContainer>
          </ButtonToolbar>
        </PageHeader>

        <Row className="content">
          <Col md={12}>
            <EventDefinitionsContainer />
          </Col>
        </Row>
      </span>
    </DocumentTitle>
  );
};

export default EventDefinitionsPage;
