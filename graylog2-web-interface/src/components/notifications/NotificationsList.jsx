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
import createReactClass from 'create-react-class';
import Reflux from 'reflux';

import StoreProvider from 'injection/StoreProvider';
import { Alert, Row, Col } from 'components/graylog';
import { Icon, Spinner } from 'components/common';
import Notification from 'components/notifications/Notification';

const NotificationsStore = StoreProvider.getStore('Notifications');

const NotificationsList = createReactClass({
  displayName: 'NotificationsList',
  mixins: [Reflux.connect(NotificationsStore)],

  _formatNotificationCount(count) {
    if (count === 0) {
      return '没有通知';
    }

    if (count === 1) {
      return '没有通知';
    }

    return `有 ${count} 条通知`;
  },

  render() {
    if (!this.state.notifications) {
      return <Spinner />;
    }

    const count = this.state.total;

    let title;
    let content;

    if (count === 0) {
      title = '没有通知';

      content = (
        <Alert bsStyle="success" className="notifications-none">
          <Icon name="check-circle" />{' '}
          &nbsp;没有通知
        </Alert>
      );
    } else {
      title = `这里${this._formatNotificationCount(count)}`;

      content = this.state.notifications.map((notification) => {
        return <Notification key={`${notification.type}-${notification.timestamp}`} notification={notification} />;
      });
    }

    return (
      <Row className="content">
        <Col md={12}>
          <h2>{title}</h2>
          <p className="description">
            通知由 Graylog 触发并指示您应该采取行动的情况。 如果您需要更多信息或帮助，许多通知类型还将提供指向 Graylog 文档的链接。
          </p>

          {content}
        </Col>
      </Row>
    );
  },
});

export default NotificationsList;
