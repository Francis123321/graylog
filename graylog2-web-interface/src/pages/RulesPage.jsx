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
import createReactClass from 'create-react-class';
import Reflux from 'reflux';

import { LinkContainer } from 'components/graylog/router';
import { Row, Col, Button } from 'components/graylog';
import { DocumentTitle, PageHeader } from 'components/common';
import DocumentationLink from 'components/support/DocumentationLink';
import DocsHelper from 'util/DocsHelper';
import RulesComponent from 'components/rules/RulesComponent';
import Routes from 'routing/Routes';
import CombinedProvider from 'injection/CombinedProvider';

const { RulesStore, RulesActions } = CombinedProvider.get('Rules');

const RulesPage = createReactClass({
  displayName: 'RulesPage',

  mixins: [
    Reflux.connect(RulesStore),
  ],

  componentDidMount() {
    RulesActions.list();
  },

  render() {
    return (
      <DocumentTitle title="Pipeline rules">
        <span>
          <PageHeader title="管道规则">
            <span>
              规则是对 Graylog 中的消息应用更改的一种方式。 规则由条件和操作列表组成。
               Graylog 根据消息评估条件，并在满足条件时执行操作。
            </span>

            <span>
              在 <DocumentationLink page={DocsHelper.PAGES.PIPELINE_RULES} text="文件" /> 中阅读有关 Graylog 管道规则的更多信息。
            </span>

            <span>
              <LinkContainer to={Routes.SYSTEM.PIPELINES.OVERVIEW}>
                <Button bsStyle="info">管理管道</Button>
              </LinkContainer>
              &nbsp;
              <LinkContainer to={Routes.SYSTEM.PIPELINES.RULES}>
                <Button bsStyle="info">管理管道</Button>
              </LinkContainer>
              &nbsp;
              <LinkContainer to={Routes.SYSTEM.PIPELINES.SIMULATOR}>
                <Button bsStyle="info">模拟器</Button>
              </LinkContainer>
            </span>
          </PageHeader>

          <Row className="content">
            <Col md={12}>
              <RulesComponent rules={this.state.rules} />
            </Col>
          </Row>
        </span>
      </DocumentTitle>
    );
  },
});

export default RulesPage;
