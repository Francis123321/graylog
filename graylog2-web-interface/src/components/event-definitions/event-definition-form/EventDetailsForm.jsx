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

import { Col, ControlLabel, FormGroup, HelpBlock, Row } from 'components/graylog';
import { Select } from 'components/common';
import { Input } from 'components/bootstrap';
import EventDefinitionPriorityEnum from 'logic/alerts/EventDefinitionPriorityEnum';
import * as FormsUtils from 'util/FormsUtils';

import commonStyles from '../common/commonStyles.css';

const priorityOptions = lodash.map(EventDefinitionPriorityEnum.properties, (value, key) => ({ value: key, label: lodash.upperFirst(value.name) }));

class EventDetailsForm extends React.Component {
  static propTypes = {
    eventDefinition: PropTypes.object.isRequired,
    validation: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  handleChange = (event) => {
    const { name } = event.target;
    const { onChange } = this.props;

    onChange(name, FormsUtils.getValueFromInput(event.target));
  };

  handlePriorityChange = (nextPriority) => {
    const { onChange } = this.props;

    onChange('priority', lodash.toNumber(nextPriority));
  };

  render() {
    const { eventDefinition, validation } = this.props;

    return (
      <Row>
        <Col md={7} lg={6}>
          <h2 className={commonStyles.title}>活动详情</h2>
          <fieldset>
            <Input id="event-definition-title"
                   name="title"
                   label="标题"
                   type="text"
                   bsStyle={validation.errors.title ? 'error' : null}
                   help={lodash.get(validation, 'errors.title[0]', '此事件定义的标题、从中创建的事件和警报。')}
                   value={eventDefinition.title}
                   onChange={this.handleChange}
                   required />

            <Input id="event-definition-description"
                   name="description"
                   label={<span>说明 <small className="text-muted">（可选）</small></span>}
                   type="textarea"
                   help="此事件定义的详细说明。"
                   value={eventDefinition.description}
                   onChange={this.handleChange}
                   rows={2} />

            <FormGroup controlId="event-definition-priority">
              <ControlLabel>优先事项</ControlLabel>
              <Select options={priorityOptions}
                      value={lodash.toString(eventDefinition.priority)}
                      onChange={this.handlePriorityChange}
                      clearable={false}
                      required />
              <HelpBlock>选择从此定义创建的事件的优先级。</HelpBlock>
            </FormGroup>
          </fieldset>
        </Col>
      </Row>
    );
  }
}

export default EventDetailsForm;
