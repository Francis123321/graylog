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
import Reflux from 'reflux';

import { LinkContainer } from 'components/graylog/router';
import { DropdownButton, MenuItem, Col, Button } from 'components/graylog';
import { EntityListItem, IfPermitted, LinkToNode, Spinner } from 'components/common';
import { ConfigurationWell } from 'components/configurationforms';
import PermissionsMixin from 'util/PermissionsMixin';
import Routes from 'routing/Routes';
import StoreProvider from 'injection/StoreProvider';
import ActionsProvider from 'injection/ActionsProvider';
import { InputForm, InputStateBadge, InputStateControl, InputStaticFields, InputThroughput, StaticFieldForm } from 'components/inputs';

const InputTypesStore = StoreProvider.getStore('InputTypes');
const InputsActions = ActionsProvider.getActions('Inputs');

const InputListItem = createReactClass({
  displayName: 'InputListItem',

  propTypes: {
    input: PropTypes.object.isRequired,
    currentNode: PropTypes.object.isRequired,
    permissions: PropTypes.array.isRequired,
  },

  mixins: [PermissionsMixin, Reflux.connect(InputTypesStore)],

  _deleteInput() {
    if (window.confirm(`你真的要删除'${this.props.input.title}'这个输入吗?`)) {
      InputsActions.delete(this.props.input);
    }
  },

  _openStaticFieldForm() {
    this.staticFieldForm.open();
  },

  _editInput() {
    this.configurationForm.open();
  },

  _updateInput(data) {
    InputsActions.update(this.props.input.id, data);
  },

  render() {
    if (!this.state.inputTypes) {
      return <Spinner />;
    }

    const { input } = this.props;
    const definition = this.state.inputDescriptions[input.type];

    const titleSuffix = (
      <span>
        {this.props.input.name}
        &nbsp;
        <InputStateBadge input={this.props.input} />
      </span>
    );

    const actions = [];

    if (this.isPermitted(this.props.permissions, ['searches:relative'])) {
      actions.push(
        <LinkContainer key={`received-messages-${this.props.input.id}`}
                       to={Routes.search(`gl2_source_input:${this.props.input.id}`, { relative: 0 })}>
          <Button bsStyle="info">显示收到的消息</Button>
        </LinkContainer>,
      );
    }

    if (this.isPermitted(this.props.permissions, [`inputs:edit:${this.props.input.id}`])) {
      let extractorRoute;

      if (this.props.input.global) {
        extractorRoute = Routes.global_input_extractors(this.props.input.id);
      } else {
        extractorRoute = Routes.local_input_extractors(this.props.currentNode.node_id, this.props.input.id);
      }

      actions.push(
        <LinkContainer key={`manage-extractors-${this.props.input.id}`} to={extractorRoute}>
          <Button bsStyle="info">管理提取器</Button>
        </LinkContainer>,
      );

      actions.push(<InputStateControl key={`input-state-control-${this.props.input.id}`} input={this.props.input} />);
    }

    let showMetricsMenuItem;

    if (!this.props.input.global) {
      showMetricsMenuItem = (
        <LinkContainer to={Routes.filtered_metrics(this.props.input.node, this.props.input.id)}>
          <MenuItem key={`show-metrics-${this.props.input.id}`}>显示指标</MenuItem>
        </LinkContainer>
      );
    }

    actions.push(
      <DropdownButton key={`more-actions-${this.props.input.id}`}
                      title="更多操作"
                      id={`more-actions-dropdown-${this.props.input.id}`}
                      pullRight>
        <IfPermitted permissions={`inputs:edit:${this.props.input.id}`}>
          <MenuItem key={`edit-input-${this.props.input.id}`}
                    onSelect={this._editInput}
                    disabled={definition === undefined}>
            编辑输入
          </MenuItem>
        </IfPermitted>

        {showMetricsMenuItem}

        <IfPermitted permissions={`inputs:edit:${this.props.input.id}`}>
          <MenuItem key={`add-static-field-${this.props.input.id}`} onSelect={this._openStaticFieldForm}>添加静态字段</MenuItem>
        </IfPermitted>

        <IfPermitted permissions="inputs:terminate">
          <MenuItem key={`divider-${this.props.input.id}`} divider />
        </IfPermitted>
        <IfPermitted permissions="inputs:terminate">
          <MenuItem key={`delete-input-${this.props.input.id}`} onSelect={this._deleteInput}>删除输入</MenuItem>
        </IfPermitted>
      </DropdownButton>,
    );

    let subtitle;

    if (!this.props.input.global && this.props.input.node) {
      subtitle = (
        <span>
          On node{' '}<LinkToNode nodeId={this.props.input.node} />
        </span>
      );
    }

    const inputForm = definition
      ? (
        <InputForm ref={(configurationForm) => { this.configurationForm = configurationForm; }}
                   key={`edit-form-input-${input.id}`}
                   globalValue={input.global}
                   nodeValue={input.node}
                   configFields={definition.requested_configuration}
                   title={`编辑输入 ${input.title}`}
                   titleValue={input.title}
                   typeName={input.type}
                   includeTitleField
                   submitAction={this._updateInput}
                   values={input.attributes} />
      ) : null;

    const additionalContent = (
      <div>
        <Col md={8}>
          <ConfigurationWell className="configuration-well"
                             id={input.id}
                             configuration={input.attributes}
                             typeDefinition={definition || {}} />
          <StaticFieldForm ref={(staticFieldForm) => { this.staticFieldForm = staticFieldForm; }} input={this.props.input} />
          <InputStaticFields input={this.props.input} />
        </Col>
        <Col md={4}>
          <InputThroughput input={input} />
        </Col>
        {inputForm}
      </div>
    );

    return (
      <EntityListItem key={`entry-list-${this.props.input.id}`}
                      title={this.props.input.title}
                      titleSuffix={titleSuffix}
                      description={subtitle}
                      createdFromContentPack={!!this.props.input.content_pack}
                      actions={actions}
                      contentRow={additionalContent} />
    );
  },
});

export default InputListItem;
