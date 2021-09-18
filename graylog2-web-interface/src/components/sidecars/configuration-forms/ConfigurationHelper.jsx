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

import { Col, Panel, Row, Tab, Tabs } from 'components/graylog';

import TemplatesHelper from './TemplatesHelper';
import ConfigurationVariablesHelper from './ConfigurationVariablesHelper';
import ConfigurationHelperStyle from './ConfigurationHelper.css';

class ConfigurationHelper extends React.Component {
  static propTypes = {
    onVariableRename: PropTypes.func.isRequired,
  };

  _getId = (idName, index) => {
    const idIndex = index !== undefined ? `. ${index}` : '';

    return idName + idIndex;
  };

  render() {
    const { onVariableRename } = this.props;

    return (
      /* eslint-disable no-template-curly-in-string */
      <Panel header="收集器配置参考">

        <Row className="row-sm">
          <Col md={12}>
            <Tabs id="configurationsHelper" defaultActiveKey={1} animation={false}>
              <Tab eventKey={1} title="运行时变量">
                <p className={ConfigurationHelperStyle.marginQuickReferenceText}>
                  这些变量将填充来自每个探针的运行时信息
                </p>
                <TemplatesHelper />
              </Tab>
              <Tab eventKey={2} title="变量">
                <p className={ConfigurationHelperStyle.marginQuickReferenceText}>
                  使用变量在多个配置之间共享文本片段。
                  <br />
                  如果你的配置格式需要使用像 <code>$&#123;foo&#125;</code> 这样的文字，它不能作为一个变量，你必须把它写成 <code>$&#123;&apos ;$&apos;&#125;&#123;foo&#125;</code>.
                </p>
                <ConfigurationVariablesHelper onVariableRename={onVariableRename} />
              </Tab>
              <Tab eventKey={3} title="参考">
                <Row className="row-sm">
                  <Col md={12}>
                    <p className={ConfigurationHelperStyle.marginQuickReferenceText}>
                      我们提供收集器配置模板来帮助您入门。<br />
                      有关更多信息，请参阅收集器的官方文档。
                    </p>
                    <ul className={ConfigurationHelperStyle.ulStyle}>
                      <li><a href="https://www.elastic.co/guide/en/beats/filebeat/current/index.html" target="_blank" rel="noopener noreferrer">Filebeat 参考</a> </li>
                      <li><a href="https://www.elastic.co/guide/en/beats/winlogbeat/current/index.html" target="_blank" rel="noopener noreferrer">Winlogbeat 参考</a> </li>
                      <li><a href="https://nxlog.co/docs/nxlog-ce/nxlog-reference-manual.html" target="_blank" rel="noopener noreferrer">NXLog 参考手册</a> </li>
                    </ul>
                  </Col>
                </Row>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Panel>
    );
    /* eslint-enable no-template-curly-in-string */
  }
}

export default ConfigurationHelper;
