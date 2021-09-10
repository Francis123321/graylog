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
import createReactClass from 'create-react-class';
import lodash from 'lodash';
import moment from 'moment';

import { Button, FormGroup, HelpBlock } from 'components/graylog';
import { BootstrapModalForm } from 'components/bootstrap';
import { IfPermitted, TimeUnitInput } from 'components/common';
import FormUtils from 'util/FormsUtils';
import Input from 'components/bootstrap/Input';
import { extractDurationAndUnit } from 'components/common/TimeUnitInput';

const TIME_UNITS = ['HOURS', 'MINUTES', 'SECONDS'];
const DEFAULT_CATCH_UP_WINDOW = 3600000;

const EventsConfig = createReactClass({
  displayName: 'EventsConfig',

  propTypes: {
    config: PropTypes.shape({
      events_search_timeout: PropTypes.number,
      events_notification_retry_period: PropTypes.number,
      events_notification_default_backlog: PropTypes.number,
      events_catchup_window: PropTypes.number,
    }),
    updateConfig: PropTypes.func.isRequired,
  },

  getDefaultProps() {
    return {
      config: {
        events_search_timeout: 60000,
        events_notification_retry_period: 300000,
        events_notification_default_backlog: 50,
        events_catchup_window: DEFAULT_CATCH_UP_WINDOW,
      },
    };
  },

  getInitialState() {
    const { config } = this.props;

    return {
      config: config,
    };
  },

  UNSAFE_componentWillReceiveProps(newProps) {
    this.setState({ config: newProps.config });
  },

  _openModal() {
    this.modal.open();
  },

  _closeModal() {
    this.modal.close();
  },

  _resetConfig() {
    // Reset to initial state when the modal is closed without saving.
    this.setState(this.getInitialState());
  },

  _saveConfig() {
    const { updateConfig } = this.props;
    const { config } = this.state;

    updateConfig(config).then(() => {
      this._closeModal();
    });
  },

  _propagateChanges(key, value) {
    const { config } = this.state;
    const nextConfig = lodash.cloneDeep(config);

    nextConfig[key] = value;
    this.setState({ config: nextConfig });
  },

  _onSearchTimeoutUpdate(nextValue, nextUnit, enabled) {
    const durationInMs = enabled ? moment.duration(nextValue, nextUnit).asMilliseconds() : 0;

    if (this._searchTimeoutValidator(durationInMs)) {
      this._propagateChanges('events_search_timeout', durationInMs);
    }
  },

  _onRetryPeriodUpdate(nextValue, nextUnit, enabled) {
    const durationInMs = enabled ? moment.duration(nextValue, nextUnit).asMilliseconds() : 0;

    if (this._notificationsRetryValidator(durationInMs)) {
      this._propagateChanges('events_notification_retry_period', durationInMs);
    }
  },

  _searchTimeoutValidator(milliseconds) {
    return milliseconds >= 1000;
  },

  _notificationsRetryValidator(milliseconds) {
    return milliseconds >= 0;
  },

  _onBacklogUpdate(event) {
    const value = FormUtils.getValueFromInput(event.target);

    this._propagateChanges('events_notification_default_backlog', value);
  },

  _onCatchUpWindowUpdate(nextValue, nextUnit, nextEnabled) {
    const { config } = this.state;

    if (config.events_catchup_window === 0 && nextEnabled) {
      this._propagateChanges('events_catchup_window', DEFAULT_CATCH_UP_WINDOW);

      return;
    }

    const catchupWindowinMs = nextEnabled ? moment.duration(nextValue, nextUnit).asMilliseconds() : 0;

    this._propagateChanges('events_catchup_window', catchupWindowinMs);
  },

  _titleCase(str) {
    return lodash.capitalize(str);
  },

  render() {
    const { config } = this.state;
    const eventsSearchTimeout = extractDurationAndUnit(config.events_search_timeout, TIME_UNITS);
    const eventsNotificationRetryPeriod = extractDurationAndUnit(config.events_notification_retry_period, TIME_UNITS);
    const eventsCatchupWindow = extractDurationAndUnit(config.events_catchup_window, TIME_UNITS);
    const eventsNotificationDefaultBacklog = config.events_notification_default_backlog;

    return (
      <div>
        <h2>活动系统</h2>

        <dl className="deflist">
          <dt>搜索超时 :</dt>
          <dd>{eventsSearchTimeout.duration} {this._titleCase(eventsSearchTimeout.unit)}</dd>
          <dt>通知重试:</dt>
          <dd>{eventsNotificationRetryPeriod.duration} {this._titleCase(eventsNotificationRetryPeriod.unit)}</dd>
          <dt>通知积压:</dt>
          <dd>{eventsNotificationDefaultBacklog}</dd>
          <dt>追赶窗口 :</dt>
          <dd>{eventsCatchupWindow.duration > 0 ? eventsCatchupWindow.duration : 'disabled'} {eventsCatchupWindow.duration > 0 ? this._titleCase(eventsCatchupWindow.unit) : ''}</dd>
        </dl>

        <IfPermitted permissions="clusterconfigentry:edit">
          <Button bsStyle="info" bsSize="xs" onClick={this._openModal}>修改</Button>
        </IfPermitted>

        <BootstrapModalForm ref={(modal) => { this.modal = modal; }}
                            title="更新事件系统配置"
                            onSubmitForm={this._saveConfig}
                            onModalClose={this._resetConfig}
                            submitButtonText="Save">
          <fieldset>
            <FormGroup controlId="search-timeout-field">
              <TimeUnitInput label="搜索超时"
                             update={this._onSearchTimeoutUpdate}
                             value={eventsSearchTimeout.duration}
                             unit={eventsSearchTimeout.unit}
                             units={TIME_UNITS}
                             required />
              <HelpBlock>
                Elasticsearch 查询中断的时间量。 （最小超时时间为 1 秒）
              </HelpBlock>
            </FormGroup>
            <FormGroup controlId="notifications-retry-field">
              <TimeUnitInput label="通知重试期"
                             update={this._onRetryPeriodUpdate}
                             value={eventsNotificationRetryPeriod.duration}
                             unit={eventsNotificationRetryPeriod.unit}
                             units={TIME_UNITS}
                             required />
              <HelpBlock>
                重新发送失败通知之前的时间量。 （最小值为 0 或立即重试）
              </HelpBlock>
            </FormGroup>
            <Input id="notification-backlog-field"
                   type="number"
                   onChange={this._onBacklogUpdate}
                   label="默认通知积压大小"
                   help="默认情况下，通知中包含的日志消息数量。"
                   value={eventsNotificationDefaultBacklog}
                   min="0"
                   required />
            <FormGroup controlId="catch-up-window">
              <TimeUnitInput label="赶上窗口大小"
                             update={this._onCatchUpWindowUpdate}
                             value={eventsCatchupWindow.duration}
                             unit={eventsCatchupWindow.unit}
                             enabled={eventsCatchupWindow.duration > 0}
                             units={TIME_UNITS} />
              <HelpBlock>
                如果事件处理器执行落后于计划，则将使用此窗口大小运行对旧数据的查询以加快处理速度。 （如果在事件定义的”最后一个设置中搜索“更大，则此设置将被忽略）
              </HelpBlock>
            </FormGroup>
          </fieldset>
        </BootstrapModalForm>
      </div>
    );
  },
});

export default EventsConfig;
