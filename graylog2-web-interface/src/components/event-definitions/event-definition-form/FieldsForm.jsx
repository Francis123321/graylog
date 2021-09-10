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
import lodash from 'lodash';

import { Alert, Col, OverlayTrigger, Row, Button } from 'components/graylog';
import { Icon } from 'components/common';
import EventKeyHelpPopover from 'components/event-definitions/common/EventKeyHelpPopover';

import FieldForm from './FieldForm';
import FieldsList from './FieldsList';

// Import built-in Field Value Providers
import {} from './field-value-providers';

import commonStyles from '../common/commonStyles.css';

class FieldsForm extends React.Component {
  static propTypes = {
    eventDefinition: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    validation: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  state = {
    editField: undefined,
    showFieldForm: false,
  };

  removeCustomField = (fieldName) => {
    const { eventDefinition, onChange } = this.props;
    const nextFieldSpec = lodash.omit(eventDefinition.field_spec, fieldName);

    onChange('field_spec', nextFieldSpec);

    // Filter out all non-existing field names from key_spec
    const fieldNames = Object.keys(nextFieldSpec);
    const nextKeySpec = eventDefinition.key_spec.filter((key) => fieldNames.includes(key));

    onChange('key_spec', nextKeySpec);
  };

  addCustomField = (prevFieldName, fieldName, config, isKey, keyPosition) => {
    const { eventDefinition, onChange } = this.props;
    const nextFieldSpec = (prevFieldName === fieldName
      ? lodash.cloneDeep(eventDefinition.field_spec)
      : lodash.omit(eventDefinition.field_spec, prevFieldName));

    nextFieldSpec[fieldName] = config;
    onChange('field_spec', nextFieldSpec);

    // Filter out all non-existing field names from key_spec and the current field name
    const fieldNames = Object.keys(nextFieldSpec);
    let nextKeySpec = eventDefinition.key_spec.filter((key) => fieldNames.includes(key) && key !== fieldName);

    if (isKey) {
      // Add key to its new position
      nextKeySpec = [...nextKeySpec.slice(0, keyPosition), fieldName, ...nextKeySpec.slice(keyPosition)];
    }

    onChange('key_spec', nextKeySpec);

    this.toggleFieldForm();
  };

  toggleFieldForm = (fieldName) => {
    const { showFieldForm } = this.state;

    this.setState({ showFieldForm: !showFieldForm, editField: showFieldForm ? undefined : fieldName });
  };

  render() {
    const { eventDefinition, validation, currentUser } = this.props;
    const { editField, showFieldForm } = this.state;

    if (showFieldForm) {
      return (
        <FieldForm keys={eventDefinition.key_spec}
                   fieldName={editField}
                   config={editField ? eventDefinition.field_spec[editField] : undefined}
                   currentUser={currentUser}
                   onChange={this.addCustomField}
                   onCancel={this.toggleFieldForm} />
      );
    }

    const fieldErrors = lodash.get(validation, 'errors.field_spec', []);
    const keyErrors = lodash.get(validation, 'errors.key_spec', []);
    const errors = [...fieldErrors, ...keyErrors];

    return (
      <Row>
        <Col md={12}>
          <h2 className={commonStyles.title}>事件字段<small>（可选）</small></h2>
          <p>
            通过添加自定义字段，在从此事件定义生成的事件中包含其他信息。 这可以帮助您在接收通知时搜索事件或获得更多上下文。
          </p>

          {errors.length > 0 && (
            <Alert bsStyle="danger" className={commonStyles.validationSummary}>
              <h4>有错误的字段</h4>
              <p>请在保存此事件定义之前更正以下错误：</p>
              <ul>
                {errors.map((error) => {
                  return <li key={error}>{error}</li>;
                })}
              </ul>
            </Alert>
          )}

          {Object.keys(eventDefinition.field_spec).length > 0 && (
            <dl>
              <dt>
                Keys
                <OverlayTrigger placement="right"
                                trigger={['click', 'hover']}
                                overlay={<EventKeyHelpPopover id="key-header-popover" />}>
                  <Button bsStyle="link" bsSize="xsmall"><Icon name="question-circle" /></Button>
                </OverlayTrigger>
              </dt>
              <dd>{eventDefinition.key_spec.length > 0 ? eventDefinition.key_spec.join(', ') : '尚未配置密钥。'}</dd>
            </dl>
          )}
          <FieldsList fields={eventDefinition.field_spec}
                      validation={validation}
                      keys={eventDefinition.key_spec}
                      onAddFieldClick={this.toggleFieldForm}
                      onEditFieldClick={this.toggleFieldForm}
                      onRemoveFieldClick={this.removeCustomField} />
        </Col>
      </Row>
    );
  }
}

export default FieldsForm;
