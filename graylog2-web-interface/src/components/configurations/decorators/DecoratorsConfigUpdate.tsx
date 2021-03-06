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
import React, { useCallback, useState } from 'react';
import { cloneDeep } from 'lodash';

import BootstrapModalWrapper from 'components/bootstrap/BootstrapModalWrapper';
import { Button, Modal } from 'components/graylog';
import { IfPermitted } from 'components/common';
import type { Stream } from 'stores/streams/StreamsStore';
import DecoratorList from 'views/components/messagelist/decorators/DecoratorList';
import AddDecoratorButton from 'views/components/messagelist/decorators/AddDecoratorButton';
import type { Decorator } from 'views/components/messagelist/decorators/Types';

import StreamSelect, { DEFAULT_SEARCH_ID, DEFAULT_STREAM_ID } from './StreamSelect';
import formatDecorator from './FormatDecorator';

type Props = {
  streams: Array<Stream>,
  decorators: Array<Decorator>,
  types: { [key: string]: any },
  // eslint-disable-next-line react/require-default-props
  show?: boolean,
  onCancel: () => void,
  onSave: (newDecorators: Array<Decorator>) => unknown,
};

const _updateOrder = (orderedDecorators, decorators, onChange) => {
  const newDecorators = cloneDeep(decorators);

  orderedDecorators.forEach((item, idx) => {
    const decorator = newDecorators.find((i) => i.id === item.id);

    if (decorator) {
      decorator.order = idx;
    }
  });

  onChange(newDecorators);
};

const DecoratorsConfigUpdate = ({ streams, decorators, types, show = false, onCancel, onSave }: Props, modalRef: React.Ref<BootstrapModalWrapper>) => {
  const [currentStream, setCurrentStream] = useState(DEFAULT_STREAM_ID);
  const [modifiedDecorators, setModifiedDecorators] = useState(decorators);
  const onCreate = useCallback(
    ({ stream, ...rest }) => setModifiedDecorators([...modifiedDecorators, { ...rest, stream: stream === DEFAULT_SEARCH_ID ? null : stream }]),
    [modifiedDecorators, setModifiedDecorators],
  );
  const onReorder = useCallback(
    (orderedDecorators) => _updateOrder(orderedDecorators, modifiedDecorators, setModifiedDecorators),
    [modifiedDecorators, setModifiedDecorators],
  );
  const onSubmit = useCallback(() => onSave(modifiedDecorators), [onSave, modifiedDecorators]);

  const currentDecorators = modifiedDecorators.filter((decorator) => (decorator.stream || DEFAULT_SEARCH_ID) === currentStream);
  const decoratorItems = currentDecorators
    .sort((d1, d2) => d1.order - d2.order)
    .map((decorator) => formatDecorator(decorator, modifiedDecorators, types, setModifiedDecorators));

  const nextOrder = currentDecorators.reduce((currentMax, decorator) => Math.max(currentMax, decorator.order), 0) + 1;

  const _onCancel = useCallback(() => {
    setModifiedDecorators(decorators);
    onCancel();
  }, [decorators, onCancel]);

  return (
    <BootstrapModalWrapper ref={modalRef}
                           showModal={show}
                           onHide={_onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>更新默认装饰器配置</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>选择要更改其默认装饰器集的流。</p>
        <StreamSelect onChange={setCurrentStream} value={currentStream} streams={streams} />

        <IfPermitted permissions="decorators:create">
          <p>选择类型以为此流创建新的装饰器：</p>
          <AddDecoratorButton stream={currentStream} nextOrder={nextOrder} decoratorTypes={types} onCreate={onCreate} showHelp={false} />
        </IfPermitted>

        <p>使用拖放来更改装饰器的执行顺序。</p>

        <DecoratorList decorators={decoratorItems} onReorder={onReorder} />
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" onClick={_onCancel}>取消</Button>
        <Button bsStyle="primary" onClick={onSubmit}>保存</Button>
      </Modal.Footer>
    </BootstrapModalWrapper>
  );
};

export default React.forwardRef<BootstrapModalWrapper, Props>(DecoratorsConfigUpdate);
