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
import React, { useEffect } from 'react';

import HideOnCloud from 'util/conditional/HideOnCloud';
import { Col, Row, Button } from 'components/graylog';
import { Spinner } from 'components/common';
import StoreProvider from 'injection/StoreProvider'; // To make IndexRangesActions work.
import { IndexRangeSummary, ShardMeter, ShardRoutingOverview } from 'components/indices';
import type { IndexInfo } from 'stores/indices/IndicesStore';
import type { IndexRange } from 'stores/indices/IndexRangesStore';
import CombinedProvider from 'injection/CombinedProvider';

type Props = {
  index: IndexInfo,
  indexName: string,
  indexRange: IndexRange,
  indexSetId: string,
  isDeflector: boolean,
};

const { IndicesActions } = CombinedProvider.get('Indices');
const { IndexRangesActions } = CombinedProvider.get('IndexRanges');

StoreProvider.getStore('IndexRanges');

const IndexDetails = ({ index, indexName, indexRange, indexSetId, isDeflector }: Props) => {
  useEffect(() => {
    IndicesActions.subscribe(indexName);

    return () => {
      IndicesActions.unsubscribe(indexName);
    };
  }, [indexName]);

  if (!index || !index.all_shards) {
    return <Spinner />;
  }

  const _onRecalculateIndex = () => {
    if (window.confirm(`Really recalculate the index ranges for index ${indexName}?`)) {
      IndexRangesActions.recalculateIndex(indexName).then(() => {
        IndicesActions.list(indexSetId);
      });
    }
  };

  const _onCloseIndex = () => {
    if (window.confirm(`Really close index ${indexName}?`)) {
      IndicesActions.close(indexName).then(() => {
        IndicesActions.list(indexSetId);
      });
    }
  };

  const _onDeleteIndex = () => {
    if (window.confirm(`Really delete index ${indexName}?`)) {
      IndicesActions.delete(indexName).then(() => {
        IndicesActions.list(indexSetId);
      });
    }
  };

  const _formatActionButtons = () => {
    if (isDeflector) {
      return (
        <span>
          <Button bsStyle="warning" bsSize="xs" disabled>活动写索引无法关闭</Button>{' '}
          <Button bsStyle="danger" bsSize="xs" disabled>无法删除活动写入索引</Button>
        </span>
      );
    }

    return (
      <span>
        <Button bsStyle="warning" bsSize="xs" onClick={_onRecalculateIndex}>重新计算索引范围</Button>{' '}
        <Button bsStyle="warning" bsSize="xs" onClick={_onCloseIndex}>关闭索引</Button>{' '}
        <Button bsStyle="danger" bsSize="xs" onClick={_onDeleteIndex}>删除索引</Button>
      </span>
    );
  };

  return (
    <div className="index-info">
      <IndexRangeSummary indexRange={indexRange} />{' '}

      <HideOnCloud>
        {index.all_shards.segments} segments,{' '}
        {index.all_shards.open_search_contexts} open search contexts,{' '}
        {index.all_shards.documents.deleted} deleted messages
        <Row style={{ marginBottom: '10' }}>
          <Col md={4} className="shard-meters">
            <ShardMeter title="主分片操作" shardMeter={index.primary_shards} />
          </Col>
          <Col md={4} className="shard-meters">
            <ShardMeter title="总分片操作" shardMeter={index.all_shards} />
          </Col>
        </Row>
        <ShardRoutingOverview routing={index.routing} indexName={indexName} />
      </HideOnCloud>
      <hr style={{ marginBottom: '5', marginTop: '10' }} />

      {_formatActionButtons()}
    </div>
  );
};

IndexDetails.propTypes = {
  index: PropTypes.object.isRequired,
  indexName: PropTypes.string.isRequired,
  indexRange: PropTypes.object.isRequired,
  indexSetId: PropTypes.string.isRequired,
  isDeflector: PropTypes.bool.isRequired,
};

export default IndexDetails;
