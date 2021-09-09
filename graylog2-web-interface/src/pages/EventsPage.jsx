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
import EventsContainer from 'components/events/events/EventsContainer';
import DocsHelper from 'util/DocsHelper';
import Routes from 'routing/Routes';
import withLocation from 'routing/withLocation';

const EventsPage = ({ location }) => {
  const filteredSourceStream = location.query.stream_id;

  return (
    <DocumentTitle title="Alerts &amp; Events1">
      <span>
        <PageHeader title="警报和事件">
          <span>
            通过不同的条件定义事件。 向需要您注意以创建警报的事件添加通知。
          </span>
          <span>
            Graylog 的新警报系统让您可以定义更灵活、更强大的规则。 在{' '}
            <DocumentationLink page={DocsHelper.PAGES.ALERTS}
                               text="文档" />中了解更多信息
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
            <EventsContainer key={filteredSourceStream} streamId={filteredSourceStream} />
          </Col>
        </Row>
      </span>
    </DocumentTitle>
  );
};

EventsPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default withLocation(EventsPage);
