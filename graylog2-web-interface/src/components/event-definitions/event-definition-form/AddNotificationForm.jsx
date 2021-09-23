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

import { Select } from 'components/common';
import { Button, ButtonToolbar, Col, ControlLabel, FormGroup, HelpBlock, Row } from 'components/graylog';
import EventNotificationFormContainer
  from 'components/event-notifications/event-notification-form/EventNotificationFormContainer';

import commonStyles from '../common/commonStyles.css';

class AddNotificationForm extends React.Component {
  static propTypes = {
    notifications: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    hasCreationPermissions: PropTypes.bool,
  };

  static defaultProps = {
    hasCreationPermissions: false,
  };

  state = {
    selectedNotification: undefined,
    displayNewNotificationForm: false,
  };

  handleNewNotificationSubmit = (promise) => {
    const { onChange } = this.props;

    promise.then((notification) => onChange(notification.id));
  };

  handleSubmit = () => {
    const { onChange } = this.props;
    const { selectedNotification } = this.state;

    onChange(selectedNotification);
  };

  handleSelectNotificationChange = (nextNotificationId) => {
    if (nextNotificationId === 'create') {
      this.setState({ displayNewNotificationForm: true });

      return;
    }

    this.setState({ selectedNotification: nextNotificationId, displayNewNotificationForm: false });
  };

  formatNotifications = (notifications) => {
    const { hasCreationPermissions } = this.props;
    const formattedNotifications = notifications.map((n) => ({ label: n.title, value: n.id }));

    if (hasCreationPermissions) {
      formattedNotifications.unshift({
        label: '创建新通知...',
        value: 'create',
      });
    }

    return formattedNotifications;
  };

  render() {
    const { notifications, onCancel } = this.props;
    const { displayNewNotificationForm, selectedNotification } = this.state;
    const doneButton = displayNewNotificationForm
      ? <Button bsStyle="primary" type="submit" form="new-notification-form">完毕</Button>
      : <Button bsStyle="primary" onClick={this.handleSubmit}>完毕</Button>;

    return (
      <Row>
        <Col md={7} lg={6}>
          <h2 className={commonStyles.title}>添加通知</h2>

          <fieldset>
            <FormGroup controlId="notification-select">
              <ControlLabel>选择通知</ControlLabel>
              <Select id="notification-select"
                      matchProp="label"
                      placeholder="选择通知"
                      onChange={this.handleSelectNotificationChange}
                      options={this.formatNotifications(notifications)}
                      value={selectedNotification} />
              <HelpBlock>
                选择要在此类警报上使用的通知，或创建一个新的通知，您以后可以在其他警报中使用。
              </HelpBlock>
            </FormGroup>

            {displayNewNotificationForm && (
              <EventNotificationFormContainer action="create"
                                              formId="new-notification-form"
                                              onSubmit={this.handleNewNotificationSubmit}
                                              embedded />
            )}
          </fieldset>

          <ButtonToolbar>
            {doneButton}
            <Button onClick={onCancel}>取消</Button>
          </ButtonToolbar>
        </Col>
      </Row>
    );
  }
}

export default AddNotificationForm;
