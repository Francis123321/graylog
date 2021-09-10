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
import * as React from 'react';
import PropTypes from 'prop-types';

import { Button, Table } from 'components/graylog';
import { IfPermitted } from 'components/common';
import BootstrapModalForm from 'components/bootstrap/BootstrapModalForm';
import UrlWhiteListForm from 'components/configurations/UrlWhiteListForm';
import type { WhiteListConfig } from 'stores/configurations/ConfigurationsStore';

type State = {
  config: WhiteListConfig,
  isValid: boolean,
};

type Props = {
  config: WhiteListConfig,
  updateConfig: (config: WhiteListConfig) => Promise<void>,
};

class UrlWhiteListConfig extends React.Component<Props, State> {
  private configModal: BootstrapModalForm | undefined | null;

  private inputs = {};

  static propTypes = {
    config: PropTypes.object.isRequired,
    updateConfig: PropTypes.func.isRequired,
  };

  constructor(props: Props) {
    super(props);
    const { config } = this.props;

    this.state = {
      config,
      isValid: false,
    };
  }

  _summary = (): React.ReactElement<'tr'>[] => {
    const literal = 'literal';
    const { config: { entries } } = this.props;

    return entries.map((urlConfig, idx) => {
      return (
        <tr key={urlConfig.id}>
          <td>{idx + 1}</td>
          <td>{urlConfig.title}</td>
          <td>{urlConfig.value}</td>
          <td>{urlConfig.type === literal ? 'Exact match' : 'Regex'}</td>
        </tr>
      );
    });
  }

  _openModal = () => {
    if (this.configModal) {
      this.configModal.open();
    }
  }

  _closeModal = () => {
    if (this.configModal) {
      this.configModal.close();
    }
  }

  _saveConfig = () => {
    const { config, isValid } = this.state;
    const { updateConfig } = this.props;

    if (isValid) {
      updateConfig(config).then(() => {
        this._closeModal();
      });
    }
  }

  _update = (config: WhiteListConfig, isValid: boolean) => {
    const updatedState = { config, isValid };

    this.setState(updatedState);
  }

  _resetConfig = () => {
    const { config } = this.props;
    const updatedState = { ...this.state, config };

    this.setState(updatedState);
  }

  render() {
    const { config: { entries, disabled } } = this.props;
    const { isValid } = this.state;

    return (
      <div>
        <h2>URL白名单配置 {disabled ? <small>(已禁用)</small> : <small>(启用)</small> }</h2>
        <p>
          启用后，来自 Graylog 服务器的传出 HTTP 请求（例如事件通知或基于 HTTP 的数据适配器请求）将根据此处配置的白名单进行验证。
          由于 HTTP 请求是从 Graylog 服务器发出的，因此它们可能能够访问比外部用户可以访问的更敏感的系统，包括 AWS EC2 元数据，其中可以包含密钥和其他机密、Elasticsearch 等。
          白名单管理访问与数据适配器和事件通知配置分开。
        </p>
        <Table striped bordered condensed className="top-margin">
          <thead>
            <tr>
              <th>#</th>
              <th>标题</th>
              <th>网址</th>
              <th>类型</th>
            </tr>
          </thead>
          <tbody>
            {this._summary()}
          </tbody>
        </Table>
        <IfPermitted permissions="urlwhitelist:write">
          <Button bsStyle="info" bsSize="xs" onClick={this._openModal}>修改</Button>
        </IfPermitted>
        <BootstrapModalForm ref={(configModal) => { this.configModal = configModal; }}
                            bsSize="lg"
                            title="更新白名单配置"
                            onSubmitForm={this._saveConfig}
                            onModalClose={this._resetConfig}
                            submitButtonDisabled={!isValid}
                            submitButtonText="Save">
          <h3>白名单 URL</h3>
          <UrlWhiteListForm urls={entries} disabled={disabled} onUpdate={this._update} />
        </BootstrapModalForm>
      </div>
    );
  }
}

export default UrlWhiteListConfig;
