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

import { Panel } from 'components/graylog';

import styles from './TemplateFieldValueProviderPreview.css';

class TemplateFieldValueProviderPreview extends React.Component {
  static propTypes = {};

  render() {
    return (
      <Panel className={styles.templatePreview} header={<h3>模板中的可用字段</h3>}>
        <p>
          Graylog 使您可以使用动态值丰富生成的事件。 您可以从事件上下文访问字段{' '}
          {/* eslint-disable-next-line no-template-curly-in-string */}
          <code>{'${source.<fieldName>}'}</code>.
          <br />
          模板中的可用字段取决于创建事件的条件：
        </p>
        <ul>
          <li><b>筛选:</b> 原始日志消息中的所有字段</li>
          <li><b>聚合:</b> 通过其原始名称给字段分组</li>
          <li><b>相关性:</b> 最后一个匹配和非否定事件中的所有字段 </li>
        </ul>
      </Panel>
    );
  }
}

export default TemplateFieldValueProviderPreview;
