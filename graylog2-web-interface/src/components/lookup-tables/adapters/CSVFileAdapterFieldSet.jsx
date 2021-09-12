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

import { Input } from 'components/bootstrap';

class CSVFileAdapterFieldSet extends React.Component {
       static propTypes = {
         config: PropTypes.object.isRequired,
         // eslint-disable-next-line react/no-unused-prop-types
         updateConfig: PropTypes.func.isRequired,
         handleFormEvent: PropTypes.func.isRequired,
         validationState: PropTypes.func.isRequired,
         validationMessage: PropTypes.func.isRequired,
       };

       render() {
         const { config } = this.props;

         return (
           <fieldset>
             <Input type="text"
                    id="path"
                    name="path"
                    label="文件路径"
                    autoFocus
                    required
                    onChange={this.props.handleFormEvent}
                    help={this.props.validationMessage('path', 'CSV 文件的路径。')}
                    bsStyle={this.props.validationState('path')}
                    value={config.path}
                    labelClassName="col-sm-3"
                    wrapperClassName="col-sm-9" />
             <Input type="number"
                    id="check_interval"
                    name="check_interval"
                    label="检查间隔"
                    required
                    onChange={this.props.handleFormEvent}
                    help="检查 CSV 文件是否需要重新加载的时间间隔。 （片刻之间）"
                    value={config.check_interval}
                    labelClassName="col-sm-3"
                    wrapperClassName="col-sm-9" />
             <Input type="text"
                    id="separator"
                    name="separator"
                    label="分隔器"
                    required
                    onChange={this.props.handleFormEvent}
                    help="用于分隔条目的分隔符。"
                    value={config.separator}
                    labelClassName="col-sm-3"
                    wrapperClassName="col-sm-9" />
             <Input type="text"
                    id="quotechar"
                    name="quotechar"
                    label="引用字符"
                    required
                    onChange={this.props.handleFormEvent}
                    help="用于引用元素的字符。"
                    value={config.quotechar}
                    labelClassName="col-sm-3"
                    wrapperClassName="col-sm-9" />
             <Input type="text"
                    id="key_column"
                    name="key_column"
                    label="重点栏目"
                    required
                    onChange={this.props.handleFormEvent}
                    help="应该用于键查找的列名。"
                    value={config.key_column}
                    labelClassName="col-sm-3"
                    wrapperClassName="col-sm-9" />
             <Input type="text"
                    id="value_column"
                    name="value_column"
                    label="值列"
                    required
                    onChange={this.props.handleFormEvent}
                    help="应用作键值的列名称。"
                    value={config.value_column}
                    labelClassName="col-sm-3"
                    wrapperClassName="col-sm-9" />
             <Input type="checkbox"
                    id="case_insensitive_lookup"
                    name="case_insensitive_lookup"
                    label="允许不区分大小写的查找"
                    checked={config.case_insensitive_lookup}
                    onChange={this.props.handleFormEvent}
                    help="如果键查找不区分大小写，则启用。"
                    wrapperClassName="col-md-offset-3 col-md-9" />
           </fieldset>
         );
       }
}

export default CSVFileAdapterFieldSet;
