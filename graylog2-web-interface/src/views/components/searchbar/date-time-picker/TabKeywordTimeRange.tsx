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
import { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import trim from 'lodash/trim';
import isEqual from 'lodash/isEqual';
import { Field, useField } from 'formik';

import { Col, FormControl, FormGroup, Panel, Row } from 'components/graylog';
import DateTime from 'logic/datetimes/DateTime';
import StoreProvider from 'injection/StoreProvider';
import DocumentationLink from 'components/support/DocumentationLink';
import DocsHelper from 'util/DocsHelper';

import { EMPTY_RANGE } from '../TimeRangeDisplay';

const ToolsStore = StoreProvider.getStore('Tools');

const KeywordInput = styled(FormControl)(({ theme }) => css`
  min-height: 34px;
  font-size: ${theme.fonts.size.large};
`);

const ErrorMessage = styled.span(({ theme }) => css`
  color: ${theme.colors.variant.dark.danger};
  font-size: ${theme.fonts.size.small};
  font-style: italic;
  padding: 3px 3px 9px;
  display: block;
`);

const _parseKeywordPreview = (data) => {
  const from = DateTime.fromUTCDateTime(data.from).toString();
  const to = DateTime.fromUTCDateTime(data.to).toString();

  return { from, to };
};

type Props = {
  defaultValue: string,
  disabled: boolean,
  setValidatingKeyword: (boolean) => void
};

const TabKeywordTimeRange = ({ defaultValue, disabled, setValidatingKeyword }: Props) => {
  const [nextRangeProps, , nextRangeHelpers] = useField('nextTimeRange');
  const mounted = useRef(true);
  const keywordRef = useRef();
  const [keywordPreview, setKeywordPreview] = useState({ from: '', to: '' });

  const _setSuccessfullPreview = useCallback((response: { from: string, to: string }) => {
    setValidatingKeyword(false);

    return setKeywordPreview(_parseKeywordPreview(response));
  },
  [setValidatingKeyword]);

  const _setFailedPreview = useCallback(() => {
    setKeywordPreview({ from: EMPTY_RANGE, to: EMPTY_RANGE });

    return 'Unable to parse keyword.';
  }, [setKeywordPreview]);

  const _validateKeyword = (keyword: string): Promise<string> | undefined | null => {
    if (keyword === undefined) {
      return undefined;
    }

    setValidatingKeyword(true);

    return trim(keyword) === ''
      ? Promise.resolve('Keyword must not be empty!')
      : ToolsStore.testNaturalDate(keyword)
        .then((response) => {
          if (mounted.current) _setSuccessfullPreview(response);
        })
        .catch(_setFailedPreview);
  };

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (keywordRef.current !== nextRangeProps?.value?.keyword) {
      keywordRef.current = nextRangeProps.value.keyword;

      _validateKeyword(keywordRef.current);
    }
  });

  useEffect(() => {
    if (nextRangeProps?.value) {
      const { type, keyword, ...restPreview } = nextRangeProps?.value;

      if (!isEqual(restPreview, keywordPreview)) {
        nextRangeHelpers.setValue({
          type,
          keyword,
          ...restPreview,
          ...keywordPreview,
        });
      }
    }
  }, [nextRangeProps.value, keywordPreview, nextRangeHelpers]);

  return (
    <Row className="no-bm">
      <Col sm={5}>
        <Field name="nextTimeRange.keyword" validate={_validateKeyword}>
          {({ field: { name, value, onChange }, meta: { error } }) => (
            <FormGroup controlId="form-inline-keyword"
                       style={{ marginRight: 5, width: '100%', marginBottom: 0 }}
                       validationState={error ? 'error' : null}>

              <p><strong>以自然语言指定搜索的时间范围。</strong></p>
              <KeywordInput type="text"
                            className="input-sm mousetrap"
                            name={name}
                            disabled={disabled}
                            placeholder="Last week"
                            onChange={onChange}
                            required
                            value={value || defaultValue} />

              {error && (<ErrorMessage>{error}</ErrorMessage>)}
            </FormGroup>
          )}
        </Field>
      </Col>

      <Col sm={7}>
        <Panel>
          <Panel.Body>
            <p><code>上个月</code> 一个月前到现在的搜索量</p>

            <p><code>4 小时前</code> 四小时前和现在之间的搜索</p>

            <p><code>4 月 1 日至 2 天前</code> 4 月 1 日至 2 天前的搜索</p>

            <p><code>昨天午夜 +0200 到今天午夜 +0200</code> 在时区 +0200 的昨天午夜和今天午夜之间搜索 - UTC 时间为 22:00 </p>

            <p>
              请查阅<DocumentationLink page={DocsHelper.PAGES.TIME_FRAME_SELECTOR}
                                    title="Keyword Time Range Documentation"
                                    text="文件" />了解更多详情。
            </p>
          </Panel.Body>
        </Panel>
      </Col>
    </Row>
  );
};

TabKeywordTimeRange.propTypes = {
  defaultValue: PropTypes.string,
  disabled: PropTypes.bool,
  setValidatingKeyword: PropTypes.func,
};

TabKeywordTimeRange.defaultProps = {
  defaultValue: '',
  disabled: false,
  setValidatingKeyword: () => {},
};

export default TabKeywordTimeRange;
