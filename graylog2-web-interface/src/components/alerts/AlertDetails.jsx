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
import PropTypes from 'prop-types';
import React from 'react';

import { Col, Row } from 'components/graylog';
import { AlertMessages, AlertTimeline } from 'components/alerts';
import { AlarmCallbackHistoryOverview } from 'components/alarmcallbacks';
import CombinedProvider from 'injection/CombinedProvider';

const { AlarmCallbackHistoryActions } = CombinedProvider.get('AlarmCallbackHistory');
const { AlertNotificationsActions } = CombinedProvider.get('AlertNotifications');

class AlertDetails extends React.Component {
  static propTypes = {
    alert: PropTypes.object.isRequired,
    condition: PropTypes.object,
    conditionType: PropTypes.object,
    stream: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this._loadData();
  }

  _loadData = () => {
    AlertNotificationsActions.available();
    AlarmCallbackHistoryActions.list(this.props.alert.stream_id, this.props.alert.id);
  };

  render() {
    const { alert } = this.props;
    const { stream } = this.props;

    return (
      <div>
        <Row className="content">
          <Col md={12}>
            <h2>Alert timeline</h2>
            <p>
              这是警报期间发生的事件的时间线，您可以在下面查看有关某些事件的更多信息。
            </p>
            <AlertTimeline alert={alert}
                           stream={stream}
                           condition={this.props.condition}
                           conditionType={this.props.conditionType} />
          </Col>
        </Row>

        <Row className="content">
          <Col md={12}>
            <h2>Triggered notifications</h2>
            <p>
              这些是警报期间触发的通知，包括他们当时的配置。
            </p>
            <AlarmCallbackHistoryOverview alertId={alert.id} streamId={alert.stream_id} />
          </Col>
        </Row>

        <Row className="content">
          <Col md={12}>
            <AlertMessages alert={alert} stream={stream} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default AlertDetails;
