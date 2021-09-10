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

import { Popover } from 'components/graylog';

class EventKeyHelpPopover extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
  };

  render() {
    const { id, ...otherProps } = this.props;

    return (
      <Popover id={id} title="更多关于事件键" {...otherProps}>
        <p>
          事件键是用于将事件分组的字段。 为每个唯一密钥创建一个组，因此 Graylog 将生成与找到唯一密钥一样多的事件。 例子：
        </p>
        <p>
          <b>无事件键：</b> 每个 <em>登录失败</em> 消息对应一个事件。<br />
          <b>事件键 <code>用户名</code>:</b> 每个用户名的一个事件，带有 <em>登录失败</em> 消息。
        </p>
      </Popover>
    );
  }
}

export default EventKeyHelpPopover;
