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

import { Link } from 'components/graylog/router';
import { Col, Label } from 'components/graylog';
import { EntityListItem, Timestamp } from 'components/common';
import Routes from 'routing/Routes';
import DateTime from 'logic/datetimes/DateTime';

import styles from './Alert.css';

class Alert extends React.Component {
  static propTypes = {
    alert: PropTypes.object.isRequired,
    alertCondition: PropTypes.object,
    stream: PropTypes.object.isRequired,
    conditionType: PropTypes.object.isRequired,
  };

  static defaultProps = {
    alertCondition: {},
  };

  state = {
    showAlarmCallbackHistory: false,
  };

  render() {
    const { alert, alertCondition, stream, conditionType } = this.props;

    let alertTitle;

    if (alertCondition) {
      alertTitle = (
        <span>
          <Link to={Routes.show_alert(alert.id)}>
            {alertCondition.title || 'Untitled alert'}
          </Link>
          {' '}
          <small>on stream <em>{stream.title}</em></small>
        </span>
      );
    } else {
      alertTitle = (
        <span>
          <Link to={Routes.show_alert(alert.id)}>Unknown alert</Link>
        </span>
      );
    }

    let statusBadge;

    if (!alert.is_interval || alert.resolved_at) {
      statusBadge = <Label bsStyle="success">Resolved</Label>;
    } else {
      statusBadge = <Label bsStyle="danger">Unresolved</Label>;
    }

    let alertTime = <Timestamp dateTime={alert.triggered_at} format={DateTime.Formats.DATETIME} />;

    if (alert.is_interval) {
      alertTime = (
        <span>
          Triggered at {alertTime},&nbsp;
          {alert.resolved_at
            ? <span>resolved at <Timestamp dateTime={alert.resolved_at} format={DateTime.Formats.DATETIME} />.</span>
            : <span><strong>still ongoing</strong>.</span>}
        </span>
      );
    } else {
      alertTime = (
        <span>
          Triggered at {alertTime}
        </span>
      );
    }

    const content = (
      <Col md={12}>
        <dl className={`dl-horizontal ${styles.alertDescription}`}>
          <dt>Reason:</dt>
          <dd>{alert.description}</dd>
          <dt>Type:</dt>
          <dd>{conditionType.name || '未知类型。 这通常意味着自触发警报以来警报条件已被删除。'}</dd>
        </dl>
      </Col>
    );

    return (
      <EntityListItem key={`entry-list-${alert.id}`}
                      title={alertTitle}
                      titleSuffix={statusBadge}
                      description={alertTime}
                      contentRow={content} />
    );
  }
}

export default Alert;
