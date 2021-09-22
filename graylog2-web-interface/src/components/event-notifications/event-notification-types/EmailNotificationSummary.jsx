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

import { Well } from 'components/graylog';

import CommonNotificationSummary from './CommonNotificationSummary';
import styles from './EmailNotificationSummary.css';

class EmailNotificationSummary extends React.Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    notification: PropTypes.object,
    definitionNotification: PropTypes.object.isRequired,
  };

  static defaultProps = {
    notification: {},
  };

  render() {
    const { notification } = this.props;

    return (
      <CommonNotificationSummary {...this.props}>
        <>
          <tr>
            <td>发件人</td>
            <td>{notification.config.sender}</td>
          </tr>
          <tr>
            <td>主题</td>
            <td>{notification.config.subject}</td>
          </tr>
          <tr>
            <td>用户收件人</td>
            <td>{notification.config.user_recipients.join(', ') || '没有用户会收到此通知。'}</td>
          </tr>
          <tr>
            <td>电子邮件收件人</td>
            <td>
              {notification.config.email_recipients.join(', ') || '没有配置电子邮件地址来接收此通知。'}
            </td>
          </tr>
          <tr>
            <td>电子邮件正文</td>
            <td>
              <Well bsSize="small" className={styles.bodyPreview}>
                {notification.config.body_template || <em>Empty body</em>}
              </Well>
            </td>
          </tr>
          <tr>
            <td>电子邮件 HTML 正文</td>
            <td>
              <Well bsSize="small" className={styles.bodyPreview}>
                {notification.config.html_body_template || <em>Empty HTML body</em>}
              </Well>
            </td>
          </tr>
        </>
      </CommonNotificationSummary>
    );
  }
}

export default EmailNotificationSummary;
