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
import Immutable from 'immutable';
import styled, { css } from 'styled-components';

import DocsHelper from 'util/DocsHelper';
import { Jumbotron } from 'components/graylog';
import { CurrentViewStateActions } from 'views/stores/CurrentViewStateStore';
import { Spinner } from 'components/common';
import { widgetDefinition } from 'views/logic/Widgets';
import DocumentationLink from 'components/support/DocumentationLink';
import IfDashboard from 'views/components/dashboard/IfDashboard';
import IfSearch from 'views/components/search/IfSearch';
import WidgetGrid from 'views/components/WidgetGrid';
import WidgetPosition from 'views/logic/widgets/WidgetPosition';

import { PositionsMap, ImmutableWidgetsMap } from './widgets/WidgetPropTypes';
import InteractiveContext from './contexts/InteractiveContext';

const StyledJumbotron = styled(Jumbotron)(({ theme }) => css`
  .container-fluid & {
    border: 1px solid ${theme.colors.gray[80]};
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    margin-bottom: 0;
  }
`);

const MAXIMUM_GRID_SIZE = 12;

const _onPositionsChange = (positions) => {
  const newPositions: Record<string, WidgetPosition> = Immutable.Map<string, WidgetPosition>(
    positions.map(({ col, height, row, width, id }) => [id, new WidgetPosition(col, row, height, width >= MAXIMUM_GRID_SIZE ? Infinity : width)]),
  ).toJS();

  CurrentViewStateActions.widgetPositions(newPositions);
};

const _getDataAndErrors = (widget, widgetMapping, results) => {
  const { searchTypes } = results;
  const widgetType = widgetDefinition(widget.type);
  const dataTransformer = widgetType.searchResultTransformer || ((x) => x);
  const searchTypeIds = (widgetMapping[widget.id] || []);
  const widgetData = searchTypeIds.map((searchTypeId) => searchTypes[searchTypeId]).filter((result) => result);
  const widgetErrors = results.errors.filter((e) => searchTypeIds.includes(e.searchTypeId));
  let error;

  const data = dataTransformer(widgetData, widget);

  if (widgetErrors && widgetErrors.length > 0) {
    error = widgetErrors;
  }

  if (!widgetData || widgetData.length === 0) {
    const queryErrors = results.errors.filter((e) => e.type === 'query');

    if (queryErrors.length > 0) {
      error = error ? [].concat(error, queryErrors) : queryErrors;
    }
  }

  return { widgetData: data, error };
};

const _renderWidgetGrid = (widgetDefs, widgetMapping, results, positions, queryId, fields, allFields) => {
  const widgets = {};
  const data = {};
  const errors = {};

  widgetDefs.forEach((widget) => {
    widgets[widget.id] = widget;

    const { widgetData, error } = _getDataAndErrors(widget, widgetMapping, results);

    data[widget.id] = widgetData;
    errors[widget.id] = error;
  });

  return (
    <InteractiveContext.Consumer>
      {(interactive) => (
        <WidgetGrid allFields={allFields}
                    data={data}
                    errors={errors}
                    fields={fields}
                    locked={!interactive}
                    onPositionsChange={(p) => _onPositionsChange(p)}
                    positions={positions}
                    widgets={widgets} />
      )}
    </InteractiveContext.Consumer>
  );
};

const EmptyDashboardInfo = () => (
  <StyledJumbotron>
    <h2>
      <IfDashboard>
        此仪表板还没有小部件
      </IfDashboard>
      <IfSearch>
        没有定义小部件来可视化搜索结果
      </IfSearch>
    </h2>
    <br />
    <p>
      通过在左侧边栏部分“创建”中选择一个小部件类型来创建一个新的小部件。<br />
    </p>
    <p>
      创建搜索和仪表板的一些技巧
    </p>
    <ul>
      <li><p>1. 从你想回答的<b>问题</b>开始。 定义您要解决的问题。</p></li>
      <li><p>2. 将数据<b>限制</b>为仅您想要查看的数据点。</p></li>
      <li><p>3. 将数据<b>可视化</b>。 它回答你的问题吗？ </p></li>
      <IfDashboard>
        <li><p>4. 与您的同事<b>共享</b>仪表板。 使用参数（包含在 <a href="https://www.graylog.org/graylog-enterprise-edition" target="_blank" rel="noopener noreferrer">Graylog Enterprise</a> 中）准备<b>重复使用</b>。 </p></li>
      </IfDashboard>
    </ul>
    <p>
      您还可以查看<DocumentationLink page={DocsHelper.PAGES.DASHBOARDS} text="文档" />，以了解有关小部件创建的更多信息。
    </p>
  </StyledJumbotron>
);

const Query = ({ allFields, fields, results, positions, widgetMapping, widgets, queryId }) => {
  if (!widgets || widgets.isEmpty()) {
    return <EmptyDashboardInfo />;
  }

  if (results) {
    const widgetGrid = _renderWidgetGrid(widgets, widgetMapping.toJS(), results, positions, queryId, fields, allFields);

    return (<>{widgetGrid}</>);
  }

  return <Spinner />;
};

Query.propTypes = {
  allFields: PropTypes.object.isRequired,
  fields: PropTypes.object.isRequired,
  positions: PositionsMap,
  queryId: PropTypes.string.isRequired,
  results: PropTypes.object.isRequired,
  widgetMapping: PropTypes.object.isRequired,
  widgets: ImmutableWidgetsMap.isRequired,
};

Query.defaultProps = {
  positions: {},
};

export default Query;
