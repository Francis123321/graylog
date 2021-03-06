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
import React, { SyntheticEvent } from 'react';

import { Input } from 'components/bootstrap';
import { URLWhiteListInput, KeyValueTable } from 'components/common';
import ObjectUtils from 'util/ObjectUtils';

type Headers = { [key: string]: string };

type Config = {
  headers: Headers,
  url: string,
  single_value_jsonpath: string,
  multi_value_jsonpath: string,
  user_agent: string,
};

type Props = {
  config: Config,
  updateConfig: (config: Config) => void,
  handleFormEvent: (event: SyntheticEvent<EventTarget>) => void,
  validationState: (state: string) => string,
  validationMessage: (field: string, message: string) => string,
};

class HTTPJSONPathAdapterFieldSet extends React.Component<Props> {
  static propTypes = {
    config: PropTypes.object.isRequired,
    updateConfig: PropTypes.func.isRequired,
    handleFormEvent: PropTypes.func.isRequired,
    validationState: PropTypes.func.isRequired,
    validationMessage: PropTypes.func.isRequired,
  };

  onHTTPHeaderUpdate = (headers: Headers) => {
    const { config, updateConfig } = this.props;
    const configChange = ObjectUtils.clone(config);

    configChange.headers = headers;
    updateConfig(configChange);
  };

  render() {
    const { config, handleFormEvent, validationMessage, validationState } = this.props;

    return (
      <fieldset>
        <URLWhiteListInput label="查找网址"
                           onChange={handleFormEvent}
                           validationMessage={validationMessage('url', '查找的 URL。 （这是一个模板 - 请参阅文档）')}
                           validationState={validationState('url')}
                           url={config.url}
                           labelClassName="col-sm-3"
                           wrapperClassName="col-sm-9"
                           urlType="regex" />
        <Input type="text"
               id="single_value_jsonpath"
               name="single_value_jsonpath"
               label="单值 JSONPath"
               required
               onChange={handleFormEvent}
               help={validationMessage('single_value_jsonpath', '从响应中获取单个值的 JSONPath 字符串。')}
               bsStyle={validationState('single_value_jsonpath')}
               value={config.single_value_jsonpath}
               labelClassName="col-sm-3"
               wrapperClassName="col-sm-9" />
        <Input type="text"
               id="multi_value_jsonpath"
               name="multi_value_jsonpath"
               label="多值 JSONPath"
               onChange={handleFormEvent}
               help={validationMessage('multi_value_jsonpath', '从响应中获取多值的 JSONPath 字符串。 需要返回列表或地图。 （可选的）')}
               bsStyle={validationState('multi_value_jsonpath')}
               value={config.multi_value_jsonpath}
               labelClassName="col-sm-3"
               wrapperClassName="col-sm-9" />
        <Input type="text"
               id="user_agent"
               name="user_agent"
               label="HTTP 用户代理"
               required
               onChange={handleFormEvent}
               help="用于 HTTP 请求的 User-Agent 标头。"
               value={config.user_agent}
               labelClassName="col-sm-3"
               wrapperClassName="col-sm-9" />
        <Input id="http_headers"
               label="HTTP 标头"
               help="用于 HTTP 请求的自定义 HTTP 标头。 多个值必须以逗号分隔。"
               labelClassName="col-sm-3"
               wrapperClassName="col-sm-9">
          <KeyValueTable pairs={config.headers || {}} editable onChange={this.onHTTPHeaderUpdate} />
        </Input>

      </fieldset>
    );
  }
}

export default HTTPJSONPathAdapterFieldSet;
