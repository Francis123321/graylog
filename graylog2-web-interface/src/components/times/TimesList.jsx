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
import moment from 'moment';

import { Col, Row } from 'components/graylog';
import DateTime from 'logic/datetimes/DateTime';
import StoreProvider from 'injection/StoreProvider';
import { Spinner, Timestamp } from 'components/common';

const CurrentUserStore = StoreProvider.getStore('CurrentUser');
const SystemStore = StoreProvider.getStore('System');

const TimesList = createReactClass({
  displayName: 'TimesList',
  mixins: [Reflux.connect(CurrentUserStore), Reflux.connect(SystemStore)],

  getInitialState() {
    return { time: moment() };
  },

  componentDidMount() {
    this.interval = setInterval(() => this.setState(this.getInitialState()), 1000);
  },

  componentWillUnmount() {
    clearInterval(this.interval);
  },

  render() {
    if (!this.state.system) {
      return <Spinner />;
    }

    const { time } = this.state;
    const timeFormat = DateTime.Formats.DATETIME_TZ;
    const { currentUser } = this.state;
    const serverTimezone = this.state.system.timezone;

    return (
      <Row className="content">
        <Col md={12}>
          <h2>时间配置</h2>

          <p className="description">
            处理时区可能会令人困惑。 在这里，您可以看到应用于系统不同组件的时区。 您可以在其各自的详细信息页面上检查特定 graylog-server 节点的时区设置。
          </p>

          <dl className="system-dl">
            <dt>用户 <em>{currentUser.username}</em>:</dt>
            <dd><Timestamp dateTime={time} format={timeFormat} /></dd>
            <dt>您的网络浏览器:</dt>
            <dd><Timestamp dateTime={time} format={timeFormat} tz="browser" /></dd>
            <dt>Graylog 服务器:</dt>
            <dd><Timestamp dateTime={time} format={timeFormat} tz={serverTimezone} /></dd>
          </dl>
        </Col>
      </Row>
    );
  },
});

export default TimesList;
