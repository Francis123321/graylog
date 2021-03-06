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
import $ from 'jquery';

import { Button } from 'components/graylog';
import { ConfigurationForm } from 'components/configurationforms';

class CreateOutputDropdown extends React.Component {
  PLACEHOLDER = 'placeholder';

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
  };

  render() {
    const outputTypes = $.map(this.props.types, this._formatOutputType);

    return (
      <div>
        <div className="form-inline">
          <select id="input-type" defaultValue={this.PLACEHOLDER} value={this.state.typeName} onChange={this._onTypeChange} className="form-control">
            <option value={this.PLACEHOLDER} disabled>Select Output Type</option>
            {outputTypes}
          </select>
                    &nbsp;
          <Button bsStyle="success" disabled={this.state.typeName === this.PLACEHOLDER} onClick={this._openModal}>启动新输出 </Button>
        </div>

        <ConfigurationForm ref={(configurationForm) => { this.configurationForm = configurationForm; }}
                           key="configuration-form-output"
                           configFields={this.state.typeDefinition}
                           title="创建新输出"
                           helpBlock="选择描述它的新输出的名称。"
                           typeName={this.state.typeName}
                           submitAction={this.props.onSubmit} />
      </div>
    );
  }

  _openModal = (evt) => {
    if (this.state.typeName !== this.PLACEHOLDER && this.state.typeName !== '') {
      this.configurationForm.open();
    }
  };

  _formatOutputType = (type, typeName) => {
    return (<option key={typeName} value={typeName}>{type.name}</option>);
  };

  _onTypeChange = (evt) => {
    const outputType = evt.target.value;

    this.setState({ typeName: evt.target.value });

    this.props.getTypeDefinition(outputType, (definition) => {
      this.setState({ typeDefinition: definition.requested_configuration });
    });
  };

  state = {
    typeDefinition: [],
    typeName: this.PLACEHOLDER,
  };
}

export default CreateOutputDropdown;
