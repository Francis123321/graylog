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
import React, { createRef } from 'react';
import moment from 'moment';

import { Button, Row, Col } from 'components/graylog';
import { BootstrapModalForm, Input } from 'components/bootstrap';
import { IfPermitted, ISODurationInput } from 'components/common';
import ObjectUtils from 'util/ObjectUtils';

import 'moment-duration-format';

import TimeRangeOptionsForm from './TimeRangeOptionsForm';
import TimeRangeOptionsSummary from './TimeRangeOptionsSummary';

function _queryTimeRangeLimitValidator(milliseconds) {
  return milliseconds >= 1;
}

function _relativeTimeRangeValidator(milliseconds, duration) {
  return milliseconds >= 1 || duration === 'PT0S';
}

function _surroundingTimeRangeValidator(milliseconds) {
  return milliseconds >= 1;
}

function _splitStringList(stringList) {
  return stringList.split(',').map((f) => f.trim()).filter((f) => f.length > 0);
}

class SearchesConfig extends React.Component {
  static propTypes = {
    config: PropTypes.shape({
      query_time_range_limit: PropTypes.string,
      relative_timerange_options: PropTypes.objectOf(PropTypes.string),
      surrounding_timerange_options: PropTypes.objectOf(PropTypes.string),
      surrounding_filter_fields: PropTypes.arrayOf(PropTypes.string),
      analysis_disabled_fields: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    updateConfig: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.searchesConfigModal = createRef();

    const { config } = props;

    const queryTimeRangeLimit = config?.query_time_range_limit;
    const relativeTimerangeOptions = config?.relative_timerange_options;
    const surroundingTimerangeOptions = config?.surrounding_timerange_options;
    const surroundingFilterFields = config?.surrounding_filter_fields;
    const analysisDisabledFields = config?.analysis_disabled_fields;

    this.state = {
      config: {
        query_time_range_limit: queryTimeRangeLimit,
        relative_timerange_options: relativeTimerangeOptions,
        surrounding_timerange_options: surroundingTimerangeOptions,
        surrounding_filter_fields: surroundingFilterFields,
        analysis_disabled_fields: analysisDisabledFields,
      },
      limitEnabled: moment.duration(queryTimeRangeLimit).asMilliseconds() > 0,
      relativeTimeRangeOptionsUpdate: undefined,
      surroundingTimeRangeOptionsUpdate: undefined,
    };

    this.defaultState = { ...this.state };
  }

  _onUpdate=(field) => {
    return (newOptions) => {
      const { config } = this.state;
      const update = ObjectUtils.clone(config);

      update[field] = newOptions;

      this.setState({ config: update });
    };
  }

  _onRelativeTimeRangeOptionsUpdate=(data) => {
    this.setState({ relativeTimeRangeOptionsUpdate: data });
  }

  _onSurroundingTimeRangeOptionsUpdate=(data) => {
    this.setState({ surroundingTimeRangeOptionsUpdate: data });
  }

  _onFilterFieldsUpdate=(e) => {
    this.setState({ surroundingFilterFields: e.target.value });
  }

  _onAnalysisDisabledFieldsUpdate=(e) => {
    this.setState({ analysisDisabledFields: e.target.value });
  }

  _onChecked = () => {
    const { config: origConfig, limitEnabled } = this.state;
    const config = ObjectUtils.clone(origConfig);

    if (limitEnabled) {
      // If currently enabled, disable by setting the limit to 0 seconds.
      config.query_time_range_limit = 'PT0S';
    } else {
      // If currently not enabled, set a default of 30 days.
      config.query_time_range_limit = 'P30D';
    }

    this.setState({ config: config, limitEnabled: !limitEnabled });
  }

  _saveConfig = () => {
    const { updateConfig } = this.props;
    const { analysisDisabledFields, config, relativeTimeRangeOptionsUpdate, surroundingTimeRangeOptionsUpdate, surroundingFilterFields } = this.state;
    const update = ObjectUtils.clone(config);

    if (relativeTimeRangeOptionsUpdate) {
      update.relative_timerange_options = {};

      relativeTimeRangeOptionsUpdate.forEach((entry) => {
        update.relative_timerange_options[entry.period] = entry.description;
      });

      this.setState({ relativeTimeRangeOptionsUpdate: undefined });
    }

    if (surroundingTimeRangeOptionsUpdate) {
      update.surrounding_timerange_options = {};

      surroundingTimeRangeOptionsUpdate.forEach((entry) => {
        update.surrounding_timerange_options[entry.period] = entry.description;
      });

      this.setState({ surroundingTimeRangeOptionsUpdate: undefined });
    }

    // Make sure to update filter fields
    if (surroundingFilterFields) {
      update.surrounding_filter_fields = _splitStringList(surroundingFilterFields);
      this.setState({ surroundingFilterFields: undefined });
    }

    if (analysisDisabledFields) {
      update.analysis_disabled_fields = _splitStringList(analysisDisabledFields);
      this.setState({ analysisDisabledFields: undefined });
    }

    updateConfig(update).then(() => {
      this._closeModal();
    });
  }

  _resetConfig = () => {
    // Reset to initial state when the modal is closed without saving.
    this.setState(this.defaultState);
  }

  _openModal = () => {
    this.searchesConfigModal.current.open();
  }

  _closeModal = () => {
    this.searchesConfigModal.current.close();
  }

  render() {
    const _buildTimeRangeOptions = (options) => {
      return Object.keys(options).map((key) => {
        return { period: key, description: options[key] };
      });
    };

    const {
      config,
      limitEnabled,
      surroundingTimeRangeOptionsUpdate,
      surroundingFilterFields,
      relativeTimeRangeOptionsUpdate,
      analysisDisabledFields,
    } = this.state;
    const duration = moment.duration(config.query_time_range_limit);
    const limit = limitEnabled ? `${config.query_time_range_limit} (${duration.humanize()})` : 'disabled';

    let filterFields;
    let filterFieldsString;

    if (config.surrounding_filter_fields) {
      filterFields = config.surrounding_filter_fields.map((f) => <li key={f}>{f}</li>);
      filterFieldsString = config.surrounding_filter_fields.join(', ');
    }

    let analysisDisabledFieldsListItems;
    let analysisDisabledFieldsString;

    if (config.analysis_disabled_fields) {
      analysisDisabledFieldsListItems = config.analysis_disabled_fields.map((f) => <li key={f}>{f}</li>);
      analysisDisabledFieldsString = config.analysis_disabled_fields.join(', ');
    }

    return (
      <div>
        <h2>搜索配置</h2>

        <dl className="deflist">
          <dt>查询时间范围限制</dt>
          <dd>{limit}</dd>
          <dd>用户可以查询过去数据的最长时间。 这可以防止用户意外创建跨越大量数据并且需要很长时间和大量资源才能完成的查询（如果有的话）。
          </dd>
        </dl>

        <Row>
          <Col md={6}>
            <strong>相对时间范围选项</strong>
            <TimeRangeOptionsSummary options={config.relative_timerange_options} />
          </Col>
          <Col md={6}>
            <strong>周围时间范围选项</strong>
            <TimeRangeOptionsSummary options={config.surrounding_timerange_options} />
          </Col>
          <Col md={6}>

            <strong>周围的搜索过滤器字段 </strong>
            <ul>
              {filterFields}
            </ul>

            <strong>对字段禁用 UI 分析</strong>
            <ul>
              {analysisDisabledFieldsListItems}
            </ul>

          </Col>

        </Row>
        <IfPermitted permissions="clusterconfigentry:edit">
          <Button bsStyle="info" bsSize="xs" onClick={this._openModal}>修改</Button>
        </IfPermitted>

        <BootstrapModalForm ref={this.searchesConfigModal}
                            title="更新搜索配置"
                            onSubmitForm={this._saveConfig}
                            onModalClose={this._resetConfig}
                            submitButtonText="Save">
          <fieldset>
            <label htmlFor="query-limit-checkbox">相对时间范围选项</label>
            <Input id="query-limit-checkbox"
                   type="checkbox"
                   label="启用查询限制"
                   name="enabled"
                   checked={limitEnabled}
                   onChange={this._onChecked} />
            {limitEnabled && (
              <ISODurationInput id="query-timerange-limit-field"
                                duration={config.query_time_range_limit}
                                update={this._onUpdate('query_time_range_limit')}
                                label="Query time range limit (ISO8601 Duration)"
                                help={'The maximum time range for searches. (i.e. "P30D" for 30 days, "PT24H" for 24 hours)'}
                                validator={_queryTimeRangeLimitValidator}
                                required />
            )}
            <TimeRangeOptionsForm options={relativeTimeRangeOptionsUpdate || _buildTimeRangeOptions(config.relative_timerange_options)}
                                  update={this._onRelativeTimeRangeOptionsUpdate}
                                  validator={_relativeTimeRangeValidator}
                                  title="相对时间范围选项"
                                  help={<span>将<strong>相对</strong>时间范围选择器的可用选项配置为<strong>ISO8601 持续时间</strong></span>} />
            <TimeRangeOptionsForm options={surroundingTimeRangeOptionsUpdate || _buildTimeRangeOptions(config.surrounding_timerange_options)}
                                  update={this._onSurroundingTimeRangeOptionsUpdate}
                                  validator={_surroundingTimeRangeValidator}
                                  title="周围时间范围选项"
                                  help={<span>将<strong>周围</strong>时间范围选择器的可用选项配置为<strong>ISO8601 持续时间</strong></span>} />

            <Input id="filter-fields-input"
                   type="text"
                   label="周围的搜索过滤器字段"
                   onChange={this._onFilterFieldsUpdate}
                   value={surroundingFilterFields || filterFieldsString}
                   help="一个“,”分隔的消息字段列表，将用作周围消息查询的过滤器。 "
                   required />

            <Input id="disabled-fields-input"
                   type="text"
                   label="禁用的分析字段 "
                   onChange={this._onAnalysisDisabledFieldsUpdate}
                   value={analysisDisabledFields || analysisDisabledFieldsString}
                   help="将在 Web UI 中禁用 QuickValues 等分析功能的消息字段列表，以“,”分隔。"
                   required />
          </fieldset>
        </BootstrapModalForm>
      </div>
    );
  }
}

export default SearchesConfig;
