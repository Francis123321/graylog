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

import { FieldList, PivotList } from './AggregationBuilderPropTypes';
import PivotSelect from './PivotSelect';

const RowPivotSelect = ({ fields, onChange, rowPivots }) => (
  <PivotSelect placeholder="无：单击以添加字段"
               onChange={onChange}
               options={fields}
               value={rowPivots} />
);

RowPivotSelect.propTypes = {
  fields: FieldList.isRequired,
  onChange: PropTypes.func.isRequired,
  rowPivots: PivotList.isRequired,
};

export default RowPivotSelect;
