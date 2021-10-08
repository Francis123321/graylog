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
import styled, { css } from 'styled-components';
import naturalSort from 'javascript-natural-sort';

import { ShardRouting } from 'components/indices';

const ShardRoutingWrap = styled.div(({ theme }) => css`
  .shards {
    .shard {
      padding: 10px;
      margin: 5px;
      width: 50px;
      float: left;
      text-align: center;
    }

    .shard-started {
      background-color: ${theme.utils.colorLevel(theme.colors.variant.light.success, -2)};
    }

    .shard-relocating {
      background-color: ${theme.utils.colorLevel(theme.colors.variant.light.primary, -2)};
    }

    .shard-initializing {
      background-color: ${theme.utils.colorLevel(theme.colors.variant.light.warning, -5)};
    }

    .shard-unassigned {
      background-color: ${theme.utils.colorLevel(theme.colors.variant.light.default, -2)};
    }

    .shard-primary .id {
      font-weight: bold;
      margin-bottom: 3px;
      border-bottom: 1px solid ${theme.colors.gray[10]};
    }
  }

  .description {
    font-size: ${theme.fonts.size.small};
    margin-top: 2px;
    margin-left: 6px;
  }
`);

const ShardRoutingOverview = ({ indexName, routing }) => {
  return (
    <ShardRoutingWrap>
      <h3>分片路由</h3>

      <ul className="shards">
        {routing
          .sort((shard1, shard2) => naturalSort(shard1.id, shard2.id))
          .map((route) => <ShardRouting key={`${indexName}-shard-route-${route.node_id}-${route.id}`} route={route} />)}
      </ul>
      <br style={{ clear: 'both' }} />

      <div className="description">
        粗体分片是主要分片，其他分片是复制品。 当主节点离开集群时，副本会自动被选为主节点。 大小和文档计数仅反映主分片，没有可能的副本重复。
      </div>
    </ShardRoutingWrap>
  );
};

ShardRoutingOverview.propTypes = {
  routing: PropTypes.array.isRequired,
  indexName: PropTypes.string.isRequired,
};

export default ShardRoutingOverview;
