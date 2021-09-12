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

import ObjectUtils from 'util/ObjectUtils';
import { Input } from 'components/bootstrap';
import { TimeUnitInput } from 'components/common';

class CaffeineCacheFieldSet extends React.Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    updateConfig: PropTypes.func.isRequired,
    handleFormEvent: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    validationState: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    validationMessage: PropTypes.func.isRequired,
  };

  _update = (value, unit, enabled, name) => {
    const config = ObjectUtils.clone(this.props.config);

    config[name] = enabled ? value : 0;
    config[`${name}_unit`] = unit;
    this.props.updateConfig(config);
  };

  updateAfterAccess = (value, unit, enabled) => {
    this._update(value, unit, enabled, 'expire_after_access');
  };

  updateAfterWrite = (value, unit, enabled) => {
    this._update(value, unit, enabled, 'expire_after_write');
  };

  render() {
    const { config } = this.props;

    return (
      <fieldset>
        <Input type="text"
               id="max_size"
               name="max_size"
               label="最大条目数"
               autoFocus
               required
               onChange={this.props.handleFormEvent}
               help="缓存在内存中保留的条目数的限制。"
               value={config.max_size}
               labelClassName="col-sm-3"
               wrapperClassName="col-sm-9" />
        <TimeUnitInput label="访问后过期"
                       help="如果启用，条目会在上次使用后的指定时间后从缓存中删除。"
                       update={this.updateAfterAccess}
                       value={config.expire_after_access}
                       unit={config.expire_after_access_unit || 'SECONDS'}
                       defaultEnabled={config.expire_after_access > 0}
                       labelClassName="col-sm-3"
                       wrapperClassName="col-sm-9" />
        <TimeUnitInput label="写入后过期"
                       help="如果启用，条目会在首次使用后的指定时间后从缓存中删除。"
                       update={this.updateAfterWrite}
                       value={config.expire_after_write}
                       unit={config.expire_after_write_unit || 'SECONDS'}
                       defaultEnabled={config.expire_after_write > 0}
                       labelClassName="col-sm-3"
                       wrapperClassName="col-sm-9" />
      </fieldset>
    );
  }
}

export default CaffeineCacheFieldSet;
