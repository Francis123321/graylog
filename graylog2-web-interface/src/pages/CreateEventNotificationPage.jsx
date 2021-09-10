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
import { DocumentTitle, IfPermitted, PageHeader } from 'components/common';
import DocumentationLink from 'components/support/DocumentationLink';
import Routes from 'routing/Routes';
import DocsHelper from 'util/DocsHelper';
import CombinedProvider from 'injection/CombinedProvider';
import connect from 'stores/connect';
import PermissionsMixin from 'util/PermissionsMixin';
import history from 'util/History';
import EventNotificationFormContainer from 'components/event-notifications/event-notification-form/EventNotificationFormContainer';

const { CurrentUserStore } = CombinedProvider.get('CurrentUser');

const CreateEventDefinitionPage = ({ currentUser }) => {
  if (!PermissionsMixin.isPermitted(currentUser.permissions, 'eventnotifications:create')) {
    history.push(Routes.NOTFOUND);
  }

  return (
    <DocumentTitle title="New Notification">
      <span>
        <PageHeader title="新通知 ">
          <span>
            通知会在发生任何配置的事件时提醒您。 Graylog 可以直接向您或您为此目的使用的其他系统发送通知
          </span>

          <span>
            Graylog 的新警报系统让您可以定义更灵活、更强大的规则。 在<DocumentationLink page={DocsHelper.PAGES.ALERTS} text="文档" />中了解更多信息
          </span>

          <ButtonToolbar>
            <LinkContainer to={Routes.ALERTS.LIST}>
              <Button bsStyle="info">警报和事件</Button>
            </LinkContainer>
            <IfPermitted permissions="eventdefinitions:read">
              <LinkContainer to={Routes.ALERTS.DEFINITIONS.LIST}>
                <Button bsStyle="info">事件定义</Button>
              </LinkContainer>
            </IfPermitted>
            <IfPermitted permissions="eventnotifications:read">
              <LinkContainer to={Routes.ALERTS.NOTIFICATIONS.LIST}>
                <Button bsStyle="info">通知</Button>
              </LinkContainer>
            </IfPermitted>
          </ButtonToolbar>
        </PageHeader>

        <Row className="content">
          <Col md={12}>
            <EventNotificationFormContainer action="create" />
          </Col>
        </Row>
      </span>
    </DocumentTitle>
  );
};

CreateEventDefinitionPage.propTypes = {
  currentUser: PropTypes.object.isRequired,
};

export default connect(CreateEventDefinitionPage, {
  currentUser: CurrentUserStore,
},
({ currentUser }) => ({ currentUser: currentUser.currentUser }));
