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
import React, { useCallback, useState, useContext } from 'react';
import URI from 'urijs';

import history from 'util/History';
import BootstrapModalForm from 'components/bootstrap/BootstrapModalForm';
import { Checkbox, ControlLabel, FormGroup, HelpBlock, MenuItem } from 'components/graylog';
import Input from 'components/bootstrap/Input';
import { Icon } from 'components/common';
import Routes from 'routing/Routes';
import View from 'views/logic/views/View';
import queryTitle from 'views/logic/queries/QueryTitle';
import WidgetFocusContext from 'views/components/contexts/WidgetFocusContext';

export type UntypedBigDisplayModeQuery = {
  interval?: string,
  refresh?: string,
  tabs?: string,
};

type Configuration = {
  queryCycleInterval?: number,
  queryTabs?: Array<number>,
  refreshInterval: number,
};

type ConfigurationModalProps = {
  onClose: () => void,
  onSave: (Configuration) => void,
  show: boolean,
  view: View,
};

const ConfigurationModal = ({ onSave, view, show, onClose }: ConfigurationModalProps) => {
  const availableTabs = view.search.queries.keySeq().map((query, idx) => [
    idx,
    queryTitle(view, query.id),
  ]).toJS();
  const [refreshInterval, setRefreshInterval] = useState(10);
  const [queryTabs, setQueryTabs] = useState(availableTabs.map(([idx]) => idx));
  const [queryCycleInterval, setQueryCycleInterval] = useState(30);
  const addQueryTab = useCallback((idx) => setQueryTabs([...queryTabs, idx]), [queryTabs, setQueryTabs]);
  const removeQueryTab = useCallback((idx) => setQueryTabs(queryTabs.filter((tab) => tab !== idx)), [queryTabs, setQueryTabs]);
  const _onSave = useCallback(() => onSave({
    refreshInterval,
    queryTabs,
    queryCycleInterval,
  }), [onSave, refreshInterval, queryTabs, queryCycleInterval]);

  return (
    <BootstrapModalForm bsSize="large"
                        onModalClose={onClose}
                        onSubmitForm={_onSave}
                        submitButtonText="保存"
                        title="配置全屏"
                        show={show}>
      <Input autoFocus
             id="refresh-interval"
             type="number"
             min="1"
             name="refresh-interval"
             label="刷新间隔"
             help="仪表板应在多少秒后刷新？"
             onChange={({ target: { value } }) => setRefreshInterval(value ? Number.parseInt(value, 10) : value)}
             required
             step={1}
             value={refreshInterval} />

      <FormGroup>
        <ControlLabel>标签</ControlLabel>
        <ul>
          {availableTabs.map(([idx, title]) => (
            <li key={`${idx}-${title}`}>
              <Checkbox inline
                        checked={queryTabs.includes(idx)}
                        onChange={(event) => (event.target.checked ? addQueryTab(idx) : removeQueryTab(idx))}>
                {title}
              </Checkbox>
            </li>
          ))}
        </ul>
        <HelpBlock>
          选择要包括在轮换中的查询选项卡。
        </HelpBlock>
      </FormGroup>

      <Input id="query-cycle-interval"
             type="number"
             min="1"
             name="query-cycle-interval"
             label="制表周期间隔"
             help="应该在多少秒后显示下一个选项卡？"
             onChange={({ target: { value } }) => setQueryCycleInterval(value ? Number.parseInt(value, 10) : value)}
             required
             step="1"
             value={queryCycleInterval} />
    </BootstrapModalForm>
  );
};

const redirectToBigDisplayMode = (view: View, config: UntypedBigDisplayModeQuery, unsetWidgetFocusing): void => {
  unsetWidgetFocusing();

  history.push(
    new URI(Routes.pluginRoute('DASHBOARDS_TV_VIEWID')(view.id))
      .search(config)
      .toString(),
  );
};

const createQueryFromConfiguration = (
  { queryCycleInterval, queryTabs, refreshInterval }: Configuration,
  view: View,
): UntypedBigDisplayModeQuery => {
  const basicConfiguration = {
    interval: Number(queryCycleInterval).toString(),
    refresh: Number(refreshInterval).toString(),
  };
  const allQueryIndices = view.search.queries.toIndexedSeq().map((_, v) => v).toJS();

  return !queryTabs || allQueryIndices.join(',') === queryTabs.join(',')
    ? basicConfiguration
    : { ...basicConfiguration, tabs: queryTabs.join(',') };
};

type Props = {
  disabled?: boolean,
  show?: boolean,
  view: View,
};

const BigDisplayModeConfiguration = ({ disabled, show, view }: Props) => {
  const [showConfigurationModal, setShowConfigurationModal] = useState(show);
  const { unsetWidgetFocusing } = useContext(WidgetFocusContext);
  const onSave = (config: Configuration) => redirectToBigDisplayMode(view, createQueryFromConfiguration(config, view), unsetWidgetFocusing);

  return (
    <>
      {showConfigurationModal && (
        <ConfigurationModal onClose={() => setShowConfigurationModal(false)}
                            onSave={onSave}
                            show
                            view={view} />
      )}
      <MenuItem disabled={disabled} onSelect={() => setShowConfigurationModal(true)}>
        <Icon name="desktop" /> 全屏
      </MenuItem>
    </>
  );
};

BigDisplayModeConfiguration.defaultProps = {
  disabled: false,
  show: false,
};

export default BigDisplayModeConfiguration;
