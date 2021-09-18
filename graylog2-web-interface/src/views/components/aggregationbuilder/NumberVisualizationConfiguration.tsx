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
import React, { useCallback } from 'react';
import { capitalize } from 'lodash';

import { Input } from 'components/bootstrap';
import { HoverForHelp } from 'components/common';
import Select from 'views/components/Select';
import NumberVisualizationConfig from 'views/logic/aggregationbuilder/visualizations/NumberVisualizationConfig';

type Props = {
  onChange: (config: NumberVisualizationConfig) => void,
  config: NumberVisualizationConfig,
};

const _makeOption = (value) => ({ label: capitalize(value), value });
const trendPreferenceOptions = ['LOWER', 'NEUTRAL', 'HIGHER'].map(_makeOption);

const NumberVisualizationConfiguration = ({ config = NumberVisualizationConfig.empty(), onChange }: Props) => {
  const changeTrend = useCallback(({ target: { checked } }) => onChange(config.toBuilder().trend(checked).build()), [config, onChange]);
  const changeTrendPreference = useCallback(({ value }) => onChange(config.toBuilder().trendPreference(value).build()), [config, onChange]);
  const trendingHelp = (
    <HoverForHelp title="Trending">
      <p>
        如果用户启用趋势，则会在当前值下方显示一个单独的框，通过图标指示变化的方向以及当前值与前一个值之间的绝对和相对差异。
      </p>

      <p>
        前一个值是通过在后台执行两次搜索来计算的，除了时间范围外，它们完全相同。 第一次搜索的时间范围与为此查询/此小部件配置的时间范围相同，第二次是相同的时间范围，但时间范围长度偏移到过去。
      </p>
    </HoverForHelp>
  );

  return (
    <>
      <Input key="trend"
             id="trend"
             type="checkbox"
             name="trend"
             label={<span>Display trend {trendingHelp}</span>}
             defaultChecked={config.trend}
             onChange={changeTrend}
             help="显示此数字的趋势信息。" />

      <Input id="trend_preference" label="Trend Preference" help="选择哪个趋势方向是积极的">
        <Select isDisabled={!config.trend}
                isClearable={false}
                isSearchable={false}
                options={trendPreferenceOptions}
                onChange={changeTrendPreference}
                value={_makeOption(config.trendPreference)} />
      </Input>
    </>
  );
};

export default NumberVisualizationConfiguration;
