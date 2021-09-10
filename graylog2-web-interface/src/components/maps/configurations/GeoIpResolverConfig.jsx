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

import { Button } from 'components/graylog';
import { BootstrapModalForm, Input } from 'components/bootstrap';
import { IfPermitted, Select } from 'components/common';
import { DocumentationLink } from 'components/support';
import ObjectUtils from 'util/ObjectUtils';

const GeoIpResolverConfig = createReactClass({
  displayName: 'GeoIpResolverConfig',

  propTypes: {
    config: PropTypes.object,
    updateConfig: PropTypes.func.isRequired,
  },

  getDefaultProps() {
    return {
      config: {
        enabled: false,
        db_type: 'MAXMIND_CITY',
        db_path: '/etc/graylog/server/GeoLite2-City.mmdb',
        run_before_extractors: false,
      },
    };
  },

  getInitialState() {
    const { config } = this.props;

    return {
      config: ObjectUtils.clone(config),
    };
  },

  UNSAFE_componentWillReceiveProps(newProps) {
    this.setState({ config: ObjectUtils.clone(newProps.config) });
  },

  inputs: {},

  _updateConfigField(field, value) {
    const { config } = this.state;
    const update = ObjectUtils.clone(config);

    update[field] = value;
    this.setState({ config: update });
  },

  _onCheckboxClick(field, ref) {
    return () => {
      this._updateConfigField(field, this.inputs[ref].getChecked());
    };
  },

  _onUpdate(field) {
    return (e) => {
      this._updateConfigField(field, e.target.value);
    };
  },

  _openModal() {
    this.geoIpConfigModal.open();
  },

  _closeModal() {
    this.geoIpConfigModal.close();
  },

  _resetConfig() {
    // Reset to initial state when the modal is closed without saving.
    this.setState(this.getInitialState());
  },

  _saveConfig() {
    const { updateConfig } = this.props;
    const { config } = this.state;

    updateConfig(config).then(() => {
      this._closeModal();
    });
  },

  _availableDatabaseTypes() {
    // TODO: Support country database as well.
    return [
      { value: 'MAXMIND_CITY', label: 'City database' },
    ];
  },

  _activeDatabaseType(type) {
    return this._availableDatabaseTypes().filter((t) => t.value === type)[0].label;
  },

  render() {
    const { config } = this.state;

    return (
      <div>
        <h3>地理位置处理器</h3>

        <p>
          Geo-Location Processor 插件扫描所有消息以查找仅包含 IP 地址的字段，并将其地理位置信息（坐标、ISO 国家代码和城市名称）放入不同的字段中。 在<DocumentationLink page="geolocation.html" text="Graylog文档" />中阅读更多内容。
        </p>

        <dl className="deflist">
          <dt>启用:</dt>
          <dd>{config.enabled === true ? 'yes' : 'no'}</dd>
          <dt>数据库类型:</dt>
          <dd>{this._activeDatabaseType(config.db_type)}</dd>
          <dt>数据库路径:</dt>
          <dd>{config.db_path}</dd>
        </dl>

        <IfPermitted permissions="clusterconfigentry:edit">
          <Button bsStyle="info" bsSize="xs" onClick={this._openModal}>修改</Button>
        </IfPermitted>

        <BootstrapModalForm ref={(geoIpConfigModal) => { this.geoIpConfigModal = geoIpConfigModal; }}
                            title="更新地理位置处理器配置"
                            onSubmitForm={this._saveConfig}
                            onModalClose={this._resetConfig}
                            submitButtonText="Save">
          <fieldset>
            <Input id="geolocation-enable-checkbox"
                   type="checkbox"
                   ref={(elem) => { this.inputs.configEnabled = elem; }}
                   label="启用地理位置处理器 "
                   name="enabled"
                   checked={config.enabled}
                   onChange={this._onCheckboxClick('enabled', 'configEnabled')} />
            <Input id="maxmind-db-select"
                   label="选择 MaxMind 数据库类型"
                   help="选择要用于提取地理位置信息的 MaxMind 数据库类型。">
              <Select placeholder="选择 MaxMind 数据库类型 "
                      required
                      options={this._availableDatabaseTypes()}
                      matchProp="label"
                      value={config.db_type}
                      onChange={this._onDbTypeSelect} />
            </Input>
            <Input id="maxmind-db-path"
                   type="text"
                   label="MaxMind 数据库的路径"
                   help={<span>您可以从<a href="https://dev.maxmind.com/geoip/geoip2/geolite2/" target="_blank" rel="noopener noreferrer">MaxMind</a>下载免费版本的数据库。</span>}
                   name="db_path"
                   value={config.db_path}
                   onChange={this._onUpdate('db_path')} />
          </fieldset>
        </BootstrapModalForm>
      </div>
    );
  },
});

export default GeoIpResolverConfig;
