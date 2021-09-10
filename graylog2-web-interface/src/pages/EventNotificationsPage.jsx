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
import EventNotificationsContainer from 'components/event-notifications/event-notifications/EventNotificationsContainer';
import Routes from 'routing/Routes';

const EventNotificationsPage = () => {
  return (
    <DocumentTitle title="Notifications">
      <span>
        <PageHeader title="通知">
          <span>
            通知会在发生任何配置的事件时提醒您。 Graylog 可以直接向您或您为此目的使用的其他系统发送通知。
          </span>

          <span>
            请记住在创建或编辑事件定义时分配通知。
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
            <EventNotificationsContainer />
          </Col>
        </Row>
      </span>
    </DocumentTitle>
  );
};

export default EventNotificationsPage;
