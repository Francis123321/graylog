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

import BootstrapModalForm from 'components/bootstrap/BootstrapModalForm';
import { Input } from 'components/bootstrap';
import { Select, Spinner } from 'components/common';
import * as FormsUtils from 'util/FormsUtils';
import AppConfig from 'util/AppConfig';

class ThreatForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    stream: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
  };

  static defaultProps = {
    stream: {
      title: '',
      description: '',
      remove_matches_from_default_stream: false,
    },
  };

  modal = undefined;

  _resetValues = () => {
    this.setState(this._getValuesFromProps(this.props));
  };

  _getValuesFromProps = (props) => {
    let defaultIndexSetId = props.stream.index_set_id;

    return {
      title: props.stream.title,
      description: props.stream.description,
      removeMatchesFromDefaultStream: props.stream.remove_matches_from_default_stream,
      indexSetId: defaultIndexSetId,
    };
  };

  _onSubmit = () => {
    this.props.onSubmit(this.props.stream.id,
      {
        title: this.state.title,
        description: this.state.description,
        remove_matches_from_default_stream: this.state.removeMatchesFromDefaultStream,
        index_set_id: this.state.indexSetId,
      });

    this.modal.close();
  };

  open = () => {
    this._resetValues();
    this.modal.open();
  };

  close = () => {
    this.modal.close();
  };

  handleChange = (event) => {
    const change = {};

    change[event.target.name] = FormsUtils.getValueFromInput(event.target);
    this.setState(change);
  };

  _indexSetSelect = () => {
    const { indexSetId } = this.state;

    if (AppConfig.isCloud()) {
      return null;
    }

    return <Spinner>Loading index sets...</Spinner>;
  };

  state = this._getValuesFromProps(this.props);

  render() {
    const { title, description, removeMatchesFromDefaultStream } = this.state;

    return (
      <BootstrapModalForm ref={(c) => { this.modal = c; }}
                          title={this.props.title}
                          onSubmitForm={this._onSubmit}
                          cancelButtonText="取消"
                          submitButtonText="确认">
        <Input id="startTime"
               type="text"
               label="开始时间"
               name="startTime"
               // value={title}
               placeholder="请输入开始时间"
               autoFocus />
        <Input id="endTime"
               type="text"
               label="结束时间"
               name="endTime"
               placeholder="请输入结束时间" />
        <Input id="serverIp"
               type="text"
               label="服务端端IP"
               name="serverIp"
               placeholder="请输入服务端端IP" />
        <Input id="clientIp"
               type="text"
               label="客户端IP"
               name="clientIp"
               placeholder="请输入客户端IP" />
        <Input id="URL"
               type="text"
               label="获取URL"
               name="URL"
               placeholder="请输入URL" />
        <Input id="baowen"
               type="text"
               label="获取报文"
               name="baowen"
               placeholder="请输入报文" />
        <Input id="SQL"
               type="text"
               label="获取SQL"
               name="SQL"
               placeholder="请输入SQL" />
      </BootstrapModalForm>
    );
  }
}

export default ThreatForm;
