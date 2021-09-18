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
import PropTypes from 'prop-types';
import lodash from 'lodash';

import { Button, ButtonToolbar } from 'components/graylog';
import { naturalSortIgnoreCase } from 'util/SortUtils';
import { SelectPopover } from 'components/common';
import CollectorIndicator from 'components/sidecars/common/CollectorIndicator';
import ColorLabel from 'components/sidecars/common/ColorLabel';
import SidecarStatusEnum from 'logic/sidecar/SidecarStatusEnum';

const CollectorsAdministrationFilters = createReactClass({
  propTypes: {
    collectors: PropTypes.array.isRequired,
    configurations: PropTypes.array.isRequired,
    filters: PropTypes.object.isRequired,
    filter: PropTypes.func.isRequired,
  },

  onFilterChange(name, value, callback) {
    const { filter } = this.props;

    filter(name, value);
    callback();
  },

  getCollectorsFilter() {
    const { collectors, filters } = this.props;
    const collectorMapper = (collector) => `${collector.id};${collector.name}`;

    const collectorItems = collectors
      .sort((c1, c2) => naturalSortIgnoreCase(c1.name, c2.name))
      // TODO: Hack to be able to filter in SelectPopover. We should change that to avoid this hack.
      .map(collectorMapper);

    const collectorFormatter = (collectorId) => {
      const [id] = collectorId.split(';');
      const collector = lodash.find(collectors, { id: id });

      return <CollectorIndicator collector={collector.name} operatingSystem={collector.node_operating_system} />;
    };

    const filter = ([collectorId], callback) => {
      const [id] = collectorId ? collectorId.split(';') : [];

      this.onFilterChange('collector', id, callback);
    };

    let collectorFilter;

    if (filters.collector) {
      const collector = collectors.find((c) => c.id === filters.collector);

      collectorFilter = collector ? collectorMapper(collector) : undefined;
    }

    return (
      <SelectPopover id="collector-filter"
                     title="按收集器过滤"
                     triggerNode={<Button bsSize="small" bsStyle="link">集电极 <span className="caret" /></Button>}
                     items={collectorItems}
                     itemFormatter={collectorFormatter}
                     onItemSelect={filter}
                     selectedItems={collectorFilter ? [collectorFilter] : []}
                     filterPlaceholder="按收集器过滤" />
    );
  },

  getConfigurationFilter() {
    const { configurations, filters } = this.props;

    const configurationMapper = (configuration) => `${configuration.id};${configuration.name}`;
    const configurationItems = configurations
      .sort((c1, c2) => naturalSortIgnoreCase(c1.name, c2.name))
      // TODO: Hack to be able to filter in SelectPopover. We should change that to avoid this hack.
      .map(configurationMapper);

    const configurationFormatter = (configurationId) => {
      const [id] = configurationId.split(';');
      const configuration = lodash.find(configurations, { id: id });

      return <span><ColorLabel color={configuration.color} size="xsmall" /> {configuration.name}</span>;
    };

    const filter = ([configurationId], callback) => {
      const [id] = configurationId ? configurationId.split(';') : [];

      this.onFilterChange('configuration', id, callback);
    };

    let configurationFilter;

    if (filters.configuration) {
      const configuration = configurations.find((c) => c.id === filters.configuration);

      configurationFilter = configuration ? configurationMapper(configuration) : undefined;
    }

    return (
      <SelectPopover id="configuration-filter"
                     title="按配置过滤"
                     triggerNode={<Button bsSize="small" bsStyle="link">配置 <span className="caret" /></Button>}
                     items={configurationItems}
                     itemFormatter={configurationFormatter}
                     onItemSelect={filter}
                     selectedItems={configurationFilter ? [configurationFilter] : []}
                     filterPlaceholder="按配置过滤" />
    );
  },

  getOSFilter() {
    const { collectors, filters } = this.props;

    const operatingSystems = lodash
      .uniq(collectors.map((collector) => lodash.upperFirst(collector.node_operating_system)))
      .sort(naturalSortIgnoreCase);

    const filter = ([os], callback) => this.onFilterChange('os', os, callback);

    const osFilter = filters.os;

    return (
      <SelectPopover id="os-filter"
                     title="按操作系统过滤"
                     triggerNode={<Button bsSize="small" bsStyle="link">操作系统 <span className="caret" /></Button>}
                     items={operatingSystems}
                     onItemSelect={filter}
                     selectedItems={osFilter ? [osFilter] : []}
                     filterPlaceholder="按操作系统过滤" />
    );
  },

  getStatusFilter() {
    const { filters } = this.props;
    const status = Object.keys(SidecarStatusEnum.properties).map((key) => String(key));
    const filter = ([statusCode], callback) => this.onFilterChange('status', statusCode, callback);

    const statusFilter = filters.status;
    const statusFormatter = (statusCode) => lodash.upperFirst(SidecarStatusEnum.toString(statusCode));

    return (
      <SelectPopover id="status-filter"
                     title="按收集器状态过滤"
                     triggerNode={<Button bsSize="small" bsStyle="link">收集器状态 <span className="caret" /></Button>}
                     items={status}
                     itemFormatter={statusFormatter}
                     onItemSelect={filter}
                     selectedItems={statusFilter ? [statusFilter] : []}
                     filterPlaceholder="按收集器状态过滤" />
    );
  },

  render() {
    return (
      <ButtonToolbar>
        {this.getCollectorsFilter()}
        {this.getConfigurationFilter()}
        {this.getStatusFilter()}
        {this.getOSFilter()}
      </ButtonToolbar>
    );
  },
});

export default CollectorsAdministrationFilters;
