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
import { PluginStore } from 'graylog-web-plugin/plugin';
import lodash from 'lodash';
import naturalSort from 'javascript-natural-sort';

import { Clearfix, Col, ControlLabel, FormGroup, HelpBlock, Row } from 'components/graylog';
import { Select } from 'components/common';
import HelpPanel from 'components/event-definitions/common/HelpPanel';

import styles from './EventConditionForm.css';

import commonStyles from '../common/commonStyles.css';

class EventConditionForm extends React.Component {
  static propTypes = {
    eventDefinition: PropTypes.object.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    currentUser: PropTypes.object.isRequired, // Prop is passed down to pluggable entities
    validation: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  getConditionPlugin = (type) => {
    if (type === undefined) {
      return {};
    }

    return PluginStore.exports('eventDefinitionTypes').find((edt) => edt.type === type) || {};
  };

  sortedEventDefinitionTypes = () => {
    return PluginStore.exports('eventDefinitionTypes').sort((edt1, edt2) => {
      // Try to sort by given sort order and displayName if possible, otherwise do it by displayName
      const edt1Order = edt1.sortOrder;
      const edt2Order = edt2.sortOrder;

      if (edt1Order !== undefined || edt2Order !== undefined) {
        const sort = lodash.defaultTo(edt1Order, Number.MAX_SAFE_INTEGER) - lodash.defaultTo(edt2Order, Number.MAX_SAFE_INTEGER);

        if (sort !== 0) {
          return sort;
        }
      }

      return naturalSort(edt1.displayName, edt2.displayName);
    });
  };

  formattedEventDefinitionTypes = () => {
    return this.sortedEventDefinitionTypes()
      .map((type) => ({ label: type.displayName, value: type.type }));
  };

  handleEventDefinitionTypeChange = (nextType) => {
    const { onChange } = this.props;
    const conditionPlugin = this.getConditionPlugin(nextType);
    const defaultConfig = conditionPlugin.defaultConfig || {};

    onChange('config', { ...defaultConfig, type: nextType });
  };

  renderConditionTypeDescriptions = () => {
    const typeDescriptions = this.sortedEventDefinitionTypes()
      .map((type) => {
        return (
          <React.Fragment key={type.type}>
            <dt>{type.displayName}</dt>
            <dd>{type.description || 'No description available.'}</dd>
          </React.Fragment>
        );
      });

    return <dl>{typeDescriptions}</dl>;
  };

  render() {
    const { eventDefinition, validation } = this.props;
    const eventDefinitionType = this.getConditionPlugin(eventDefinition.config.type);

    const eventDefinitionTypeComponent = eventDefinitionType.formComponent
      ? React.createElement(eventDefinitionType.formComponent, {
        ...this.props,
        key: eventDefinition.id,
      })
      : null;

    return (
      <Row>
        <Col md={7} lg={6}>
          <h2 className={commonStyles.title}>事件条件</h2>

          <p>
            配置 Graylog 应如何创建此类事件。 您可以稍后将这些事件用作其他条件的输入，从而可以基于其他条件构建强大的条件。
          </p>

          <FormGroup controlId="event-definition-priority" validationState={validation.errors.config ? 'error' : null}>
            <ControlLabel>条件类型</ControlLabel>
            <Select placeholder="选择条件类型"
                    options={this.formattedEventDefinitionTypes()}
                    value={eventDefinition.config.type}
                    onChange={this.handleEventDefinitionTypeChange}
                    clearable={false}
                    required />
            <HelpBlock>
              {lodash.get(validation, 'errors.config[0]', '选择此事件的条件类型。')}
            </HelpBlock>
          </FormGroup>
        </Col>

        <Col md={5} lg={5} lgOffset={1}>
          <HelpPanel className={styles.conditionTypesInfo}
                     title="可用条件">
            {this.renderConditionTypeDescriptions()}
          </HelpPanel>
        </Col>
        <Clearfix />

        {eventDefinitionTypeComponent && (
          <>
            <hr className={styles.hr} />
            <Col md={12}>
              {eventDefinitionTypeComponent}
            </Col>
          </>
        )}
      </Row>
    );
  }
}

export default EventConditionForm;
