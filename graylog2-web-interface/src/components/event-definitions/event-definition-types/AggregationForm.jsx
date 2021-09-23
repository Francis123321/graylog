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

// TODO: This should be moved to a general place outside of `views`
import { defaultCompare } from 'views/logic/DefaultCompare';
import { MultiSelect } from 'components/common';

import AggregationConditionsForm from './AggregationConditionsForm';

import commonStyles from '../common/commonStyles.css';

class AggregationForm extends React.Component {
  // Memoize function to only format fields when they change. Use joined fieldNames as cache key.
  formatFields = lodash.memoize(
    (fieldTypes) => {
      return fieldTypes
        .sort((ftA, ftB) => defaultCompare(ftA.name, ftB.name))
        .map((fieldType) => {
          return {
            label: `${fieldType.name} – ${fieldType.value.type.type}`,
            value: fieldType.name,
          };
        });
    },
    (fieldTypes) => fieldTypes.map((ft) => ft.name).join('-'),
  );

  static propTypes = {
    eventDefinition: PropTypes.object.isRequired,
    validation: PropTypes.object.isRequired,
    allFieldTypes: PropTypes.array.isRequired,
    aggregationFunctions: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  propagateConfigChange = (update) => {
    const { eventDefinition, onChange } = this.props;
    const nextConfig = { ...eventDefinition.config, ...update };

    onChange('config', nextConfig);
  };

  handleGroupByChange = (nextValue) => {
    this.propagateConfigChange({ group_by: nextValue });
  };

  render() {
    const { allFieldTypes, aggregationFunctions, eventDefinition, validation } = this.props;
    const formattedFields = this.formatFields(allFieldTypes);

    return (
      <fieldset>
        <h2 className={commonStyles.title}>聚合</h2>
        <p>
          使用函数汇总与上面定义的过滤器匹配的日志消息。 您可以选择按相同的字段值对筛选结果进行分组。
        </p>
        <Row>
          <Col lg={7}>
            <FormGroup controlId="group-by">
              <ControlLabel>按字段分组<small className="text-muted">(可选)</small></ControlLabel>
              <MultiSelect id="group-by"
                           matchProp="label"
                           onChange={(selected) => this.handleGroupByChange(selected === '' ? [] : selected.split(','))}
                           options={formattedFields}
                           ignoreAccents={false}
                           value={lodash.defaultTo(eventDefinition.config.group_by, []).join(',')}
                           allowCreate />
              <HelpBlock>
                选择字段，当它们具有相同的值时，Graylog 应使用这些字段对筛选结果进行分组。<b>示例：</b><br />
                假设您创建了一个过滤器，其中包含网络中所有失败的登录尝试，Graylog 会在总登录尝试失败超过 5 次时提醒您。
                现在，将 <code>username</code> 添加为 Group by Field，Graylog 会针对每个 <code>username</code><em> 提醒您</em>登录尝试超过5次失败。
              </HelpBlock>
            </FormGroup>
          </Col>
        </Row>

        <hr />

        <AggregationConditionsForm eventDefinition={eventDefinition}
                                   validation={validation}
                                   formattedFields={formattedFields}
                                   aggregationFunctions={aggregationFunctions}
                                   onChange={this.propagateConfigChange} />
      </fieldset>
    );
  }
}

export default AggregationForm;
