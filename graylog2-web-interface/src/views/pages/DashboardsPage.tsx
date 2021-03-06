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
import React, { useEffect } from 'react';

import { LinkContainer } from 'components/graylog/router';
import { Col, Row, Button } from 'components/graylog';
import connect from 'stores/connect';
import { DocumentTitle, PageHeader, IfPermitted } from 'components/common/index';
import Routes from 'routing/Routes';
import DocumentationLink from 'components/support/DocumentationLink';
import DocsHelper from 'util/DocsHelper';
import { DashboardsActions, DashboardsStore } from 'views/stores/DashboardsStore';
import type { DashboardsStoreState } from 'views/stores/DashboardsStore';
import ViewList from 'views/components/views/ViewList';
import { ViewManagementActions } from 'views/stores/ViewManagementStore';

type Props = {
  dashboards: DashboardsStoreState,
};

const handleSearch = (query, page, perPage) => DashboardsActions.search(query, page, perPage);

const handleViewDelete = (view) => {
  // eslint-disable-next-line no-alert
  if (window.confirm(`你确定你要删除 "${view.title}"?`)) {
    return ViewManagementActions.delete(view);
  }

  return null;
};

const refreshDashboards = () => {
  DashboardsActions.search();
};

const DashboardsPage = ({ dashboards: { list, pagination } }: Props) => {
  useEffect(refreshDashboards, []);

  return (
    <DocumentTitle title="Dashboards">
      <span>
        <PageHeader title="仪表盘">
          <span>
            使用仪表板为您的消息创建特定视图。 在此处创建一个新仪表板，然后一键添加您在 Graylog 的其他部分创建的任何图形或图表。
          </span>

          <span>
            查看<DocumentationLink page={DocsHelper.PAGES.DASHBOARDS} text="仪表板教程" />，了解许多其他有用的提示。
          </span>

          <IfPermitted permissions="dashboards:create">
            <span>
              <LinkContainer to={Routes.pluginRoute('DASHBOARDS_NEW')}>
                <Button bsStyle="success" bsSize="lg">创建新仪表板</Button>
              </LinkContainer>
            </span>
          </IfPermitted>
        </PageHeader>

        <Row className="content">
          <Col md={12}>
            <ViewList views={list}
                      pagination={pagination}
                      handleSearch={handleSearch}
                      handleViewDelete={handleViewDelete} />
          </Col>
        </Row>
      </span>
    </DocumentTitle>
  );
};

DashboardsPage.propTypes = {};

export default connect(DashboardsPage, { dashboards: DashboardsStore });
